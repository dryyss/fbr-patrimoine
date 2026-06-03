import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import CtaBlock from "@/components/CtaBlock";
import TrustBar from "@/components/TrustBar";
import { EmailLink, TelLink } from "@/components/TrackedContact";

export type Faq = { q: string; a: React.ReactNode };

export type LandingPageProps = {
  /** Used as the lead_source attached to the form submission analytics event. */
  source: string;
  /** Pre-fills the "Type de projet" dropdown in the contact form. */
  defaultProject: string;
  bgImage: string;
  eyebrow: string;
  /** H1 of the page. Wrap the keyword in <em> via JSX if needed. */
  title: React.ReactNode;
  intro: string;
  /** Three to five punchy selling points. */
  uspTitle: React.ReactNode;
  uspBody: React.ReactNode;
  uspImage: string;
  uspImageAlt: string;
  uspBullets: string[];
  /** Four realisations to display in a mini-grid. */
  realisations: { src: string; alt: string }[];
  faq: Faq[];
  ctaTitle: React.ReactNode;
  ctaText: string;
};

export default function LandingPage({
  source,
  defaultProject,
  bgImage,
  eyebrow,
  title,
  intro,
  uspTitle,
  uspBody,
  uspImage,
  uspImageAlt,
  uspBullets,
  realisations,
  faq,
  ctaTitle,
  ctaText,
}: LandingPageProps) {
  return (
    <>
      {/* ==================== HERO + FORM ==================== */}
      <section className="hero">
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">{eyebrow}</div>
            <h1>{title}</h1>
            <p>{intro}</p>
            <div className="hero-ctas">
              <Link href="#devis" className="btn-primary">
                Demander mon devis gratuit
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <TelLink source={`${source}_hero`} className="btn-ghost">
                07 63 20 87 53
              </TelLink>
            </div>
          </div>

          <div className="hero-card" id="devis">
            <div className="hero-card-title">Devis gratuit & sur-mesure</div>
            <div className="hero-card-sub">Réponse sous 48h ouvrées</div>
            <div style={{ marginTop: 14 }}>
              <ContactForm source={source} defaultProject={defaultProject} />
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* ==================== USP ==================== */}
      <section className="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-visual reveal">
              <Image
                src={uspImage}
                alt={uspImageAlt}
                width={900}
                height={1200}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div className="about-text reveal">
              <div className="section-label">Pourquoi FBR Patrimoine</div>
              <h2 className="section-title">{uspTitle}</h2>
              {uspBody}
              <ul style={{ marginTop: 24, lineHeight: 1.9, color: "var(--ink-soft)" }}>
                {uspBullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div style={{ marginTop: 28 }}>
                <Link href="#devis" className="btn-primary">
                  Obtenir mon devis
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MINI RÉALISATIONS ==================== */}
      <section className="realisations">
        <div className="container">
          <div className="real-header reveal">
            <div className="section-label">Réalisations récentes</div>
            <h2 className="section-title">
              Nos chantiers <em>parlent pour nous</em>.
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
              marginTop: 32,
            }}
          >
            {realisations.map((r) => (
              <div
                key={r.src}
                style={{
                  position: "relative",
                  aspectRatio: "4 / 3",
                  overflow: "hidden",
                  borderRadius: 8,
                }}
                className="reveal"
              >
                <Image
                  src={r.src}
                  alt={r.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }} className="reveal">
            <Link href="/realisations" className="btn-outline">
              Voir toutes les réalisations
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="about" style={{ background: "var(--cream)" }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="section-label">Questions fréquentes</div>
            <h2 className="section-title">
              On répond à vos <em>questions</em>.
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {faq.map((item) => (
              <details
                key={item.q}
                className="reveal"
                style={{
                  background: "#fff",
                  padding: "20px 24px",
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <summary
                  style={{
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 17,
                    color: "var(--ink)",
                  }}
                >
                  {item.q}
                </summary>
                <div
                  style={{
                    marginTop: 14,
                    lineHeight: 1.7,
                    color: "var(--ink-soft)",
                  }}
                >
                  {item.a}
                </div>
              </details>
            ))}
          </div>

          <div
            style={{
              marginTop: 48,
              padding: 28,
              background: "#fff",
              borderRadius: 12,
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong style={{ fontSize: 18 }}>Une autre question&nbsp;?</strong>
              <p style={{ marginTop: 4, color: "var(--ink-soft)" }}>
                Appelez-nous, on prend le temps d&apos;y répondre.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <TelLink source={`${source}_faq`} className="btn-primary">
                07 63 20 87 53
              </TelLink>
              <EmailLink source={`${source}_faq`} className="btn-outline">
                Écrire un email
              </EmailLink>
            </div>
          </div>
        </div>
      </section>

      <CtaBlock title={ctaTitle} text={ctaText} />
    </>
  );
}
