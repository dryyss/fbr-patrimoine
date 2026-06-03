"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SESSION_KEY = "fbr-sim-lead";

export type Lead = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  cp?: string;
  ts: number;
};

export function readLead(): Lead | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const lead = JSON.parse(raw) as Lead;
    if (!lead.email || !lead.nom) return null;
    return lead;
  } catch {
    return null;
  }
}

export default function SimulateurGate({ children }: { children: React.ReactNode }) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLead(readLead());
    setReady(true);
  }, []);

  if (!ready) return null;

  if (lead) {
    return (
      <>
        <div className="sim-lead-banner">
          <div>
            <strong>Bonjour {lead.prenom},</strong> à chaque génération, notre
            équipe sera notifiée avec votre photo et vos coordonnées
            (<em>{lead.email}</em>) pour vous rappeler sous 48h ouvrées.
          </div>
          <button
            type="button"
            className="sim-lead-change"
            onClick={() => {
              sessionStorage.removeItem(SESSION_KEY);
              setLead(null);
            }}
          >
            Modifier mes infos
          </button>
        </div>
        {children}
      </>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setSubmitting(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const newLead: Lead = {
      prenom: String(fd.get("prenom") ?? "").trim(),
      nom: String(fd.get("nom") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      telephone: String(fd.get("telephone") ?? "").trim(),
      ville: String(fd.get("ville") ?? "").trim(),
      cp: String(fd.get("cp") ?? "").trim() || undefined,
      ts: Date.now(),
    };

    if (!newLead.prenom || !newLead.nom || !newLead.email || !newLead.telephone || !newLead.ville) {
      setErr("Merci de compléter tous les champs obligatoires.");
      setSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newLead.email)) {
      setErr("L'adresse email ne semble pas valide.");
      setSubmitting(false);
      return;
    }

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(newLead));
    setLead(newLead);
    setSubmitting(false);
  }

  return (
    <div className="sim-gate">
      <div className="sim-gate-head">
        <div className="section-label">Accès au simulateur</div>
        <h2>
          Avant de générer votre <em>aperçu</em>.
        </h2>
        <p>
          Pour utiliser le simulateur, merci de renseigner vos coordonnées.
          Dès que vous lancerez votre simulation, notre équipe sera alertée — votre
          photo et vos informations nous parviendront automatiquement, et nous vous
          rappellerons sous 48h ouvrées avec un diagnostic personnalisé sur votre
          projet, sans engagement.
        </p>
      </div>

      <form className="sim-gate-form contact-form" onSubmit={onSubmit} noValidate>
        {err && <div className="form-error" role="alert">{err}</div>}

        <div className="contact-form-row">
          <input type="text" name="prenom" placeholder="Prénom *" required autoComplete="given-name" />
          <input type="text" name="nom" placeholder="Nom *" required autoComplete="family-name" />
        </div>

        <div className="contact-form-row">
          <input type="email" name="email" placeholder="Adresse email *" required autoComplete="email" />
          <input type="tel" name="telephone" placeholder="Téléphone *" required autoComplete="tel" />
        </div>

        <div className="contact-form-row">
          <input type="text" name="ville" placeholder="Ville du chantier *" required autoComplete="address-level2" />
          <input type="text" name="cp" placeholder="Code postal" pattern="[0-9]{5}" maxLength={5} autoComplete="postal-code" />
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            fontSize: 13,
            color: "var(--ink-soft)",
            marginTop: 8,
            lineHeight: 1.5,
          }}
        >
          <input type="checkbox" name="rgpd" required style={{ marginTop: 3, flexShrink: 0 }} />
          <span>
            J&apos;accepte que mes données et la photo téléversée soient transmises à
            FBR Patrimoine pour le suivi de ma demande, conformément à la{" "}
            <Link
              href="/politique-confidentialite"
              style={{ color: "var(--orange-deep)", textDecoration: "underline" }}
            >
              politique de confidentialité
            </Link>
            . *
          </span>
        </label>

        <button
          type="submit"
          className="btn-primary"
          disabled={submitting}
          style={{ marginTop: 14, justifyContent: "center", width: "100%" }}
        >
          {submitting ? "Validation…" : "Accéder au simulateur"}
          {!submitting && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </button>

        <p className="contact-form-foot">
          <strong>Vos données sont sécurisées.</strong> Elles ne sont jamais
          transmises à des tiers et sont supprimées dans les 24h suivant la
          dernière génération.
        </p>
      </form>
    </div>
  );
}
