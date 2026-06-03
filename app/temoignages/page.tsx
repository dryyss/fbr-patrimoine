import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBlock from "@/components/CtaBlock";

export const metadata: Metadata = {
  title: "Témoignages clients & professionnels · FBR Patrimoine",
  description:
    "Découvrez les retours de nos clients particuliers, syndics, architectes et collectivités sur nos chantiers de ravalement, ITE et restauration du patrimoine.",
  alternates: { canonical: "https://www.fbr-patrimoine.com/temoignages" },
};

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  badge?: string;
  initials: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "FBR Patrimoine a su restaurer notre façade haussmannienne avec un soin d'orfèvre. Les modénatures ont été reprises à l'identique, le résultat est exactement ce que nous espérions.",
    name: "Sylvie M.",
    role: "Présidente de conseil syndical · Paris 9ᵉ",
    badge: "Copropriété",
    initials: "SM",
  },
  {
    quote:
      "Chantier mené dans les délais annoncés, équipe à l'écoute et propre. L'accompagnement sur les aides MaPrimeRénov' a été déterminant pour boucler le financement.",
    name: "Jean-Pierre L.",
    role: "Propriétaire pavillon · Cergy",
    badge: "Particulier",
    initials: "JP",
  },
  {
    quote:
      "Nous avons collaboré sur la restauration du clocher de notre église. Compétence technique réelle sur le bâti ancien, respect des matériaux d'origine, sérieux administratif.",
    name: "Père Étienne D.",
    role: "Paroisse · Val-d'Oise",
    badge: "Patrimoine religieux",
    initials: "ÉD",
  },
  {
    quote:
      "Nous travaillons régulièrement avec FBR Patrimoine sur nos projets de réhabilitation. Une entreprise fiable, qui tient ses devis et livre une qualité de finition au niveau du cahier des charges.",
    name: "Architecte M. Bernard",
    role: "Cabinet d'architecture · Versailles",
    badge: "Prescripteur",
    initials: "MB",
  },
  {
    quote:
      "Ravalement complet + ITE sur un immeuble de 18 lots. Le syndic a apprécié la communication en continu et le respect strict du planning, malgré une météo capricieuse.",
    name: "Catherine R.",
    role: "Syndic professionnel · Argenteuil",
    badge: "Copropriété",
    initials: "CR",
  },
  {
    quote:
      "Reprise en sous-œuvre délicate sur une maison ancienne. L'équipe a su poser un diagnostic juste et proposer une solution technique propre, en lien étroit avec mon bureau d'études.",
    name: "Maître d'œuvre L. Faure",
    role: "MOE indépendant · Pontoise",
    badge: "Prescripteur",
    initials: "LF",
  },
];

const photoTestimonials = [
  { src: "/project1.jpg", title: "Façade Paris 11ᵉ", desc: "« Travail propre et soigné. » — A. Petit" },
  { src: "/project3.jpg", title: "Copropriété Cergy", desc: "« Délais tenus, prix tenus. » — Syndic Foncia" },
  { src: "/project5.jpg", title: "Maison Versailles", desc: "« Restauration impeccable. » — Famille B." },
  { src: "/project8.jpg", title: "Église Saint-Maurice", desc: "« Compétence et respect. » — Paroisse" },
];

