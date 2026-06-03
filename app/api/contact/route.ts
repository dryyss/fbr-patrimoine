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

  const key = process.env.RESEND_API_KEY;
  const to = process.env.FBR_NOTIFY_TO;
  const from = process.env.FBR_NOTIFY_FROM;

  if (!key || !to || !from) {
    // Don't silently drop production leads. Log loudly, return 503 so the form
    // shows the user "réessayez ou appelez-nous" instead of false success.
    console.error("[contact] Resend not configured — env vars manquantes", { key: !!key, to: !!to, from: !!from });
    return NextResponse.json(
      { error: "Le service email est temporairement indisponible. Appelez-nous au 07 63 20 87 53." },
      { status: 503 }
    );
  }

  try {
    await Promise.all([
      sendInternalNotification({ key, to, from, lead, ip }),
      // Acknowledgement is best-effort: if it fails we still consider the lead captured.
      sendProspectAcknowledgement({ key, from, lead }).catch((e) => {
        console.error("[contact] prospect ACK failed:", e);
      }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] internal email failed:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue à l'envoi. Réessayez ou appelez-nous au 07 63 20 87 53." },
      { status: 502 }
    );
  }
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
