import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Politique de confidentialité · RGPD",
  description:
    "Politique de confidentialité du site FBR Patrimoine, conforme au Règlement Général sur la Protection des Données (RGPD).",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "https://www.fbr-patrimoine.com/politique-confidentialite",
  },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <PageHero
        bgImage="/project6.jpg"
        breadcrumb="Politique de confidentialité"
        title={<>Politique de <em>confidentialité</em>.</>}
        minHeight={280}
      />

      <section style={{ background: "#fff" }}>
        <div className="legal-content">
          <p style={{ fontStyle: "italic", color: "var(--ink-mute)" }}>
            La présente politique décrit comment FBR Patrimoine collecte, utilise et
            protège vos données personnelles, conformément au Règlement Général sur la
            Protection des Données (RGPD — Règlement UE 2016/679) et à la loi
            française « Informatique et Libertés ».
          </p>

          <h2>1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données personnelles collectées sur le
            présent site est :
            <br />
            <strong>FBR Patrimoine</strong>, représentée par son fondateur Hafedh
            Ghazouani.
            <br />
            Email de contact :{" "}
            <a href="mailto:contact@fbr-patrimoine.com">contact@fbr-patrimoine.com</a>
          </p>

          <h2>2. Données collectées et finalités</h2>
          <p>
            Les données personnelles que nous collectons sont strictement limitées à ce
            qui est nécessaire pour répondre aux finalités suivantes :
          </p>
          <ul>
            <li>
              <strong>Formulaire de demande de devis</strong> — Nous collectons : nom,
              prénom, adresse email, téléphone, code postal, type de projet, descriptif
              libre. <em>Finalité :</em> traiter votre demande de devis et vous
              recontacter.
            </li>
            <li>
              <strong>Mesure d&apos;audience anonymisée</strong> — Nous collectons des
              statistiques de fréquentation anonymisées (pages visitées, durée, source
              de trafic) si vous y consentez via le bandeau cookies.{" "}
              <em>Finalité :</em> améliorer le site.
            </li>
          </ul>
          <p>
            <strong>Aucune donnée n&apos;est collectée à votre insu.</strong> Aucune
            information sensible (santé, opinions politiques, religion, etc.)
            n&apos;est demandée ou collectée.
          </p>

          <h2>3. Base légale du traitement</h2>
          <p>Le traitement de vos données est fondé sur :</p>
          <ul>
            <li>
              Votre <strong>consentement explicite</strong> lors de la soumission du
              formulaire de contact (case à cocher) ;
            </li>
            <li>
              L&apos;<strong>intérêt légitime</strong> de FBR Patrimoine à mesurer
              l&apos;audience de son site, sous réserve de votre consentement via le
              bandeau cookies.
            </li>
          </ul>

          <h2>4. Durée de conservation</h2>
          <p>
            Vos données sont conservées pour la durée strictement nécessaire aux
            finalités du traitement :
          </p>
          <ul>
            <li>
              Données du formulaire de contact : <strong>3 ans</strong> à compter du
              dernier échange, sauf opposition de votre part.
            </li>
            <li>
              Données de mesure d&apos;audience : <strong>13 mois</strong> maximum
              (durée recommandée par la CNIL).
            </li>
            <li>
              Données comptables (devis transformés en facture) : durée légale de
              conservation comptable (10 ans).
            </li>
          </ul>

          <h2>5. Destinataires des données</h2>
          <p>
            Vos données ne sont <strong>jamais cédées, vendues ou louées</strong> à des
            tiers. Elles sont uniquement accessibles :
          </p>
          <ul>
            <li>
              Au personnel habilité de FBR Patrimoine, dans le strict cadre du
              traitement de votre demande.
            </li>
            <li>
              À nos prestataires techniques (hébergeur Vercel, service de formulaire
              Formspree), strictement liés par un contrat conforme au RGPD.
            </li>
          </ul>

          <h2>6. Cookies</h2>
          <p>
            Le site utilise un nombre minimal de cookies, dont l&apos;usage est
            encadré :
          </p>
          <ul>
            <li>
              <strong>Cookies strictement nécessaires</strong> — Indispensables au
              fonctionnement du site (mémorisation de votre choix de cookies).{" "}
              <em>Sans consentement requis.</em>
            </li>
            <li>
              <strong>Cookies de mesure d&apos;audience</strong> — Permettent
              d&apos;améliorer le site (Google Analytics 4, anonymisé).{" "}
              <em>Avec consentement explicite via le bandeau cookies.</em>
            </li>
          </ul>
          <p>
            Vous pouvez à tout moment modifier vos choix en effaçant les données du
            site dans votre navigateur, ce qui affichera à nouveau le bandeau de
            consentement.
          </p>

          <h2>7. Sécurité</h2>
          <p>
            FBR Patrimoine met en œuvre les mesures techniques et organisationnelles
            appropriées pour protéger vos données : connexion HTTPS chiffrée, accès
            restreint aux données, hébergement sur infrastructure sécurisée européenne.
          </p>

          <h2>8. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez sur vos données personnelles des droits
            suivants :
          </p>
          <ul>
            <li><strong>Droit d&apos;accès</strong> — obtenir copie des données vous concernant ;</li>
            <li><strong>Droit de rectification</strong> — corriger des données inexactes ;</li>
            <li><strong>Droit à l&apos;effacement</strong> (« droit à l&apos;oubli ») ;</li>
            <li><strong>Droit à la limitation</strong> du traitement ;</li>
            <li><strong>Droit à la portabilité</strong> — récupérer vos données dans un format ouvert ;</li>
            <li><strong>Droit d&apos;opposition</strong> au traitement ;</li>
            <li><strong>Droit de retirer votre consentement</strong> à tout moment.</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous par email à{" "}
            <a href="mailto:contact@fbr-patrimoine.com">contact@fbr-patrimoine.com</a>{" "}
            en précisant l&apos;objet de votre demande. Nous vous répondrons dans un
            délai maximum d&apos;un mois.
          </p>
          <p>
            Si vous estimez que vos droits ne sont pas respectés, vous pouvez
            introduire une réclamation auprès de la <strong>CNIL</strong> (Commission
            Nationale de l&apos;Informatique et des Libertés) —{" "}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener">
              www.cnil.fr
            </a>
            .
          </p>

          <h2>9. Modifications</h2>
          <p>
            FBR Patrimoine se réserve le droit de modifier la présente politique pour
            l&apos;adapter aux évolutions légales ou techniques. La date de dernière
            mise à jour est précisée ci-dessous. Nous vous invitons à consulter
            régulièrement cette page.
          </p>

          <p style={{ marginTop: 60, fontSize: 13, color: "var(--ink-mute)" }}>
            Politique de confidentialité mise à jour le 29 avril 2026.
          </p>
        </div>
      </section>
    </>
  );
}
