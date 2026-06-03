import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PER_DAY_PER_IP = 3;
const MAX_PER_MONTH_GLOBAL = 500;
const MAX_BYTES = 8 * 1024 * 1024;

// In-memory rate-limit store. Single-instance only — works for the MVP on a
// single Vercel region with no autoscaling. Before going to multi-region or
// scaling out, swap this for @upstash/ratelimit + Redis.
type IpBucket = { count: number; resetAt: number };
const ipBuckets = new Map<string, IpBucket>();
let monthlyCount = 0;
let monthlyResetAt = nextMonthMs();

function nextMonthMs() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
}

function getIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function tooManyForIp(ip: string): boolean {
  const now = Date.now();
  const bucket = ipBuckets.get(ip);
  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0);

  if (!bucket || bucket.resetAt < now) {
    ipBuckets.set(ip, { count: 1, resetAt: tomorrow.getTime() });
    return false;
  }
  if (bucket.count >= MAX_PER_DAY_PER_IP) return true;
  bucket.count += 1;
  return false;
}

function tooManyGlobally(): boolean {
  const now = Date.now();
  if (monthlyResetAt < now) {
    monthlyCount = 0;
    monthlyResetAt = nextMonthMs();
  }
  if (monthlyCount >= MAX_PER_MONTH_GLOBAL) return true;
  monthlyCount += 1;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  if (tooManyGlobally()) {
    return NextResponse.json(
      { error: "Le simulateur est très sollicité ce mois-ci. Réessayez le mois prochain ou demandez un devis directement." },
      { status: 429 }
    );
  }
  if (tooManyForIp(ip)) {
    return NextResponse.json(
      { error: "Vous avez atteint la limite de 3 générations par jour. Revenez demain ou contactez-nous." },
      { status: 429 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Requête mal formée." }, { status: 400 });
  }

  const file = form.get("image");
  const style = form.get("style");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucune image n'a été reçue." }, { status: 400 });
  }
  if (typeof style !== "string" || !style) {
    return NextResponse.json({ error: "Style manquant." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Le fichier doit être une image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image trop lourde (max 8 Mo)." }, { status: 413 });
  }

  const lead = {
    prenom: String(form.get("lead_prenom") ?? ""),
    nom: String(form.get("lead_nom") ?? ""),
    email: String(form.get("lead_email") ?? ""),
    telephone: String(form.get("lead_telephone") ?? ""),
    ville: String(form.get("lead_ville") ?? ""),
    cp: String(form.get("lead_cp") ?? ""),
  };

  // Fire-and-forget notification email to FBR (does NOT block the generation).
  notifyFbr(file, lead, style, ip).catch((e) => {
    console.error("notifyFbr failed:", e);
  });

  const replicateToken = process.env.REPLICATE_API_TOKEN;

  // ---------- STUB MODE (no API key yet) ----------
  // Renvoie l'image originale en data URL après un faux délai. Permet de tester
  // toute la UX bout-en-bout sans coût. Quand REPLICATE_API_TOKEN sera défini
  // dans Vercel, la branche réelle ci-dessous prend le relais.
  if (!replicateToken) {
    await new Promise((r) => setTimeout(r, 2200));
    const buf = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${buf.toString("base64")}`;
    return NextResponse.json({
      result: dataUrl,
      stubbed: true,
      style,
      note: "STUB — la clé REPLICATE_API_TOKEN n'est pas configurée. Réponse = image originale.",
    });
  }

  // ---------- REAL MODE (Replicate SDXL + ControlNet) ----------
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const inputDataUrl = `data:${file.type};base64,${buf.toString("base64")}`;
    const prompt = buildPrompt(style);

    // SDXL + ControlNet (canny) — façade-aware via control. Le slug exact peut
    // être ajusté quand on aura testé : jagilley/controlnet-canny pour SD 1.5,
    // ou un modèle Flux/Photo SDXL plus récent.
    const createRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${replicateToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "9e6e0d3df6f6b7e8a4c5cdb8a85f0c1f2e3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c", // TODO: remplacer par la version pinnée du modèle choisi
        input: {
          image: inputDataUrl,
          prompt,
          negative_prompt:
            "people, cars, vehicles, blurry, low quality, distorted, text, watermark, logo",
          num_inference_steps: 30,
          guidance_scale: 7,
        },
      }),
    });

    if (!createRes.ok) {
      const txt = await createRes.text();
      console.error("Replicate create error:", txt);
      return NextResponse.json(
        { error: "Le service IA est temporairement indisponible. Réessayez dans un instant." },
        { status: 502 }
      );
    }

    const created = await createRes.json();
    const pollUrl = created.urls?.get;
    if (!pollUrl) {
      return NextResponse.json({ error: "Réponse IA invalide." }, { status: 502 });
    }

    // Poll jusqu'à 60 s
    const start = Date.now();
    while (Date.now() - start < 60_000) {
      await new Promise((r) => setTimeout(r, 1500));
      const pollRes = await fetch(pollUrl, {
        headers: { Authorization: `Bearer ${replicateToken}` },
      });
      const poll = await pollRes.json();
      if (poll.status === "succeeded") {
        const url = Array.isArray(poll.output) ? poll.output[poll.output.length - 1] : poll.output;
        return NextResponse.json({ result: url, style, stubbed: false });
      }
      if (poll.status === "failed" || poll.status === "canceled") {
        return NextResponse.json(
          { error: "La génération a échoué. Réessayez avec une autre photo." },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(
      { error: "Délai dépassé. Réessayez dans un instant." },
      { status: 504 }
    );
  } catch (err) {
    console.error("Simulator route error:", err);
    return NextResponse.json(
      { error: "Une erreur inattendue est survenue côté serveur." },
      { status: 500 }
    );
  }
}

/**
 * Send a notification email to FBR with the lead info + uploaded photo.
 * - Real mode: uses Resend (RESEND_API_KEY required). The photo goes as
 *   attachment, the lead info is in the body.
 * - Stub mode: just logs to the server console — no crash if no key.
 *
 * Required env vars for real mode (set in Vercel):
 *   RESEND_API_KEY        — your Resend API key
 *   FBR_NOTIFY_TO         — destination address (e.g. contact@fbr-patrimoine.com)
 *   FBR_NOTIFY_FROM       — verified sender (e.g. "Simulateur FBR <noreply@fbr-patrimoine.com>")
 */
async function notifyFbr(
  file: File,
  lead: { prenom: string; nom: string; email: string; telephone: string; ville: string; cp: string },
  styleId: string,
  ip: string
) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.FBR_NOTIFY_TO;
  const from = process.env.FBR_NOTIFY_FROM;

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
      <tr><td><b>Style demandé</b></td><td>${escapeHtml(styleId)}</td></tr>
      <tr><td><b>IP</b></td><td>${escapeHtml(ip)}</td></tr>
      <tr><td><b>Date</b></td><td>${new Date().toLocaleString("fr-FR")}</td></tr>
    </table>
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
      attachments: [
        { filename, content: buf.toString("base64") },
      ],
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

function buildPrompt(styleId: string): string {
  const map: Record<string, string> = {
    chaux:
      "the same building facade, freshly renovated with traditional lime plaster (enduit à la chaux) in warm cream tones, restored haussmannian details, clean stonework, soft natural daylight, architectural photography, photorealistic, high detail, sharp focus",
    moderne:
      "the same building facade, fully renovated with smooth modern mineral plaster in light neutral tones, contemporary clean finish, restored balconies and windows, natural daylight, architectural photography, photorealistic, high detail",
    ite:
      "the same building facade, retrofitted with exterior wood cladding for thermal insulation (ITE bardage bois), vertical wood panels in warm natural tones, contemporary look, restored window frames, natural daylight, architectural photography, photorealistic",
    "ite-enduit":
      "the same building facade, retrofitted with external thermal insulation finished with smooth tinted mineral plaster, clean modern envelope, restored joinery, natural daylight, architectural photography, photorealistic, high detail",
  };
  return map[styleId] ?? map.chaux;
}
