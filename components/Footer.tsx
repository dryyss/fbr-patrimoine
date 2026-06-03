import Link from "next/link";
import { EmailLink, TelLink } from "@/components/TrackedContact";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link href="/" className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo_mark.jpg"
              alt="FBR"
              className="logo-img"
              style={{ height: 50, background: "white", padding: 4 }}
            />
            <div className="logo-text">
              <span className="name">FBR Patrimoine</span>
              <span className="tag">Réhabilitation du patrimoine</span>
            </div>
          </Link>
          <p className="footer-desc">
            Entreprise spécialisée en réhabilitation du patrimoine bâti :
            ravalement, isolation thermique par l&apos;extérieur, maçonnerie
            traditionnelle et peinture. Au service de la pierre depuis plus de
            20 ans.
          </p>
          <div className="footer-legal">
            FBR PATRIMOINE — Réhabilitation du patrimoine
            <br />
            7 Rue Joliot Curie, 95800 Courdimanche
            <br />
            Certifiée Qualibat RGE · Adhérent FFB 95
            <br />
            Garantie décennale · Assurance professionnelle
          </div>
        </div>

        <div className="footer-col">
          <h5>Expertises</h5>
          <ul>
            <li><Link href="/expertises#maconnerie">Maçonnerie générale</Link></li>
            <li><Link href="/expertises#ravalement">Ravalement & ITE</Link></li>
            <li><Link href="/expertises#patrimoine">Réhabilitation patrimoine</Link></li>
            <li><Link href="/expertises#vrd">VRD, dalles, escaliers</Link></li>
            <li><Link href="/expertises#etudes">Études techniques</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Le cabinet</h5>
          <ul>
            <li><Link href="/cabinet">Notre histoire</Link></li>
            <li><Link href="/cabinet#methode">Notre méthode</Link></li>
            <li><Link href="/realisations">Réalisations</Link></li>
            <li><Link href="/certifications">Certifications</Link></li>
            <li><Link href="/certifications#aides">Aides financières</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Contact</h5>
          <ul>
            <li><TelLink source="footer">07 63 20 87 53</TelLink></li>
            <li><EmailLink source="footer">contact@fbr-patrimoine.com</EmailLink></li>
            <li><Link href="/contact">Île-de-France</Link></li>
            <li>
              <Link href="/contact" style={{ color: "var(--orange-light)" }}>
                Devis gratuit →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© {new Date().getFullYear()} FBR Patrimoine. Tous droits réservés.</div>

        <a
          href="https://magar-dev.com"
          target="_blank"
          rel="noopener"
          className="footer-credit"
          aria-label="Site conçu par Magar Développement"
        >
          <span className="footer-credit-label">Conçu par</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/magar-logo-colored.svg" alt="Magar Développement" />
        </a>

        <div className="footer-bottom-links">
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/politique-confidentialite">Politique de confidentialité</Link>
        </div>
      </div>
    </footer>
  );
}
