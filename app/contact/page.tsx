import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import TrustBar from "@/components/TrustBar";
import ContactForm from "@/components/ContactForm";
import { EmailLink, TelLink } from "@/components/TrackedContact";

export const metadata: Metadata = {
  title: "Contact & devis gratuit · Île-de-France",
  description:
    "Demandez votre devis gratuit en ligne. Réponse sous 48h ouvrées. FBR Patrimoine, votre artisan certifié Qualibat RGE en Île-de-France. Téléphone : 07 63 20 87 53.",
  alternates: { canonical: "https://www.fbr-patrimoine.com/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        bgImage="/project1.jpg"
        breadcrumb="Contact"
        eyebrow="Devis gratuit · Réponse sous 48h"
        title={
          <>
            Parlons de votre <em>projet</em>.
          </>
        }
        description="Étude gratuite, devis sous 48h ouvrées, accompagnement aux aides financières. Échangeons sur votre projet — sans aucun engagement."
      />

      <section className="contact-page">
        <div className="contact-grid">
          <div className="contact-form-card reveal">
            <h2>Demandez votre devis gratuit</h2>
            <p>
              Remplissez le formulaire ci-dessous, nous vous recontacterons sous 48h
              ouvrées. Tous les champs marqués d&apos;un * sont obligatoires.
            </p>

            <ContactForm />
          </div>

          <div className="contact-info reveal">
            <div className="contact-info-block">
              <div className="contact-info-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.49a1 1 0 01-.5 1.21l-2.26 1.13a11 11 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.49 1.5a1 1 0 01.68.95V20a2 2 0 01-2 2h-1C9.72 22 2 14.28 2 5V5z" />
                </svg>
              </div>
              <div>
                <div className="contact-info-label">Téléphone</div>
                <TelLink source="contact_page" className="contact-info-value">
                  07 63 20 87 53
                </TelLink>
                <div className="contact-info-sub">Du lundi au samedi, de 8h à 19h</div>
              </div>
            </div>

            <div className="contact-info-block">
              <div className="contact-info-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <div className="contact-info-label">Email</div>
                <EmailLink source="contact_page" className="contact-info-value">
                  contact@fbr-patrimoine.com
                </EmailLink>
                <div className="contact-info-sub">Réponse garantie sous 48h ouvrées</div>
              </div>
            </div>

            <div className="contact-info-block">
              <div className="contact-info-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <div className="contact-info-label">Zone d&apos;intervention</div>
                <div className="contact-info-value">Île-de-France</div>
                <div className="contact-info-sub">
                  Paris (75), Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne
                  (94), Val-d&apos;Oise (95), Yvelines (78), Essonne (91), Seine-et-Marne
                  (77)
                </div>
              </div>
            </div>

            <div className="contact-info-block">
              <div className="contact-info-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <div className="contact-info-label">Horaires</div>
                <div className="contact-info-value" style={{ fontSize: 18 }}>
                  Lun – Sam · 8h – 19h
                </div>
                <div className="contact-info-sub">
                  Étude personnalisée sur rendez-vous
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustBar label="Vos garanties" />
    </>
  );
}