export default function TemoignagesPage() {
  // TODO Hafedh: remplacer par l'URL d'une vraie vidéo YouTube (sans /embed/, sans paramètres)
  // ex: "dQw4w9WgXcQ" pour https://www.youtube.com/watch?v=dQw4w9WgXcQ
  const featuredVideoId: string | null = null;

  return (
    <>
      <PageHero
        bgImage="/project6.jpg"
        breadcrumb="Témoignages"
        eyebrow="Ils nous ont fait confiance"
        title={<>La parole à <em>nos clients</em>.</>}
        description="Particuliers, syndics, architectes, collectivités — chaque chantier est une rencontre. Retour sur les projets qui ont marqué nos équipes."
      />

      <section className="temo-page">
        <div className="temo-wrap">
          <div className="temo-intro reveal">
            <div className="section-label">Témoignages</div>
            <h2 className="section-title">
              Des projets, des <em>visages</em>,
              <br />
              une même <em>exigence</em>.
            </h2>
            <p>
              Plus que des chantiers livrés, ce sont des relations construites dans
              la durée — sur la confiance, la précision et la transparence.
            </p>
          </div>

          {/* ==================== FEATURED VIDEO ==================== */}
          <div className="temo-featured reveal">
            <div className="temo-video-wrap">
              {featuredVideoId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${featuredVideoId}?rel=0&modestbranding=1`}
                  title="Témoignage vidéo — FBR Patrimoine"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="temo-video-placeholder">
                  <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                  <div>
                    <strong style={{ color: "#fff", fontSize: 16, display: "block", marginBottom: 6 }}>
                      Vidéo témoignage à venir
                    </strong>
                    Un retour client filmé sur l&apos;un de nos chantiers
                    emblématiques sera publié ici prochainement.
                  </div>
                </div>
              )}
            </div>

            <div className="temo-featured-content">
              <div className="section-label">Témoignage à la une</div>
              <h2>« Le résultat dépasse nos attentes. »</h2>
              <blockquote className="temo-quote-big">
                Après deux devis décevants, FBR Patrimoine a su nous proposer une
                approche technique précise, un devis détaillé sans surprise, et
                surtout une équipe de chantier irréprochable. Notre copropriété
                a retrouvé son éclat.
              </blockquote>
              <div className="temo-author">
                <strong>Madame Lefèvre</strong>
                Présidente de conseil syndical · Copropriété de 24 lots, Paris 17ᵉ
              </div>
            </div>
          </div>

          {/* ==================== QUOTES GRID ==================== */}
          <div style={{ textAlign: "center" }} className="reveal">
            <div className="section-label">Ils en parlent</div>
            <h2 className="section-title">
              Six <em>histoires</em>, une <em>même promesse tenue</em>.
            </h2>
          </div>

          <div className="temo-grid">
            {testimonials.map((t, i) => (
              <article key={i} className="temo-card reveal">
                <div className="temo-card-quote-mark">&ldquo;</div>
                <p className="temo-card-text">{t.quote}</p>
                {t.badge && <span className="temo-card-badge">{t.badge}</span>}
                <div className="temo-card-meta">
                  <div className="temo-card-avatar" aria-hidden>{t.initials}</div>
                  <div className="temo-card-info">
                    <span className="temo-card-name">{t.name}</span>
                    <span className="temo-card-role">{t.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ==================== PHOTO TESTIMONIALS ==================== */}
          <div style={{ textAlign: "center", marginTop: 90 }} className="reveal">
            <div className="section-label">En images</div>
            <h2 className="section-title">
              Les chantiers qu&apos;ils nous ont <em>confiés</em>.
            </h2>
          </div>

          <div className="temo-photos">
            {photoTestimonials.map((p, i) => (
              <div key={i} className="temo-photo reveal">
                <Image
                  src={p.src}
                  alt={p.title}
                  width={500}
                  height={625}
                  sizes="(max-width: 1000px) 50vw, 25vw"
                />
                <div className="temo-photo-overlay">
                  <strong>{p.title}</strong>
                  {p.desc}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 80 }} className="reveal">
            <Link href="/realisations" className="btn-outline">
              Voir toutes nos réalisations
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <CtaBlock
        title={
          <>
            Votre projet,
            <br />
            notre <em>prochain témoignage</em>.
          </>
        }
        text="Confiez-nous votre chantier. Étude gratuite sur site, devis détaillé sous 48h, accompagnement aux aides MaPrimeRénov' et CEE — et un suivi humain de A à Z."
      />
    </>
  );
}
