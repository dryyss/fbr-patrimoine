import Image from "next/image";
import Link from "next/link";
import TrustBar from "@/components/TrustBar";
import RealisationsGrid from "@/components/RealisationsGrid";
import CtaBlock from "@/components/CtaBlock";
import HomeLoader from "@/components/HomeLoader";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

export default function HomePage() {
  return (
    <>
      <HomeLoader />
      {/* ==================== HERO ==================== */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">Restauration & Valorisation du patrimoine bâti</div>
            <h1>
              Restaurer le bâti.
              <br />
              Préserver le patrimoine.
              <br />
              <em>Bâtir l&apos;avenir.</em>
            </h1>
            <p>
              <strong style={{ color: "#fff" }}>FBR Patrimoine</strong> — Société
              Francilienne de Bâtiment et Réhabilitation. Maçonnerie générale,
              ravalement de façades, ITE, restauration du bâti ancien et études
              techniques. De la façade haussmannienne au clocher classé, de la
              copropriété moderne à l&apos;isolation thermique extérieure —
              l&apos;exigence du geste, au service de la pierre.
            </p>
            <div className="hero-ctas">
              <Link href="/contact" className="btn-primary">
                Demander un devis gratuit
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/realisations" className="btn-ghost">
                Voir nos réalisations
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-title">Devis gratuit & sur-mesure</div>
            <div className="hero-card-sub">Réponse sous 48h ouvrées</div>
            <form className="hero-card-form" action="/contact" method="get">
              <input type="text" name="nom" placeholder="Nom et prénom" required />
              <input type="tel" name="tel" placeholder="Numéro de téléphone" required />
              <select name="projet" defaultValue="">
                <option value="">Type de projet</option>
                <option>Ravalement & ITE</option>
                <option>Maçonnerie générale</option>
                <option>Réhabilitation du patrimoine ancien</option>
                <option>VRD, dalles, escaliers</option>
                <option>Études techniques</option>
                <option>Autre</option>
              </select>
              <input type="text" name="cp" placeholder="Code postal du chantier" />
              <button type="submit" className="btn-primary">
                Envoyer ma demande
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <div className="hero-card-foot">
                <strong>Étude gratuite</strong> · Sans engagement · Aides MaPrimeRénov&apos;
              </div>
            </form>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* ==================== EXPERTISES ==================== */}
      <section className="expertises" id="expertises">
        <div className="container">
          <div className="exp-header reveal">
            <div>
              <div className="section-label">Nos expertises</div>
              <h2 className="section-title">
                Quatre métiers, <em>une même exigence</em>.
              </h2>
            </div>
            <p className="section-intro">
              De la maçonnerie traditionnelle à l&apos;isolation performante, nos équipes
              interviennent sur tous types de bâtiments — patrimoine ancien,
              copropriétés, édifices remarquables — avec le même souci du détail.
            </p>
          </div>

          <div className="exp-grid">
            <Link href="/expertises#maconnerie" className="exp-card reveal">
              <div className="exp-num">— 01 / Maçonnerie</div>
              <div className="exp-icon">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="6" />
                  <rect x="3" y="15" width="18" height="6" />
                  <rect x="3" y="9" width="9" height="6" />
                  <rect x="12" y="9" width="9" height="6" />
                </svg>
              </div>
              <h3 className="exp-title">
                Maçonnerie
                <br />
                générale
              </h3>
              <p className="exp-desc">
                Gros œuvre, second œuvre, construction et rénovation en pierre, brique
                ou béton armé. De la fondation à la finition.
              </p>
              <ul className="exp-features">
                <li>Gros œuvre & second œuvre</li>
                <li>Pierre de taille & moellons</li>
                <li>Reprises en sous-œuvre</li>
              </ul>
            </Link>

            <Link href="/expertises#ravalement" className="exp-card reveal">
              <div className="exp-num">— 02 / Ravalement & ITE</div>
              <div className="exp-icon">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16v16H4zM4 9h16M9 4v16M14 4v16" />
                </svg>
              </div>
              <h3 className="exp-title">
                Ravalement
                <br />
                de façades & ITE
              </h3>
              <p className="exp-desc">
                Enduits à la chaux, peinture, hydrofugation, isolation thermique par
                l&apos;extérieur. Éligible MaPrimeRénov&apos; et CEE (Qualibat RGE).
              </p>
              <ul className="exp-features">
                <li>Enduits chaux & enduits modernes</li>
                <li>ITE — PSE, laine de roche, fibre de bois</li>
                <li>Aides financières maximales</li>
              </ul>
            </Link>

            <Link href="/expertises#patrimoine" className="exp-card reveal">
              <div className="exp-num">— 03 / Patrimoine</div>
              <div className="exp-icon">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-8h6v8M9 8h6" />
                </svg>
              </div>
              <h3 className="exp-title">
                Réhabilitation
                <br />
                du patrimoine ancien
              </h3>
              <p className="exp-desc">
                Façades haussmanniennes, édifices religieux, hôtels particuliers.
                Spécialistes amiante (sous-section 4) et plomb.
              </p>
              <ul className="exp-features">
                <li>Façades haussmanniennes & Art Nouveau</li>
                <li>Édifices religieux & monuments</li>
                <li>Spécialistes amiante & plomb</li>
              </ul>
            </Link>

            <Link href="/expertises#vrd" className="exp-card reveal">
              <div className="exp-num">— 04 / VRD & Aménagements</div>
              <div className="exp-icon">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 18h18M3 6h18M9 6v12M15 6v12" />
                </svg>
              </div>
              <h3 className="exp-title">
                VRD, dalles,
                <br />
                escaliers, chapes
              </h3>
              <p className="exp-desc">
                Voirie, réseaux divers, dalles béton, escaliers extérieurs, chapes
                liquides. Les ouvrages techniques qui complètent vos chantiers.
              </p>
              <ul className="exp-features">
                <li>Voirie & réseaux divers</li>
                <li>Dalles béton & chapes liquides</li>
                <li>Escaliers extérieurs, pavages</li>
              </ul>
            </Link>
          </div>

          <div style={{ textAlign: "center", marginTop: 60 }} className="reveal">
            <Link href="/expertises" className="btn-outline">
              Voir nos 5 domaines d&apos;expertise (+ Études techniques)
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== ABOUT ==================== */}
      <section className="about" id="about">
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
              <div className="section-label">Le cabinet</div>
              <h2 className="section-title">
                L&apos;expertise du <em>geste</em>, l&apos;exigence du <em>détail</em>.
              </h2>
              <p>
                <strong>FBR Patrimoine</strong> — Société Francilienne de Bâtiment et
                Réhabilitation — est une entreprise spécialisée dans la{" "}
                <strong>maçonnerie générale</strong> et la{" "}
                <strong>réhabilitation du patrimoine ancien</strong>. Fondée par
                Hafedh Ghazouani, diplômé de{" "}
                <strong>Polytechnique Hauts-de-France</strong>, elle est le fruit de
                plusieurs années d&apos;expérience en bureau d&apos;études et sur le
                terrain, notamment dans la maçonnerie traditionnelle et la restauration
                du bâti ancien.
              </p>
              <p>
                Basés à <strong>Courdimanche (95)</strong>, nous accompagnons
                particuliers, collectivités et entreprises avec sérieux et passion —
                du clocher d&apos;église aux façades haussmanniennes parisiennes, en
                passant par les copropriétés contemporaines.
              </p>

              <div className="about-stats">
                <div>
                  <div className="about-stat-num">
                    20<span>+</span>
                  </div>
                  <div className="about-stat-label">Années d&apos;expérience du fondateur</div>
                </div>
                <div>
                  <div className="about-stat-num">5</div>
                  <div className="about-stat-label">Domaines d&apos;expertise</div>
                </div>
                <div>
                  <div className="about-stat-num">
                    100<span>%</span>
                  </div>
                  <div className="about-stat-label">Garantie décennale</div>
                </div>
              </div>

              <div style={{ marginTop: 36 }}>
                <Link href="/cabinet" className="btn-outline">
                  Découvrir le cabinet
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== AVANT / APRÈS ==================== */}
      <section className="ba-section" id="avant-apres">
        <div className="ba-section-inner">
          <div className="ba-section-header reveal">
            <div className="section-label">Avant / Après</div>
            <h2 className="section-title">
              La <em>transformation</em>, glissée du bout du doigt.
            </h2>
            <p>
              Glissez le curseur pour révéler la métamorphose. Vraies façades,
              vrais chantiers, photos prises sur site par nos équipes.
            </p>
          </div>

          <div className="ba-home-single reveal">
            <BeforeAfterSlider
              beforeSrc="/project3.jpg"
              afterSrc="/project6.jpg"
              caption="Façade haussmannienne — ravalement à la chaux"
              location="Paris 9ᵉ"
              date="Livré en 2025"
              workType="Ravalement & restauration"
              aspectRatio="16 / 9"
            />
          </div>

          <div style={{ textAlign: "center", marginTop: 48 }} className="reveal">
            <Link href="/realisations#avant-apres" className="btn-outline">
              Voir d&apos;autres transformations
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== REALISATIONS ==================== */}
      <section className="realisations" id="realisations">
        <div className="container">
          <div className="real-header reveal">
            <div className="section-label">Nos réalisations</div>
            <h2 className="section-title">
              Des chantiers <em>qui parlent d&apos;eux-mêmes</em>.
            </h2>
            <p className="section-intro">
              Chaque projet est unique. Voici un aperçu de quelques chantiers récents qui
              témoignent de notre savoir-faire.
            </p>
          </div>

          <RealisationsGrid withFilter={false} />

          <div style={{ textAlign: "center", marginTop: 60, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }} className="reveal">
            <Link href="/realisations" className="btn-outline">
              Voir toutes nos réalisations
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/temoignages" className="btn-ghost">
              Lire les témoignages
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== SIMULATEUR TEASER ==================== */}
      <section className="ba-section" style={{ background: "var(--blue-dark)", color: "#fff" }}>
        <div className="ba-section-inner">
          <div className="ba-cta-band reveal" style={{ marginTop: 0, background: "transparent", padding: "0 20px" }}>
            <div>
              <div className="section-label" style={{ color: "var(--orange-light)" }}>Nouveau · Outil exclusif</div>
              <h3 style={{ fontSize: 34, lineHeight: 1.15, marginTop: 14 }}>
                Visualisez votre façade <em style={{ color: "var(--orange-light)" }}>rénovée</em>
                <br />
                en moins d&apos;une minute.
              </h3>
              <p style={{ marginTop: 14, maxWidth: 560 }}>
                Une photo de votre bâtiment, un style choisi, et notre IA génère un
                aperçu réaliste. Gratuit, sans inscription, sans engagement.
              </p>
            </div>
            <Link href="/simulateur" className="btn-primary" style={{ background: "var(--orange)", flexShrink: 0 }}>
              Lancer le simulateur
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== PROCESS ==================== */}
      <section className="process" id="process">
        <div className="container">
          <div className="process-header reveal">
            <div className="section-label">Notre méthode</div>
            <h2 className="section-title">
              Du premier <em>contact</em>
              <br />à la <em>livraison</em>.
            </h2>
            <p className="section-intro">
              Une démarche structurée, transparente et rigoureuse pour garantir des
              chantiers livrés dans les délais, le budget et la qualité promis.
            </p>
          </div>

          <div className="process-steps">
            <div className="process-line"></div>

            <div className="step reveal">
              <div className="step-num">I</div>
              <h4>Visite & étude</h4>
              <p>Diagnostic complet sur site, écoute du besoin, conseils techniques et études préalables.</p>
            </div>

            <div className="step reveal">
              <div className="step-num">II</div>
              <h4>Devis détaillé</h4>
              <p>Devis transparent et chiffré, avec accompagnement aux aides (MaPrimeRénov&apos;, CEE).</p>
            </div>

            <div className="step reveal">
              <div className="step-num">III</div>
              <h4>Réalisation</h4>
              <p>Mise en œuvre par nos équipes qualifiées, suivi de chantier hebdomadaire et reporting.</p>
            </div>

            <div className="step reveal">
              <div className="step-num">IV</div>
              <h4>Livraison & garantie</h4>
              <p>Réception de chantier, garantie décennale et accompagnement post-travaux.</p>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 70 }} className="reveal">
            <Link href="/cabinet#methode" className="btn-ghost">
              Découvrir notre méthode en détail
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== CERTIFICATIONS ==================== */}
      <section className="certifs">
        <div className="certifs-grid">
          <div className="reveal">
            <div className="section-label">Garanties</div>
            <h2 className="section-title">
              Des certifications qui <em>engagent</em>.
            </h2>
            <p className="section-intro">
              FBR Patrimoine est reconnue par les principales institutions du bâtiment
              français — gage de sérieux, de compétences techniques et d&apos;éligibilité
              aux aides à la rénovation énergétique.
            </p>
          </div>

          <div className="certifs-cards">
            <div className="certif-card reveal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/qualibat.png" alt="Qualibat RGE" />
              <h5>Qualibat RGE</h5>
              <p>Reconnu Garant de l&apos;Environnement — éligibilité aides énergétiques</p>
            </div>
            <div className="certif-card reveal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ffb95.jpg" alt="FFB 95" />
              <h5>Adhérent FFB 95</h5>
              <p>Fédération Française du Bâtiment — Val-d&apos;Oise</p>
            </div>
            <div className="certif-card reveal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/coachcopro.jpg" alt="CoachCopro" />
              <h5>Affilié CoachCopro</h5>
              <p>Partenaire des copropriétés en rénovation énergétique</p>
            </div>
          </div>
        </div>
      </section>

      <CtaBlock
        title={
          <>
            Un projet de ravalement,
            <br />
            d&apos;isolation ou de <em>restauration</em> ?
          </>
        }
        text="Échangeons sur votre projet. Nos équipes se déplacent gratuitement sur site pour établir un diagnostic précis et un devis détaillé sous 48h. Étude personnalisée, sans engagement."
      />
    </>
  );
}
