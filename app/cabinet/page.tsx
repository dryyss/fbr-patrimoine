import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import CtaBlock from "@/components/CtaBlock";

export const metadata: Metadata = {
  title: "Le cabinet · Hafedh Ghazouani, fondateur",
  description:
    "Découvrez FBR Patrimoine et son fondateur Hafedh Ghazouani, diplômé de l'École Polytechnique de Lille, 20 ans d'expérience dans le bâtiment. Notre histoire, nos valeurs et notre méthode.",
  alternates: { canonical: "https://www.fbr-patrimoine.com/cabinet" },
};

export default function CabinetPage() {
  return (
    <>
      <PageHero
        bgImage="/project6.jpg"
        breadcrumb="Le cabinet"
        eyebrow="Notre histoire"
        title={
          <>
            L&apos;expertise du <em>geste</em>,<br />l&apos;exigence du <em>détail</em>.
          </>
        }
        description="FBR Patrimoine est née de la passion d'un homme pour la pierre, le bâti ancien et la transmission. Découvrez l'histoire, les valeurs et la méthode d'une entreprise qui place l'exigence artisanale au cœur de chaque chantier."
      />

      {/* FONDATEUR */}
      <section className="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-visual reveal">
              <Image
                src="/project6.jpg"
                alt="Façade haussmannienne restaurée"
                width={900}
                height={1200}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div className="about-quote">
                <div className="about-quote-text">
                  « Le patrimoine bâti ne se rénove pas, il se transmet. »
                </div>
                <div className="about-quote-author">Hafedh Ghazouani · Fondateur</div>
              </div>
            </div>

            <div className="about-text reveal">
              <div className="section-label">Le fondateur</div>
              <h2 className="section-title">
                Hafedh <em>Ghazouani</em>.
              </h2>
              <p>
                Diplômé de <strong>Polytechnique Hauts-de-France</strong>, Hafedh
                Ghazouani a forgé sa rigueur technique au sein de bureaux d&apos;études
                et sur le terrain, notamment dans le domaine de la maçonnerie
                traditionnelle et de la restauration du bâti ancien. Confronté chaque
                jour à des chantiers de grande envergure, il a progressivement développé
                une conviction :{" "}
                <strong>le patrimoine bâti mérite des artisans qui en comprennent l&apos;âme</strong>,
                pas uniquement la technique.
              </p>
              <p>
                C&apos;est de cette conviction qu&apos;est née FBR Patrimoine. Fondée pour
                mettre l&apos;exigence des grands ouvrages au service des particuliers,
                copropriétés et collectivités, l&apos;entreprise associe la rigueur du
                génie civil et le savoir-faire artisanal de la restauration patrimoniale.
              </p>

              <div className="about-stats">
                <div>
                  <div className="about-stat-num">20<span>+</span></div>
                  <div className="about-stat-label">Années d&apos;expérience du fondateur</div>
                </div>
                <div>
                  <div className="about-stat-num">5</div>
                  <div className="about-stat-label">Domaines d&apos;expertise</div>
                </div>
                <div>
                  <div className="about-stat-num">3</div>
                  <div className="about-stat-label">Certifications majeures</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="values">
        <div className="container">
          <div className="reveal" style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Nos valeurs</div>
            <h2 className="section-title" style={{ marginLeft: "auto", marginRight: "auto" }}>
              Trois principes <em>non négociables</em>.
            </h2>
            <p className="section-intro" style={{ marginLeft: "auto", marginRight: "auto" }}>
              Au-delà de la technique, FBR Patrimoine s&apos;est construite autour de
              valeurs qui guident chaque décision, du devis à la livraison.
            </p>
          </div>

          <div className="values-grid">
            <div className="value-card reveal">
              <div className="value-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h4>Exigence du geste</h4>
              <p>
                Chaque mur de pierre, chaque enduit à la chaux, chaque finition est
                exécuté avec le niveau de soin qu&apos;exige le bâti ancien. La qualité
                ne se négocie pas — elle se mesure dans le temps.
              </p>
            </div>

            <div className="value-card reveal">
              <div className="value-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 12l2 2 4-4" />
                </svg>
              </div>
              <h4>Transparence totale</h4>
              <p>
                Un devis clair, des prix justes, des délais tenus, un suivi de chantier
                rigoureux. Vous savez précisément ce qui est fait, pourquoi, quand, et
                combien — du début à la fin.
              </p>
            </div>

            <div className="value-card reveal">
              <div className="value-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-8h6v8M9 8h6" />
                </svg>
              </div>
              <h4>Respect du patrimoine</h4>
              <p>
                Restaurer un édifice ancien, c&apos;est dialoguer avec ceux qui
                l&apos;ont bâti. Nos interventions privilégient les matériaux et
                techniques d&apos;origine — pierre, chaux, sable de carrière — pour
                préserver l&apos;authenticité du bâti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="aides" id="vision">
        <div className="aides-grid">
          <div className="reveal">
            <div className="section-label" style={{ color: "var(--orange-light)" }}>
              Notre vision
            </div>
            <h2>
              <em>Tradition</em> & <em>innovation</em>.
            </h2>
            <p>
              Chez FBR Patrimoine, nous croyons à l&apos;alliance entre tradition et
              innovation. Nous mettons un point d&apos;honneur à respecter le{" "}
              <strong style={{ color: "#fff" }}>cachet architectural des bâtiments anciens</strong>
              {" "}tout en intégrant des méthodes modernes, durables et efficaces.
            </p>
            <p>
              Notre ambition : devenir un acteur de référence dans la{" "}
              <strong style={{ color: "#fff" }}>préservation du patrimoine</strong> et
              la <strong style={{ color: "#fff" }}>maçonnerie de qualité</strong>.
            </p>
          </div>

          <ul className="aides-list reveal">
            <li className="aide-item">
              <div className="aide-icon">✓</div>
              <div>
                <div className="aide-name">Expertise technique et terrain</div>
                <div className="aide-desc">Études en amont, exécution maîtrisée sur chantier.</div>
              </div>
            </li>
            <li className="aide-item">
              <div className="aide-icon">✓</div>
              <div>
                <div className="aide-name">Diagnostic précis & solutions durables</div>
                <div className="aide-desc">Le bon traitement, la bonne fois — pour tenir dans le temps.</div>
              </div>
            </li>
            <li className="aide-item">
              <div className="aide-icon">✓</div>
              <div>
                <div className="aide-name">Devis gratuits & détaillés</div>
                <div className="aide-desc">Transparents, postés par poste, sans frais d&apos;étude.</div>
              </div>
            </li>
            <li className="aide-item">
              <div className="aide-icon">✓</div>
              <div>
                <div className="aide-name">Respect des délais, normes & sécurité</div>
                <div className="aide-desc">Engagements tenus, règles de l&apos;art respectées.</div>
              </div>
            </li>
            <li className="aide-item">
              <div className="aide-icon">✓</div>
              <div>
                <div className="aide-name">Garantie décennale</div>
                <div className="aide-desc">Sur l&apos;ensemble de nos prestations.</div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* METHODE */}
      <section className="about" id="methode">
        <div className="container">
          <div className="reveal" style={{ maxWidth: 820 }}>
            <div className="section-label">Notre méthode</div>
            <h2 className="section-title">
              Une démarche <em>structurée</em>, du premier contact à la livraison.
            </h2>
            <p className="section-intro">
              Une méthode rigoureuse pour garantir des chantiers livrés dans les délais,
              le budget et la qualité promis — quelle que soit la nature du projet.
            </p>
          </div>

          <div style={{ marginTop: 60 }}>
            <MethodeStep
              num="I"
              title="Visite & étude préalable"
              text="Tout commence par une visite gratuite sur site. Nous écoutons votre besoin, diagnostiquons l'état du bâti, identifions les points techniques sensibles et cernons les contraintes propres à votre projet (copropriété, monument classé, site occupé, etc.)."
              points={[
                "Diagnostic visuel complet de la façade",
                "Conseils techniques personnalisés",
                "Identification des aides financières possibles",
                "Échange ouvert sans aucun engagement",
              ]}
            />
            <MethodeStep
              num="II"
              title="Devis détaillé"
              text="Sous 48h ouvrées, nous vous remettons un devis chiffré, transparent et argumenté. Chaque poste est justifié, les matériaux sont précisés, le planning prévisionnel est annoncé. Nous vous accompagnons dans la constitution des dossiers d'aides (MaPrimeRénov', CEE)."
              points={[
                "Devis par poste avec quantités et matériaux",
                "Planning prévisionnel détaillé",
                "Accompagnement aux aides financières",
                "Sans frais d'étude, sans engagement",
              ]}
            />
            <MethodeStep
              num="III"
              title="Réalisation du chantier"
              text="Nos équipes qualifiées interviennent dans le respect strict des délais. Un référent chantier est dédié à votre projet et reste votre interlocuteur unique. Vous recevez un reporting hebdomadaire avec photos d'avancement."
              points={[
                "Référent chantier unique",
                "Reporting hebdomadaire avec photos",
                "Respect des règles de sécurité et propreté",
                "Gestion adaptée aux sites occupés",
              ]}
            />
            <MethodeStep
              num="IV"
              title="Livraison & garanties"
              text="Réception de chantier en votre présence, levée éventuelle des réserves, transmission du dossier complet (factures, attestations RGE, garantie décennale). Nous restons disponibles bien au-delà de la livraison."
              points={[
                "Procès-verbal de réception",
                "Garantie décennale",
                "Attestations RGE pour vos aides",
                "Suivi post-travaux",
              ]}
            />
          </div>
        </div>
      </section>

      <CtaBlock
        eyebrow="Travaillons ensemble"
        title={
          <>
            Une <em>vision commune</em>
            <br />de votre projet.
          </>
        }
        text="Vous avez un projet de ravalement, d'isolation, de restauration ou de maçonnerie ? Échangeons. La première visite et le devis sont gratuits, sans engagement."
        bgImage="/project1.jpg"
      />
    </>
  );
}

function MethodeStep({
  num,
  title,
  text,
  points,
}: {
  num: string;
  title: string;
  text: string;
  points: string[];
}) {
  return (
    <div className="methode-step reveal">
      <div className="methode-step-num">{num}</div>
      <div className="methode-step-content">
        <h3>{title}</h3>
        <p>{text}</p>
        <ul className="methode-step-list">
          {points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
