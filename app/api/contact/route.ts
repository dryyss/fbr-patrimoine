import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Anti-abuse: bots filling the honeypot, or one IP submitting more than
// MAX_PER_DAY_PER_IP times in 24h, get silently dropped.
const MAX_PER_DAY_PER_IP = 5;
type IpBucket = { count: number; resetAt: number };
const ipBuckets = new Map<string, IpBucket>();

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

type Lead = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  profil: string;
  projet: string;
  cp: string;
  ville: string;
  message: string;
  source: string;
};

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Requête mal formée." }, { status: 400 });
  }

  // Honeypot — real users never fill this hidden field.
  if (String(form.get("website") ?? "").trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (tooManyForIp(ip)) {
    return NextResponse.json(
      { error: "Trop de demandes envoyées depuis votre connexion. Réessayez demain ou appelez-nous au 07 63 20 87 53." },
      { status: 429 }
    );
  }

  const lead: Lead = {
    prenom: String(form.get("prenom") ?? "").trim(),
    nom: String(form.get("nom") ?? "").trim(),
    email: String(form.get("email") ?? "").trim(),
    telephone: String(form.get("telephone") ?? "").trim(),
    profil: String(form.get("profil") ?? "").trim(),
    projet: String(form.get("projet") ?? "").trim(),
    cp: String(form.get("cp") ?? "").trim(),
    ville: String(form.get("ville") ?? "").trim(),
    message: String(form.get("message") ?? "").trim(),
    source: String(form.get("lead_source") ?? "contact").trim(),
  };

  if (!lead.prenom || !lead.nom || !lead.email || !lead.telephone || !lead.projet || !lead.cp) {
    return NextResponse.json(
      { error: "Merci de compléter les champs obligatoires." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }
  if (!/^[0-9]{5}$/.test(lead.cp)) {
    return NextResponse.json({ error: "Code postal invalide (5 chiffres)." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY?.trim();
  const to = process.env.FBR_NOTIFY_TO?.trim();
  const from = process.env.FBR_NOTIFY_FROM?.trim();

  if (!key || !to || !from) {
    // En dev (NODE_ENV !== "production") : on log loud + on simule un succès,
    // pour que le développeur puisse tester le flow complet sans avoir à
    // configurer Resend localement.
    if (process.env.NODE_ENV !== "production") {
      console.info(
        "\n[contact] DEV FALLBACK — lead reçu (Resend non configuré localement) :\n" +
          JSON.stringify(lead, null, 2) +
          `\nIP: ${ip}\n`
      );
      return NextResponse.json({ ok: true, devFallback: true });
    }
    // En prod : pas de fallback silencieux. On préfère 503 + message clair
    // "réessayez ou appelez-nous" plutôt que de perdre le lead.
    console.error("[contact] Resend not configured — env vars manquantes", { key: !!key, to: !!to, from: !!from });
    return NextResponse.json(
      { error: "Le service email est temporairement indisponible. Appelez-nous au 07 63 20 87 53." },
      { status: 503 }
    );
  }

  const notifyTo = resolveNotifyTo(to, from);
  const canAckProspect = canSendProspectAck(lead.email, from);

  try {
    await sendInternalNotification({ key, to: notifyTo, from, lead, ip });
    if (canAckProspect) {
      await sendProspectAcknowledgement({ key, from, lead }).catch((e) => {
        console.error("[contact] prospect ACK failed:", e);
      });
    } else {
      console.info(
        `[contact] Accusé prospect non envoyé (mode test Resend) — email réel : ${lead.email}`
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] internal email failed:", err);

    // Mode test Resend : si la notif interne échoue encore, on ne bloque pas
    // le prospect en dev — le lead est loggé côté serveur.
    if (process.env.NODE_ENV !== "production" && isResendSandbox(from)) {
      console.info(
        "\n[contact] DEV — lead capturé malgré échec Resend :\n" +
          JSON.stringify({ ...lead, notifyTo, ip }, null, 2) +
          "\n"
      );
      return NextResponse.json({ ok: true, devFallback: true });
    }

    const hint = resendErrorHint(err);
    return NextResponse.json(
      {
        error:
          hint ??
          "Une erreur est survenue à l'envoi. Réessayez ou appelez-nous au 07 63 20 87 53.",
      },
      { status: 502 }
    );
  }
}

/** Resend sandbox only allows onboarding@resend.dev as sender. */
function isResendSandbox(from: string): boolean {
  return from.includes("onboarding@resend.dev");
}

/** In sandbox, notifications must go to the Resend account email. */
function resolveNotifyTo(configuredTo: string, from: string): string {
  if (!isResendSandbox(from)) return configuredTo;
  return process.env.RESEND_TEST_RECIPIENT?.trim() || configuredTo;
}

/** In sandbox, prospect ACK only works when their email matches the test recipient. */
function canSendProspectAck(prospectEmail: string, from: string): boolean {
  if (!isResendSandbox(from)) return true;
  const allowed =
    process.env.RESEND_TEST_RECIPIENT?.trim() ||
    process.env.FBR_NOTIFY_TO?.trim();
  if (!allowed) return false;
  return prospectEmail.trim().toLowerCase() === allowed.toLowerCase();
}

function resendErrorHint(err: unknown): string | null {
  const msg = err instanceof Error ? err.message : String(err);
  if (!msg.includes("403") && !msg.includes("validation_error")) return null;
  if (msg.includes("only send testing emails")) {
    return "Configuration email en cours. Votre demande a été enregistrée — nous vous rappelons au 07 63 20 87 53 si besoin urgent.";
  }
  return null;
}

async function sendInternalNotification(args: {
  key: string;
  to: string;
  from: string;
  lead: Lead;
  ip: string;
}) {
  const { key, to, from, lead, ip } = args;

  const subject = `Nouvelle demande de devis — ${lead.prenom} ${lead.nom} (${lead.ville || lead.cp})`;
  const html = `
    <div style="font-family:Arial,sans-serif;color:#0c1f42;max-width:640px">
      <h2 style="font-family:Georgia,serif;color:#0c1f42;border-bottom:2px solid #d97a3a;padding-bottom:8px">
        Nouvelle demande de devis
      </h2>
      <p>Une demande de devis vient d'arriver via <strong>${escapeHtml(lead.source)}</strong> sur fbr-patrimoine.com.</p>

      <table cellpadding="8" style="font-size:14px;border-collapse:collapse;margin-top:12px;width:100%">
        <tr style="background:#f8f4ec"><td style="width:170px"><b>Prénom / Nom</b></td><td>${escapeHtml(lead.prenom)} ${escapeHtml(lead.nom)}</td></tr>
        <tr><td><b>Email</b></td><td><a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></td></tr>
        <tr style="background:#f8f4ec"><td><b>Téléphone</b></td><td><a href="tel:${escapeHtml(lead.telephone)}">${escapeHtml(lead.telephone)}</a></td></tr>
        <tr><td><b>Profil</b></td><td>${escapeHtml(lead.profil)}</td></tr>
        <tr style="background:#f8f4ec"><td><b>Type de projet</b></td><td><strong>${escapeHtml(lead.projet)}</strong></td></tr>
        <tr><td><b>Localisation</b></td><td>${escapeHtml(lead.ville)} ${lead.cp ? `(${escapeHtml(lead.cp)})` : ""}</td></tr>
        <tr style="background:#f8f4ec"><td><b>Source</b></td><td>${escapeHtml(lead.source)}</td></tr>
        <tr><td><b>IP</b></td><td>${escapeHtml(ip)}</td></tr>
        <tr style="background:#f8f4ec"><td><b>Date</b></td><td>${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}</td></tr>
      </table>

      ${
        lead.message
          ? `<h3 style="margin-top:20px;font-family:Georgia,serif">Message du prospect</h3>
             <div style="background:#f8f4ec;padding:14px 18px;border-left:3px solid #d97a3a;white-space:pre-wrap">${escapeHtml(lead.message)}</div>`
          : ""
      }

      <p style="margin-top:24px;font-size:13px;color:#7a8294">
        ⏱ Recontacter ce prospect sous <strong>48h ouvrées</strong> — délai annoncé sur le site.
      </p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Resend ${res.status}: ${txt}`);
  }
}

async function sendProspectAcknowledgement(args: { key: string; from: string; lead: Lead }) {
  const { key, from, lead } = args;

  const subject = "Votre demande a bien été reçue — FBR Patrimoine";
  const html = `
    <div style="font-family:Arial,sans-serif;color:#0c1f42;max-width:600px">
      <h2 style="font-family:Georgia,serif;color:#0c1f42">Bonjour ${escapeHtml(lead.prenom)},</h2>

      <p>Nous avons bien reçu votre demande concernant <strong>${escapeHtml(lead.projet)}</strong>. Merci de la confiance que vous nous accordez.</p>

      <p>Un membre de notre équipe <strong>vous recontactera sous 48h ouvrées</strong> au numéro indiqué pour échanger sur votre projet et planifier la visite technique gratuite sur site.</p>

      <div style="background:#f8f4ec;padding:18px;border-radius:8px;margin:24px 0">
        <strong>Récapitulatif de votre demande</strong>
        <ul style="margin:8px 0 0 0;padding-left:20px">
          <li>Type de projet : ${escapeHtml(lead.projet)}</li>
          <li>Localisation : ${escapeHtml(lead.ville)} ${lead.cp ? `(${escapeHtml(lead.cp)})` : ""}</li>
          <li>Téléphone : ${escapeHtml(lead.telephone)}</li>
        </ul>
      </div>

      <p>Une question urgente&nbsp;? Vous pouvez nous joindre directement :</p>
      <p>
        📞 <a href="tel:0763208753" style="color:#a85820;font-weight:bold;text-decoration:none">07 63 20 87 53</a><br>
        ✉️ <a href="mailto:contact@fbr-patrimoine.com" style="color:#a85820;text-decoration:none">contact@fbr-patrimoine.com</a><br>
        🕐 Du lundi au samedi, 8h–19h
      </p>

      <p style="margin-top:32px">À très vite,<br><strong>L'équipe FBR Patrimoine</strong></p>

      <hr style="border:none;border-top:1px solid #e0d7c5;margin:28px 0">
      <p style="font-size:12px;color:#7a8294;line-height:1.5">
        FBR Patrimoine — Société Francilienne de Bâtiment et Réhabilitation<br>
        7 Rue Joliot Curie, 95800 Courdimanche · Qualibat RGE · FFB 95 · Garantie décennale<br>
        Cet email est un accusé de réception automatique. Pour répondre, écrivez à contact@fbr-patrimoine.com.
      </p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [lead.email],
      reply_to: "contact@fbr-patrimoine.com",
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Resend ACK ${res.status}: ${txt}`);
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
