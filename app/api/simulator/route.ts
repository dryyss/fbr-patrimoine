import { NextRequest, NextResponse } from "next/server";
import { checkFacade } from "@/lib/simulator/vision";
import { getRulesFor } from "@/lib/simulator/rules";
import { composePrompt } from "@/lib/simulator/prompt";
import { refinePromptViaGemini } from "@/lib/simulator/gemini";
import { generateFacadeImage } from "@/lib/simulator/gemini-image";
import { checkIpLimit, checkMonthlyLimit, rateLimitBackend } from "@/lib/simulator/rate-limit";
import type { Intensity, StyleId } from "@/lib/simulator/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// La génération Gemini Image peut prendre 10–20 s. On laisse 60 s pour
// absorber les pics ; au-delà, on renvoie un timeout propre.
export const maxDuration = 60;

const MAX_BYTES = 8 * 1024 * 1024;
const VALID_STYLES: StyleId[] = ["chaux", "moderne", "ite", "ite-enduit"];
const VALID_INTENSITIES: Intensity[] = [1, 2, 3];

function getIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Requête mal formée." }, { status: 400 });
  }

  const file = form.get("image");
  const styleRaw = String(form.get("style") ?? "");
  const intensityRaw = parseInt(String(form.get("intensity") ?? "2"), 10);
  const description = String(form.get("description") ?? "").trim().slice(0, 500);

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucune image n'a été reçue." }, { status: 400 });
  }
  if (!VALID_STYLES.includes(styleRaw as StyleId)) {
    return NextResponse.json({ error: "Style invalide." }, { status: 400 });
  }
  if (!VALID_INTENSITIES.includes(intensityRaw as Intensity)) {
    return NextResponse.json({ error: "Intensité invalide." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Le fichier doit être une image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image trop lourde (max 8 Mo)." }, { status: 413 });
  }

  const style = styleRaw as StyleId;
  const intensity = intensityRaw as Intensity;
  const isDemo = process.env.SIMULATOR_DEMO === "true";

  // ---------- 1. VISION CHECK (server-side, do not trust front) ----------
  const vision = await checkFacade(file);
  if (!vision.is_facade) {
    return NextResponse.json(
      {
        error:
          vision.rejection_reason ??
          "Cette image ne semble pas montrer une façade exploitable. Réessayez avec une photo de votre bâtiment vu de l'extérieur.",
        vision,
      },
      { status: 422 }
    );
  }

  // ---------- 2. Vérifier que le style est compatible avec le bâti ----------
  const rules = getRulesFor(vision.building_type);
  if (!rules.allowedStyles.includes(style)) {
    const blocked = rules.blockedStyles.find((b) => b.id === style);
    return NextResponse.json(
      {
        error:
          blocked?.reason ??
          "Le style choisi n'est pas compatible avec ce type de bâtiment.",
        vision,
      },
      { status: 422 }
    );
  }

  // ---------- 3. Rate-limit (Upstash si configuré, sinon mémoire) ----------
  const monthly = await checkMonthlyLimit();
  if (!monthly.ok) {
    return NextResponse.json(
      { error: "Le simulateur est très sollicité ce mois-ci. Réessayez le mois prochain ou demandez un devis directement." },
      { status: 429 }
    );
  }
  const ipLimit = await checkIpLimit(ip);
  if (!ipLimit.ok) {
    return NextResponse.json(
      { error: "Vous avez atteint la limite quotidienne de générations. Revenez demain ou contactez-nous." },
      { status: 429 }
    );
  }

  const lead = {
    prenom: String(form.get("lead_prenom") ?? ""),
    nom: String(form.get("lead_nom") ?? ""),
    email: String(form.get("lead_email") ?? ""),
    telephone: String(form.get("lead_telephone") ?? ""),
    ville: String(form.get("lead_ville") ?? ""),
    cp: String(form.get("lead_cp") ?? ""),
  };

  // ---------- 4. Raffinage Gemini de la description (best-effort, 5s max) ----------
  const refinedDescription = description
    ? await refinePromptViaGemini(description, style, vision.building_type)
    : null;
  const promptDescription = refinedDescription ?? description;

  // ---------- 5. Compose le prompt enrichi par la vision ----------
  const { prompt, negative_prompt } = composePrompt(vision, style, intensity, promptDescription);

  // ---------- 6. Notif FBR en fire-and-forget ----------
  notifyFbr(file, lead, style, intensity, vision, description, ip).catch((e) => {
    console.error("notifyFbr failed:", e);
  });

  // ---------- 7. GÉNÉRATION ----------
  // Mode démo explicite (SIMULATOR_DEMO=true) OU absence de clé Gemini :
  // on renvoie l'image originale après un faux délai pour valider la UX
  // bout-en-bout sans coût.
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (isDemo || !apiKey) {
    await new Promise((r) => setTimeout(r, 2200));
    const buf = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${buf.toString("base64")}`;
    return NextResponse.json({
      result: dataUrl,
      stubbed: true,
      reason: isDemo ? "demo_mode" : "no_gemini_key",
      style,
      intensity,
      vision,
      prompt,
      negative_prompt,
      description_raw: description || null,
      description_refined: refinedDescription,
      rate_limit_backend: rateLimitBackend(),
      note: isDemo
        ? "STUB — SIMULATOR_DEMO=true. Réponse = image originale."
        : "STUB — GEMINI_API_KEY non configurée. Réponse = image originale.",
    });
  }

  // ---------- 8. Mode réel — Gemini 2.5 Flash Image ----------
  const gen = await generateFacadeImage(file, prompt, negative_prompt);
  if (!gen.ok) {
    return NextResponse.json({ error: gen.error }, { status: 502 });
  }

  return NextResponse.json({
    result: gen.dataUrl,
    stubbed: false,
    style,
    intensity,
    vision,
  });
}

/**
 * Notification email vers FBR (Resend) avec photo en pièce jointe + résultat
 * de la vision pour pré-qualifier le lead.
 */
async function notifyFbr(
  file: File,
  lead: { prenom: string; nom: string; email: string; telephone: string; ville: string; cp: string },
  styleId: string,
  intensity: number,
  vision: Awaited<ReturnType<typeof checkFacade>>,
  description: string,
  ip: string
) {
  const key = process.env.RESEND_API_KEY?.trim();
  const to = process.env.FBR_NOTIFY_TO?.trim();
  const from = process.env.FBR_NOTIFY_FROM?.trim();

  const subject = `Nouveau lead Simulateur — ${lead.prenom || "?"} ${lead.nom || "?"} (${lead.ville || "?"})`;
  const html = `
    <h2 style="font-family:Georgia,serif;color:#0c1f42">Nouveau lead via le simulateur IA</h2>
    <p>Une personne vient d'utiliser le simulateur de façade rénovée sur fbr-patrimoine.com.</p>
    <table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
      <tr><td><b>Prénom</b></td><td>${escapeHtml(lead.prenom)}</td></tr>
      <tr><td><b>Nom</b></td><td>${escapeHtml(lead.nom)}</td></tr>
      <tr><td><b>Email</b></td><td><a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></td></tr>
      <tr><td><b>Téléphone</b></td><td><a href="tel:${escapeHtml(lead.telephone)}">${escapeHtml(lead.telephone)}</a></td></tr>
      <tr><td><b>Ville</b></td><td>${escapeHtml(lead.ville)}${lead.cp ? ` (${escapeHtml(lead.cp)})` : ""}</td></tr>
      <tr><td><b>Style demandé</b></td><td>${escapeHtml(styleId)} · intensité ${intensity}/3</td></tr>
      <tr><td colspan="2" style="padding-top:14px"><b>Pré-qualification IA</b></td></tr>
      <tr><td><b>Type de bâti</b></td><td>${escapeHtml(vision.building_type)}</td></tr>
      <tr><td><b>Époque</b></td><td>${escapeHtml(vision.estimated_era ?? "?")}</td></tr>
      <tr><td><b>Matériau apparent</b></td><td>${escapeHtml(vision.current_material ?? "?")}</td></tr>
      <tr><td><b>État</b></td><td>${escapeHtml(vision.current_state ?? "?")}</td></tr>
      <tr><td><b>Protégé probable</b></td><td>${vision.protected_likely ? "Oui" : "Non / inconnu"}</td></tr>
      <tr><td><b>IP</b></td><td>${escapeHtml(ip)}</td></tr>
      <tr><td><b>Date</b></td><td>${new Date().toLocaleString("fr-FR")}</td></tr>
    </table>
    ${
      description
        ? `<h3 style="margin-top:20px;font-family:Georgia,serif;color:#0c1f42">Précisions du visiteur</h3>
           <div style="background:#f8f4ec;padding:14px 18px;border-left:3px solid #d97a3a;white-space:pre-wrap;font-family:Arial,sans-serif;font-size:14px;color:#0c1f42">${escapeHtml(description)}</div>`
        : ""
    }
    <p style="color:#7a8294;font-size:12px;margin-top:24px">
      La photo de la façade est jointe à cet email. Recontactez la personne sous
      48h ouvrées pour transformer le lead.
    </p>
  `;

  if (!key || !to || !from) {
    console.info("[simulator] notifyFbr (stub) — no Resend env vars set", {
      subject,
      lead,
      styleId,
      intensity,
      vision,
      description,
      fileBytes: file.size,
    });
    return;
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = (file.type.split("/")[1] || "jpg").toLowerCase();
  const filename = `facade-${Date.now()}.${ext}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email || undefined,
      subject,
      html,
      attachments: [{ filename, content: buf.toString("base64") }],
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error("Resend error:", res.status, txt);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
