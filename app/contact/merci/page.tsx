import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { EmailLink, TelLink } from "@/components/TrackedContact";

// Don't index the conversion page (avoid polluting Search Console with thank-you visits).
export const metadata: Metadata = {
  title: "Merci — votre demande a bien été envoyée",
  description:
    "Votre demande de devis a bien été reçue. Notre équipe vous recontactera sous 48h ouvrées.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.fbr-patrimoine.com/contact/merci" },
};

export default function MerciPage() {
  return (
    <>
      <PageHero
        bgImage="/project6.jpg"
        breadcrumb="Demande reçue"
        eyebrow="Confirmation"
        title={
          <>
            Merci, votre demande <em>a bien été envoyée</em>.
          </>
        }
        description="Nous avons bien reçu votre demande de devis. Un membre de notre équipe vous recontactera sous 48h ouvrées au numéro indiqué pour échanger sur votre projet."
      />

      <section className="contact-page">
        <div className="container" style={{ maxWidth: 820 }}>
          <div
            className="contact-form-card reveal"
            style={{ textAlign: "left" }}
          >
            <h2>Et maintenant&nbsp;?</h2>
            <ol style={{ paddingLeft: 20, lineHeight: 1.8, color: "var(--ink-soft)" }}>
              <li>
                <strong>Sous 48h ouvrées</strong> — un de nos conseillers vous appelle
                pour qualifier votre besoin et planifier la visite technique.
              </li>
              <li>
                <strong>Visite gratuite</strong> sur le chantier pour établir un
                diagnostic précis (état du bâti, contraintes, accès).
              </li>
              <li>
                <strong>Devis détaillé sous 7 jours</strong>, avec accompagnement aux
                aides (MaPrimeRénov&apos;, CEE) si éligible.
              </li>
            </ol>

            <div
              style={{
                marginTop: 32,
                padding: 24,
                background: "var(--cream)",
                borderRadius: 12,
              }}
            >
              <strong>Une question urgente&nbsp;?</strong>
              <p style={{ marginTop: 6, marginBottom: 14 }}>
                Notre standard est ouvert du lundi au samedi, 8h–19h.
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <TelLink source="merci_page" className="btn-primary">
                  07 63 20 87 53
                </TelLink>
                <EmailLink source="merci_page" className="btn-outline">
                  contact@fbr-patrimoine.com
                </EmailLink>
              </div>
            </div>

            <div style={{ marginTop: 36, textAlign: "center" }}>
              <Link href="/realisations" className="btn-ghost">
                En attendant, découvrir nos réalisations
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
