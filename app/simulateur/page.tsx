import type { Metadata } from "next";
import Simulateur from "@/components/Simulateur";

export const metadata: Metadata = {
  title: "Simulateur avant / après IA · Visualisez votre façade rénovée",
  description:
    "Uploadez une photo de votre façade et découvrez en moins d'une minute à quoi elle ressemblerait après ravalement, ITE ou restauration. Outil offert par FBR Patrimoine.",
  alternates: { canonical: "https://www.fbr-patrimoine.com/simulateur" },
};

export default function SimulateurPage() {
  return (
    <section className="sim-page">
      <div className="sim-wrap">
        <div className="sim-hero reveal">
          <div className="section-label">Nouveau · Outil exclusif</div>
          <h1>
            Visualisez votre façade <em>rénovée</em>,
            <br />
            en moins d&apos;une minute.
          </h1>
          <p>
            Déposez une photo de votre bâtiment, choisissez un style — enduit
            traditionnel, finition moderne ou isolation par l&apos;extérieur —
            et notre IA génère un aperçu réaliste pour vous projeter avant même
            le devis.
          </p>
        </div>

        <Simulateur />

        <div className="sim-trust reveal">
          <div className="sim-trust-item">
            <div className="sim-trust-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h4>Vos données restent privées</h4>
            <p>
              Vos photos ne sont jamais partagées ni revendues. Elles sont
              supprimées de nos serveurs dans les 24 heures suivant la
              génération.
            </p>
          </div>

          <div className="sim-trust-item">
            <div className="sim-trust-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h4>Aperçu, pas engagement</h4>
            <p>
              Cette visualisation est indicative. Seul un diagnostic gratuit sur
              site permet de chiffrer précisément un projet de ravalement ou
              d&apos;isolation.
            </p>
          </div>

          <div className="sim-trust-item">
            <div className="sim-trust-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h4>Qualibat RGE</h4>
            <p>
              FBR Patrimoine est certifiée Qualibat RGE (code 7131) — vos
              travaux d&apos;isolation sont éligibles MaPrimeRénov&apos; et
              CEE.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
