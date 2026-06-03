"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { trackLead } from "@/lib/analytics";

// Replace with your Formspree endpoint (https://formspree.io/forms)
// Set NEXT_PUBLIC_FORMSPREE_ID in .env.local once the endpoint is created.
const FORMSPREE_ID =
  process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "your-form-id";

type Status = "idle" | "submitting" | "error";

type Props = {
  /** Identifies which page the form lives on (e.g. "contact", "devis-ravalement"). Used as lead_source in the analytics event. */
  source?: string;
  /** Pre-fills the "Type de projet" select. */
  defaultProject?: string;
};

export default function ContactForm({ source = "contact", defaultProject = "" }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        trackLead({
          source,
          projectType: String(data.get("projet") ?? "") || undefined,
          postalCode: String(data.get("cp") ?? "") || undefined,
          profile: String(data.get("profil") ?? "") || undefined,
        });
        router.push(`/contact/merci?source=${encodeURIComponent(source)}`);
      } else {
        const json = await res.json().catch(() => null);
        const message = json?.errors?.map((er: { message: string }) => er.message).join(" · ");
        setStatus("error");
        setErrorMsg(message ?? "Une erreur est survenue. Veuillez réessayer.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Impossible de joindre le serveur. Vérifiez votre connexion.");
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      {status === "error" && (
        <div className="form-error" role="alert">
          {errorMsg}
        </div>
      )}

      <div className="contact-form-row">
        <input type="text" name="prenom" placeholder="Prénom *" required />
        <input type="text" name="nom" placeholder="Nom *" required />
      </div>

      <div className="contact-form-row">
        <input type="email" name="email" placeholder="Adresse email *" required />
        <input type="tel" name="telephone" placeholder="Téléphone *" required />
      </div>

      <select name="profil" required defaultValue="">
        <option value="">Vous êtes... *</option>
        <option>Particulier propriétaire</option>
        <option>Syndic / conseil syndical (copropriété)</option>
        <option>Collectivité / paroisse</option>
        <option>Architecte / maître d&apos;œuvre</option>
        <option>Autre</option>
      </select>

      <select name="projet" required defaultValue={defaultProject}>
        <option value="">Type de projet *</option>
        <option>Ravalement de façade</option>
        <option>Isolation thermique extérieure (ITE)</option>
        <option>Maçonnerie générale (gros œuvre, second œuvre)</option>
        <option>Réhabilitation du patrimoine ancien</option>
        <option>Restauration d&apos;édifice religieux</option>
        <option>Cage d&apos;escalier / parties communes</option>
        <option>VRD, dalles, escaliers, chapes</option>
        <option>Études techniques & accompagnement de projet</option>
        <option>Peinture extérieure / intérieure</option>
        <option>Autre / projet mixte</option>
      </select>

      <div className="contact-form-row">
        <input
          type="text"
          name="cp"
          placeholder="Code postal du chantier *"
          required
          pattern="[0-9]{5}"
          maxLength={5}
        />
        <input type="text" name="ville" placeholder="Ville" />
      </div>

      <textarea
        name="message"
        placeholder="Décrivez votre projet (surface, état actuel, contraintes, délais souhaités…)"
      />

      <input type="hidden" name="lead_source" value={source} />

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
        <input
          type="checkbox"
          name="rgpd"
          required
          style={{ marginTop: 3, flexShrink: 0 }}
        />
        <span>
          J&apos;accepte que mes données soient traitées par FBR Patrimoine pour le suivi
          de ma demande, conformément à la{" "}
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
        disabled={status === "submitting"}
        style={{ marginTop: 14, justifyContent: "center", width: "100%" }}
      >
        {status === "submitting" ? "Envoi en cours…" : "Envoyer ma demande de devis"}
        {status !== "submitting" && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        )}
      </button>

      <p className="contact-form-foot">
        <strong>Réponse sous 48h ouvrées.</strong> Étude gratuite, sans engagement. Vos
        données restent confidentielles et ne sont jamais transmises à des tiers.
      </p>
    </form>
  );
}
