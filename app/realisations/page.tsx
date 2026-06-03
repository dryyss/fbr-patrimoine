import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import RealisationsGrid from "@/components/RealisationsGrid";
import CtaBlock from "@/components/CtaBlock";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

export const metadata: Metadata = {
  title: "Nos réalisations · Galerie de chantiers en Île-de-France",
  description:
    "Découvrez nos chantiers de réhabilitation du patrimoine, ravalement de façades, ITE et maçonnerie en Île-de-France. Édifices religieux, copropriétés, hôtels particuliers haussmanniens.",
  alternates: { canonical: "https://www.fbr-patrimoine.com/realisations" },
};

export default function RealisationsPage() {
  return (
    <>
      <PageHero
        bgImage="/project5.jpg"
        breadcrumb="Réalisations"
        eyebrow="Galerie de chantiers"
        title={
          <>
            Des chantiers <em>qui parlent</em>
            <br />d&apos;eux-mêmes.
          </>
        }
        description="Chaque projet est unique. Voici un aperçu des chantiers récents qui témoignent de notre savoir-faire — du clocher d'église à l'hôtel particulier haussmannien, en passant par les copropriétés."
      />

      {/* ==================== AVANT / APRÈS ==================== */}
      <section className="ba-section" id="avant-apres">
        <div className="ba-section-inner">
          <div className="ba-section-header reveal">
            <div className="section-label">Avant / Après</div>
            <h2 className="section-title">
              La <em>transformation</em>, glissée du bout du doigt.
            </h2>
            <p>
              Glissez le curseur sur chaque image pour révéler la métamorphose.
              Vraies façades, vrais chantiers, photos prises sur site par nos équipes.
            </p>
          </div>

          {/* TODO Hafedh: remplacer les paires ci-dessous par des photos réelles
              avant / après prises sur chantier. Nommer par ex.
              /public/ba-1-before.jpg + /public/ba-1-after.jpg */}
          <div className="ba-stack">
            <BeforeAfterSlider
              beforeSrc="/project3.jpg"
              afterSrc="/project6.jpg"
              caption="Façade haussmannienne — ravalement à la chaux"
              location="Paris 9ᵉ"
              date="Livré en 2025"
              workType="Ravalement & restauration"
              aspectRatio="16 / 9"
            />
            <BeforeAfterSlider
              beforeSrc="/project7.jpg"
              afterSrc="/project2.jpg"
              caption="Copropriété — isolation thermique par l'extérieur"
              location="Cergy (95)"
              date="Livré en 2024"
              workType="ITE + finition enduit minéral"
              aspectRatio="16 / 9"
            />
            <BeforeAfterSlider
              beforeSrc="/project9.jpg"
              afterSrc="/project4.jpg"
              caption="Pavillon — reprise de façade & enduit traditionnel"
              location="Val-d'Oise"
              date="Livré en 2024"
              workType="Maçonnerie & ravalement"
              aspectRatio="16 / 9"
            />
          </div>

          <div className="ba-cta-band reveal">
            <div>
              <h3>
                Envie de visualiser votre façade <em style={{ color: "var(--orange-light)" }}>rénovée</em> ?
              </h3>
              <p>
                Notre simulateur génère un aperçu en moins d&apos;une minute, à partir
                d&apos;une simple photo.
              </p>
            </div>
            <Link href="/simulateur" className="btn-primary">
              Essayer le simulateur
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="realisations">
        <div className="container">
          <RealisationsGrid />

          <p
            style={{
              textAlign: "center",
              marginTop: 60,
              fontSize: 14,
              color: "var(--ink-mute)",
              maxWidth: 600,
              marginLeft: "auto",
              marginRight: "auto",
            }}
            className="reveal"
          >
            Chaque chantier est documenté. Pour plus de références ou des visites de
            sites livrés, n&apos;hésitez pas à nous contacter.
          </p>
        </div>
      </section>

      <section className="testimonial">
        <div className="testi-inner reveal">
          <div className="testi-mark">&quot;</div>
          <p className="testi-quote">
            L&apos;équipe de FBR Patrimoine intervient avec un sérieux et un savoir-faire
            remarquables. Délais respectés, communication transparente, finitions
            soignées — l&apos;exigence se ressent à chaque étape du chantier.
          </p>
          <div className="testi-author">
            <div className="testi-name">Témoignage client</div>
            <div className="testi-role">Île-de-France</div>
          </div>
        </div>
      </section>

      <CtaBlock
        eyebrow="Votre projet"
        title={
          <>
            Votre chantier sera
            <br />
            notre <em>prochaine référence</em>.
          </>
        }
        text="Nos équipes se déplacent gratuitement sur site pour établir un diagnostic précis et un devis détaillé sous 48h. Étude personnalisée, sans engagement."
        bgImage="/project1.jpg"
      />
    </>
  );
}
