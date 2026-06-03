import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Devis Isolation Thermique Extérieure (ITE) gratuit · Île-de-France",
  description:
    "ITE en Île-de-France : devis gratuit, entreprise Qualibat RGE éligible MaPrimeRénov' et CEE. PSE, laine de roche, fibre de bois. Particuliers et copropriétés. Réponse 48h.",
  alternates: { canonical: "https://www.fbr-patrimoine.com/devis-ite" },
  openGraph: {
    type: "website",
    url: "https://www.fbr-patrimoine.com/devis-ite",
    title: "Devis Isolation Thermique Extérieure gratuit · Île-de-France",
    description:
      "ITE en IDF : Qualibat RGE, éligible MaPrimeRénov' et CEE. Devis gratuit sous 48h.",
    images: ["/project2.jpg"],
  },
};

export default function DevisItePage() {
  return (
    <LandingPage
      source="devis_ite"
      defaultProject="Isolation thermique extérieure (ITE)"
      bgImage="/project2.jpg"
      eyebrow="MaPrimeRénov' · CEE · Qualibat RGE"
      title={
        <>
          Isolation thermique extérieure
          <br />
          <em>jusqu&apos;à 75 % d&apos;aides.</em>
        </>
      }
      intro="L'ITE divise vos factures de chauffage et valorise votre bien. Entreprise Qualibat RGE éligible à MaPrimeRénov' et aux CEE, nous montons les dossiers à votre place et garantissons un chantier propre, dans les délais, sous garantie décennale."
      uspTitle={
        <>
          L&apos;ITE qui transforme <em>vraiment</em> votre confort.
        </>
      }
      uspBody={
        <>
          <p>
            L&apos;isolation thermique par l&apos;extérieur supprime les ponts
            thermiques, embellit la façade et fait gagner 2 à 4 classes au DPE.
            On choisit ensemble la solution la plus adaptée : <strong>PSE
            (polystyrène)</strong>, <strong>laine de roche</strong> ou{" "}
            <strong>fibre de bois</strong> — selon votre budget, votre support
            et vos objectifs énergétiques.
          </p>
          <p>
            En tant qu&apos;entreprise <strong>Qualibat RGE 7131</strong>, nous
            vous donnons accès au plus haut niveau d&apos;aides possible et
            nous prenons en charge la constitution complète des dossiers
            (MaPrimeRénov&apos;, CEE, éco-PTZ).
          </p>
        </>
      }
      uspImage="/project2.jpg"
      uspImageAlt="Chantier ITE en cours"
      uspBullets={[
        "Diagnostic thermique et choix de l'isolant (PSE / laine / fibre de bois)",
        "Pose certifiée Qualibat RGE, finitions enduit ou bardage",
        "Suppression des ponts thermiques, gain DPE de 2 à 4 classes",
        "Aides cumulées : MaPrimeRénov' + CEE + éco-PTZ + TVA 5,5 %",
        "Dossiers administratifs montés intégralement par nos soins",
        "Garantie décennale (LUN2502446) · respect des riverains",
      ]}
      realisations={[
        { src: "/project2.jpg", alt: "Chantier ITE" },
        { src: "/project6.jpg", alt: "Façade isolée" },
        { src: "/project8.jpg", alt: "ITE résidentielle" },
        { src: "/project10.jpg", alt: "Finition ITE" },
      ]}
      faq={[
        {
          q: "Quelles aides puis-je obtenir pour mon ITE ?",
          a: (
            <>
              Selon vos revenus et le type de logement, vous pouvez cumuler :
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                <li>
                  <strong>MaPrimeRénov&apos;</strong> — jusqu&apos;à 75 €/m²
                </li>
                <li>
                  <strong>CEE</strong> (primes énergie) — 11 à 20 €/m²
                </li>
                <li>
                  <strong>Éco-PTZ</strong> — prêt à taux zéro jusqu&apos;à 30
                  000 €
                </li>
                <li>
                  <strong>TVA réduite à 5,5 %</strong> sur la fourniture et la
                  pose
                </li>
              </ul>
              Une famille modeste peut couvrir jusqu&apos;à 75 % du coût total.
            </>
          ),
        },
        {
          q: "PSE, laine de roche ou fibre de bois ?",
          a: (
            <>
              Le <strong>PSE</strong> est le plus économique et performant en
              isolation. La <strong>laine de roche</strong> est incombustible
              (obligatoire en immeuble &gt; R+3). La <strong>fibre de bois
              </strong> offre le meilleur confort d&apos;été et un bilan
              carbone très favorable. On choisit ensemble en fonction de votre
              projet et de votre budget.
            </>
          ),
        },
        {
          q: "Combien de temps dure un chantier ITE ?",
          a: (
            <>
              Pour une maison individuelle : 3 à 5 semaines. Pour une
              copropriété : 2 à 4 mois selon la surface et les finitions.
              L&apos;intervention reste compatible avec l&apos;occupation des
              logements.
            </>
          ),
        },
        {
          q: "Comment savoir si je suis éligible aux aides ?",
          a: (
            <>
              MaPrimeRénov&apos; est ouverte à tous les propriétaires (occupants
              et bailleurs) sans condition de ressources pour le forfait
              rénovation par geste. Le montant dépend de vos revenus (barème
              en quatre couleurs : bleu, jaune, violet, rose). On chiffre tout
              dans le devis.
            </>
          ),
        },
      ]}
      ctaTitle={
        <>
          Votre projet d&apos;ITE,
          <br />
          chiffré en <em>48h</em>.
        </>
      }
      ctaText="Diagnostic gratuit sur site, simulation des aides MaPrimeRénov' et CEE, devis détaillé sans engagement. On s'occupe de tout, vous n'avancez pas un euro de plus que le reste à charge."
    />
  );
}
