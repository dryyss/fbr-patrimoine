import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site FBR Patrimoine conformément à la loi LCEN.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "https://www.fbr-patrimoine.com/mentions-legales",
  },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero
        bgImage="/project6.jpg"
        breadcrumb="Mentions légales"
        title={<>Mentions <em>légales</em>.</>}
        minHeight={280}
      />

      <section style={{ background: "#fff" }}>
        <div className="legal-content">
          <h2>1. Éditeur du site</h2>
          <p>
            Le présent site est édité par :<br />
            <strong>FBR Patrimoine</strong> (Société Francilienne de Bâtiment et
            Réhabilitation)
            <br />
            <strong>Forme juridique :</strong> Société par actions simplifiée
            (SASU – associé unique)
            <br />
            <strong>Capital social :</strong> 3 000 €
            <br />
            <strong>Siège social :</strong> 7 Rue Joliot Curie, 95800 Courdimanche
            <br />
            <strong>RCS :</strong> 941 164 527 R.C.S. Pontoise
            <br />
            <strong>SIRET :</strong> 941 164 527 00017
            <br />
            <strong>Date d&apos;immatriculation :</strong> 27/02/2025
            <br />
            <strong>Représentée par :</strong> Hafedh Ghazouani, président
            <br />
            <strong>Téléphone :</strong> 07 63 20 87 53
            <br />
            <strong>Email :</strong> contact@fbr-patrimoine.com
            <br />
            <strong>Site web :</strong> www.fbr-patrimoine.com
          </p>
          <p>
            <strong>Activités principales :</strong> travaux de maçonnerie générale,
            béton armé, ravalement, restauration du patrimoine ancien, isolation
            thermique par l&apos;extérieur et tous travaux annexes de bâtiment, travaux
            publics et second œuvre.
          </p>

          <h2>2. Directeur de la publication</h2>
          <p>
            Monsieur Hafedh Ghazouani, en sa qualité de président de FBR Patrimoine.
          </p>

          <h2>3. Hébergement</h2>
          <p>
            Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA
            91789, USA. Hébergement statique haute performance avec certificat SSL
            inclus et CDN mondial.
          </p>

          <h2>4. Conception et réalisation</h2>
          <p>
            Le présent site a été conçu et développé par{" "}
            <strong>Magar Développement</strong>, représenté par Andrys Magar,
            développeur fondateur.
            <br />
            Site web :{" "}
            <a href="https://magar-dev.com" target="_blank" rel="noopener">
              magar-dev.com
            </a>
          </p>

          <h2>5. Certifications & formations professionnelles</h2>
          <p>FBR Patrimoine est titulaire des qualifications suivantes :</p>
          <ul>
            <li>
              <strong>Qualibat RGE</strong> — code <strong>7131</strong> :
              Isolation thermique par l&apos;extérieur (Reconnu Garant de
              l&apos;Environnement)
            </li>
            <li><strong>Adhérent FFB 95</strong> — Fédération Française du Bâtiment, Val-d&apos;Oise</li>
            <li><strong>Affilié CoachCopro</strong></li>
          </ul>
          <p>
            Le dirigeant, Hafedh Ghazouani, est titulaire des formations spécialisées
            suivantes :
          </p>
          <ul>
            <li>
              <strong>Amiante Sous-Section 4</strong> — Cumul des fonctions
              d&apos;encadrement technique, encadrement de chantier et opérateur
              (formation conforme à l&apos;arrêté du 23 février 2012)
            </li>
            <li>
              <strong>Risques d&apos;exposition au plomb</strong> — Encadrant technique
              (formation FORMADISTECH, 21/10/2022, n° ET-INI-PB-2022-10-002)
            </li>
          </ul>
          <p>
            <strong>Assurance responsabilité civile et décennale :</strong> FBR
            Patrimoine est assurée pour l&apos;ensemble de ses prestations au
            titre de la garantie décennale (article 1792 du Code civil) —
            police n° <strong>LUN2502446</strong>.
          </p>

          <h2>6. Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus présents sur ce site (textes, images, logos,
            vidéos, éléments graphiques) sont la propriété exclusive de FBR Patrimoine
            ou de ses partenaires, et sont protégés par le Code de la propriété
            intellectuelle.
          </p>
          <p>
            Toute reproduction, représentation, modification, publication, transmission
            ou dénaturation, totale ou partielle, par quelque procédé que ce soit, sans
            autorisation écrite préalable de FBR Patrimoine, est strictement interdite
            et constitue un délit de contrefaçon (articles L.335-2 et suivants du Code
            de la propriété intellectuelle).
          </p>
          <p>
            Les photographies de chantiers présentées sur ce site ont été réalisées par
            FBR Patrimoine.
          </p>

          <h2>7. Données personnelles</h2>
          <p>
            Le traitement des données personnelles collectées via le site est détaillé
            dans la <Link href="/politique-confidentialite">politique de confidentialité</Link>,
            consultable depuis le pied de page de toutes les pages du site.
          </p>

          <h2>8. Limitations de responsabilité</h2>
          <p>
            FBR Patrimoine s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à
            jour des informations diffusées sur le site. Toutefois, FBR Patrimoine ne
            peut garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des
            informations mises à disposition.
          </p>
          <p>
            Les contenus à valeur contractuelle (devis, contrat, factures) sont les
            seuls documents engageant FBR Patrimoine. Les illustrations, exemples de
            chantiers et descriptions de prestations sur le site ont une valeur
            indicative et ne constituent pas une offre commerciale ferme.
          </p>

          <h2>9. Droit applicable</h2>
          <p>
            Les présentes mentions légales sont régies par la loi française. En cas de
            litige, les tribunaux français seront seuls compétents.
          </p>

          <h2>10. Crédits</h2>
          <p>
            Polices de caractères : Fraunces et Inter (Google Fonts), chargées via
            next/font.
            <br />
            Icônes : tracées en SVG, libres de droits.
          </p>

          <p style={{ marginTop: 60, fontSize: 13, color: "var(--ink-mute)" }}>
            Mentions légales mises à jour le 20 mai 2026.
          </p>
        </div>
      </section>
    </>
  );
}
