import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Devis ravalement de façade gratuit · Île-de-France",
  description:
    "Ravalement de façade en Île-de-France : devis gratuit sous 48h, entreprise Qualibat RGE, garantie décennale. Enduits à la chaux, peinture, hydrofugation. Paris, 92, 93, 94, 95, 78, 91, 77.",
  alternates: { canonical: "https://www.fbr-patrimoine.com/devis-ravalement" },
  openGraph: {
    type: "website",
    url: "https://www.fbr-patrimoine.com/devis-ravalement",
    title: "Devis ravalement de façade gratuit · Île-de-France",
    description:
      "Entreprise Qualibat RGE spécialisée en ravalement de façades en Île-de-France. Devis gratuit sous 48h.",
    images: ["/project5.jpg"],
  },
};

export default function DevisRavalementPage() {
  return (
    <LandingPage
      source="devis_ravalement"
      defaultProject="Ravalement de façade"
      bgImage="/project5.jpg"
      eyebrow="Devis gratuit · Qualibat RGE · Île-de-France"
      title={
        <>
          Ravalement de façade
          <br />
          <em>par des professionnels.</em>
        </>
      }
      intro="Façades pavillonnaires, copropriétés, immeubles haussmanniens : nos équipes interviennent en Île-de-France avec un savoir-faire reconnu (Qualibat RGE, FFB 95). Devis gratuit sous 48h, garantie décennale, accompagnement aux aides."
      uspTitle={
        <>
          Un ravalement <em>durable</em>, fait dans les règles de l&apos;art.
        </>
      }
      uspBody={
        <>
          <p>
            Le ravalement n&apos;est pas qu&apos;une affaire d&apos;esthétique : il
            protège le bâti, garantit l&apos;étanchéité et valorise le bien.
            Nos équipes prennent en charge l&apos;ensemble du processus —
            diagnostic, échafaudage, nettoyage, traitement des fissures,
            enduits, peinture, finitions.
          </p>
          <p>
            Notre certification <strong>Qualibat RGE</strong> vous donne accès
            aux aides MaPrimeRénov&apos; et CEE quand le ravalement
            s&apos;accompagne d&apos;une isolation par l&apos;extérieur.
          </p>
        </>
      }
      uspImage="/project5.jpg"
      uspImageAlt="Ravalement de façade sur échafaudage"
      uspBullets={[
        "Diagnostic complet et devis détaillé sous 48h",
        "Hydrogommage, nettoyage haute pression, traitement des fissures",
        "Enduits à la chaux ou modernes, peintures façade et lasures",
        "Échafaudages, sécurité, gestion des riverains (copropriétés)",
        "Garantie décennale · Assurance professionnelle (LUN2502446)",
        "Accompagnement complet aux aides MaPrimeRénov' / CEE",
      ]}
      realisations={[
        { src: "/project1.jpg", alt: "Façade ravalée — chantier IDF" },
        { src: "/project2.jpg", alt: "Ravalement de façade pierre" },
        { src: "/project5.jpg", alt: "Ravalement clocher" },
        { src: "/project8.jpg", alt: "Ravalement résidentiel" },
      ]}
      faq={[
        {
          q: "Combien coûte un ravalement de façade en Île-de-France ?",
          a: (
            <>
              Le prix dépend de la surface, de l&apos;état du support et de la
              technique employée. À titre indicatif, comptez 50 à 120 €/m² TTC
              pour un ravalement classique, et 120 à 250 €/m² avec isolation
              extérieure. Notre devis est gratuit, détaillé et sans engagement.
            </>
          ),
        },
        {
          q: "Quelles aides financières sont disponibles ?",
          a: (
            <>
              Si le ravalement est couplé à une <strong>isolation par
              l&apos;extérieur (ITE)</strong>, vous pouvez bénéficier de
              MaPrimeRénov&apos;, des CEE (Certificats d&apos;Économies
              d&apos;Énergie), de l&apos;éco-PTZ et d&apos;une TVA à 5,5 %.
              Étant Qualibat RGE, nous montons les dossiers à votre place.
            </>
          ),
        },
        {
          q: "Le ravalement est-il obligatoire ?",
          a: (
            <>
              Dans la plupart des communes d&apos;Île-de-France, le ravalement
              est rendu obligatoire <strong>tous les 10 ans</strong> par
              arrêté municipal (loi de 1948, code de la construction). En cas
              de mise en demeure, mieux vaut anticiper.
            </>
          ),
        },
        {
          q: "Quels délais prévoir ?",
          a: (
            <>
              Comptez généralement 2 à 4 semaines pour une maison individuelle,
              et 6 à 12 semaines pour une copropriété, hors phase
              administrative (déclaration préalable, AG de copropriété). Nous
              vous accompagnons sur l&apos;ensemble du calendrier.
            </>
          ),
        },
      ]}
      ctaTitle={
        <>
          Votre devis ravalement
          <br />
          gratuit, <em>en 48h</em>.
        </>
      }
      ctaText="Un de nos conseillers se déplace sur place pour un diagnostic précis et un devis détaillé. Étude personnalisée, sans engagement, accompagnement aux aides MaPrimeRénov' et CEE."
    />
  );
}
