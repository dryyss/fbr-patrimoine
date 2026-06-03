import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CtaBlock from "@/components/CtaBlock";

export const metadata: Metadata = {
  title: "Certifications & garanties · Qualibat RGE · FFB · CoachCopro",
  description:
    "Qualibat RGE, FFB 95, CoachCopro : découvrez les certifications et affiliations de FBR Patrimoine, vos garanties d'expertise et d'éligibilité aux aides MaPrimeRénov' et CEE.",
  alternates: { canonical: "https://www.fbr-patrimoine.com/certifications" },
};

export default function CertificationsPage() {
  return (
    <>
      <PageHero
        bgImage="/project2.jpg"
        breadcrumb="Certifications"
        eyebrow="Garanties · Reconnaissances"
        title={
          <>
            Des certifications
            <br />
            qui <em>engagent</em>.
          </>
        }
        description="FBR Patrimoine est reconnue par les principales institutions du bâtiment français — gage de sérieux, de compétences techniques et d'éligibilité aux aides à la rénovation énergétique."
      />

      <section style={{ background: "#fff" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="cert-detail reveal">
            <div className="cert-detail-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/qualibat.png" alt="Qualibat RGE — Reconnu Garant de l'Environnement" />
            </div>
            <div className="cert-detail-text">
              <span className="cert-tag">Performance énergétique</span>
              <h3>Qualibat RGE</h3>
              <p>
                La certification <strong>Qualibat RGE</strong> (Reconnu Garant de
                l&apos;Environnement) atteste de notre capacité à réaliser des travaux
                d&apos;amélioration énergétique selon les standards les plus exigeants.
                Délivrée par l&apos;organisme indépendant Qualibat, cette qualification
                est régulièrement auditée.
              </p>
              <p>
                <strong>Concrètement pour vous :</strong> nos clients sont éligibles à
                l&apos;ensemble des aides à la rénovation énergétique —{" "}
                <strong>MaPrimeRénov&apos;</strong>,{" "}
                <strong>Certificats d&apos;Économies d&apos;Énergie (CEE)</strong>,
                éco-prêt à taux zéro, TVA réduite à 5,5 %.
              </p>
              <p>
                Sans cette certification, ces aides ne sont pas accessibles. Choisir FBR
                Patrimoine, c&apos;est garantir l&apos;éligibilité de votre projet.
              </p>
            </div>
          </div>

          <div className="cert-detail reveal">
            <div className="cert-detail-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ffb95.jpg" alt="Adhérent FFB 95 — Fédération Française du Bâtiment" />
            </div>
            <div className="cert-detail-text">
              <span className="cert-tag">Reconnaissance professionnelle</span>
              <h3>Adhérent FFB 95</h3>
              <p>
                La <strong>Fédération Française du Bâtiment</strong> (FFB) est la
                principale organisation professionnelle du secteur en France. Notre
                adhésion à la FFB du <strong>Val-d&apos;Oise (FFB 95)</strong> témoigne
                de notre engagement dans une démarche professionnelle reconnue, encadrée
                par une charte déontologique.
              </p>
              <p>
                <strong>Concrètement pour vous :</strong> les adhérents FFB s&apos;engagent
                à respecter les règles de l&apos;art du bâtiment, les obligations légales
                et sociales, et à fournir un travail conforme aux normes en vigueur.
              </p>
            </div>
          </div>

          <div className="cert-detail reveal">
            <div className="cert-detail-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/coachcopro.jpg" alt="Affilié CoachCopro — partenaire copropriétés" />
            </div>
            <div className="cert-detail-text">
              <span className="cert-tag">Spécialiste copropriétés</span>
              <h3>Affilié CoachCopro</h3>
              <p>
                <strong>CoachCopro</strong> est la plateforme de référence dédiée à la
                rénovation énergétique des copropriétés en Île-de-France. Notre
                affiliation positionne FBR Patrimoine comme un partenaire qualifié pour
                les projets de copropriété.
              </p>
              <p>
                <strong>Concrètement pour vous :</strong> nos équipes sont rompues aux
                spécificités des copropriétés — assemblées générales, vote des travaux,
                coordination avec syndic, gestion de chantier en site occupé. Nous savons
                parler le langage administratif des copropriétés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AIDES */}
      <section className="aides" id="aides">
        <div className="aides-grid">
          <div className="reveal">
            <div className="section-label" style={{ color: "var(--orange-light)" }}>
              Aides financières
            </div>
            <h2>
              Faites appel à un <em>artisan certifié</em>.
            </h2>
            <p>
              Notre certification Qualibat RGE vous donne accès à un large panel
              d&apos;aides à la rénovation énergétique. Nous vous accompagnons dans la
              constitution de l&apos;ensemble des dossiers administratifs.
            </p>
            <p>
              L&apos;aide cumulée peut représenter jusqu&apos;à{" "}
              <strong>60 % du montant des travaux</strong> pour une isolation thermique
              extérieure complète, sous conditions de revenus et de nature du chantier.
            </p>
          </div>

          <ul className="aides-list reveal">
            <li className="aide-item">
              <div className="aide-icon">€</div>
              <div>
                <div className="aide-name">MaPrimeRénov&apos;</div>
                <div className="aide-desc">
                  Aide forfaitaire de l&apos;État, modulée selon vos revenus, pour les
                  travaux d&apos;amélioration énergétique.
                </div>
              </div>
            </li>
            <li className="aide-item">
              <div className="aide-icon">⚡</div>
              <div>
                <div className="aide-name">CEE — Certificats d&apos;Économies d&apos;Énergie</div>
                <div className="aide-desc">
                  Prime versée par les fournisseurs d&apos;énergie, cumulable avec
                  MaPrimeRénov&apos;.
                </div>
              </div>
            </li>
            <li className="aide-item">
              <div className="aide-icon">%</div>
              <div>
                <div className="aide-name">TVA à taux réduit (5,5 %)</div>
                <div className="aide-desc">
                  Applicable directement sur la facture pour les travaux
                  d&apos;amélioration énergétique en logement de plus de 2 ans.
                </div>
              </div>
            </li>
            <li className="aide-item">
              <div className="aide-icon">0</div>
              <div>
                <div className="aide-name">Éco-prêt à taux zéro</div>
                <div className="aide-desc">
                  Prêt sans intérêt jusqu&apos;à 50 000 € pour financer un bouquet de
                  travaux de rénovation énergétique.
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <CtaBlock
        eyebrow="Bénéficiez des aides"
        title={
          <>
            Un projet éligible ?<br />
            Vérifions <em>ensemble</em>.
          </>
        }
        text="Nos équipes vérifient gratuitement l'éligibilité de votre projet aux différentes aides financières et constituent vos dossiers. Étude personnalisée, sans engagement."
      />
    </>
  );
}
