import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Rénovation patrimoine ancien · Devis gratuit · Île-de-France",
  description:
    "Restauration de patrimoine bâti ancien en Île-de-France : façades haussmanniennes, édifices religieux, hôtels particuliers. Spécialistes amiante (SS4) et plomb. Qualibat RGE.",
  alternates: {
    canonical: "https://www.fbr-patrimoine.com/devis-renovation-patrimoine",
  },
  openGraph: {
    type: "website",
    url: "https://www.fbr-patrimoine.com/devis-renovation-patrimoine",
    title: "Rénovation patrimoine ancien · Île-de-France",
    description:
      "Façades haussmanniennes, édifices religieux, hôtels particuliers. Restauration du patrimoine bâti par FBR Patrimoine.",
    images: ["/project9.jpg"],
  },
};

export default function DevisPatrimoinePage() {
  return (
    <LandingPage
      source="devis_renovation_patrimoine"
      defaultProject="Réhabilitation du patrimoine ancien"
      bgImage="/project9.jpg"
      eyebrow="Restauration & valorisation du bâti ancien"
      title={
        <>
          Réhabilitation du
          <br />
          <em>patrimoine ancien.</em>
        </>
      }
      intro="Façades haussmanniennes, édifices religieux, hôtels particuliers, copropriétés anciennes : nous restaurons le bâti dans le respect des techniques traditionnelles — pierre de taille, enduits à la chaux, joints tradition. Spécialistes amiante (sous-section 4) et plomb."
      uspTitle={
        <>
          L&apos;exigence du <em>geste</em>, au service de la pierre.
        </>
      }
      uspBody={
        <>
          <p>
            Restaurer un édifice ancien ne s&apos;improvise pas. Chaque
            chantier commence par un <strong>diagnostic patrimonial</strong> :
            nature du bâti, pathologies, contraintes ABF, présence
            d&apos;amiante ou de plomb. Notre fondateur, diplômé de
            Polytechnique Hauts-de-France, est passé par le bureau
            d&apos;études avant de fonder FBR Patrimoine.
          </p>
          <p>
            Nous travaillons aux côtés des architectes du patrimoine, des
            ABF et des collectivités sur des édifices remarquables — du
            clocher d&apos;église à l&apos;hôtel particulier classé.
          </p>
        </>
      }
      uspImage="/project9.jpg"
      uspImageAlt="Détail de restauration patrimoniale en pierre"
      uspBullets={[
        "Diagnostic patrimonial + repérage amiante / plomb avant travaux",
        "Pierre de taille, moellons, parements, briques anciennes",
        "Enduits à la chaux traditionnelle, joints tradition",
        "Restauration de façades haussmanniennes & Art Nouveau",
        "Édifices religieux, monuments, hôtels particuliers",
        "Coordination avec ABF, architectes du patrimoine, MOA publique",
      ]}
      realisations={[
        { src: "/project9.jpg", alt: "Restauration patrimoine ancien" },
        { src: "/project5.jpg", alt: "Restauration de clocher" },
        { src: "/project3.jpg", alt: "Façade ancienne restaurée" },
        { src: "/project1.jpg", alt: "Patrimoine bâti rénové" },
      ]}
      faq={[
        {
          q: "Travaillez-vous sur les bâtiments classés ou inscrits ?",
          a: (
            <>
              Oui, nous intervenons régulièrement en coordination avec les{" "}
              <strong>Architectes des Bâtiments de France (ABF)</strong> et les
              architectes du patrimoine. Nous montons les dossiers
              d&apos;autorisation de travaux et respectons strictement les
              prescriptions (matériaux, teintes, techniques).
            </>
          ),
        },
        {
          q: "Comment gérez-vous l'amiante et le plomb ?",
          a: (
            <>
              Nos équipes sont formées et certifiées{" "}
              <strong>sous-section 4 amiante</strong>. Un diagnostic est
              systématiquement effectué avant travaux. Les protocoles
              d&apos;intervention (confinement, EPI, évacuation des déchets)
              respectent strictement le Code du travail.
            </>
          ),
        },
        {
          q: "Combien coûte une restauration patrimoniale ?",
          a: (
            <>
              Les coûts varient fortement selon la complexité (pierre de
              taille, sculptures, dépose-repose, traitements spécifiques).
              Comptez à partir de 150 €/m² pour un ravalement traditionnel à
              la chaux, et beaucoup plus pour des éléments sculptés ou des
              dorures. Le devis détaillé est gratuit.
            </>
          ),
        },
        {
          q: "Quels délais et autorisations prévoir ?",
          a: (
            <>
              En zone protégée (secteur sauvegardé, périmètre monument
              historique), prévoir 2 à 6 mois d&apos;instruction
              administrative avant le démarrage. Le chantier en lui-même varie
              de quelques semaines (réparation ponctuelle) à plusieurs mois
              (restauration complète). Nous gérons l&apos;ensemble.
            </>
          ),
        },
      ]}
      ctaTitle={
        <>
          Un projet de
          <br />
          <em>restauration patrimoniale</em> ?
        </>
      }
      ctaText="Visite gratuite, diagnostic détaillé, devis transparent et accompagnement administratif (ABF, autorisations). Nous nous déplaçons sur toute l'Île-de-France."
    />
  );
}
