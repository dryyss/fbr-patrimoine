import Link from "next/link";
import { EmailLink, TelLink } from "@/components/TrackedContact";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  text: string;
  bgImage?: string; // e.g. "/project6.jpg"
};

export default function CtaBlock({
  eyebrow = "Contact",
  title,
  text,
  bgImage = "/project6.jpg",
}: Props) {
  return (
    <section className="cta-section">
      <div
        className="cta-section-bg"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="cta-inner">
        <div className="reveal">
          <div className="section-label" style={{ color: "var(--orange-light)" }}>
            {eyebrow}
          </div>
          <h2>{title}</h2>
          <p>{text}</p>
          <Link href="/contact" className="btn-primary">
            Demander un devis gratuit
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="cta-contacts reveal">
          <TelLink source="cta_block" className="cta-contact">
            <div className="cta-contact-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.49a1 1 0 01-.5 1.21l-2.26 1.13a11 11 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.49 1.5a1 1 0 01.68.95V20a2 2 0 01-2 2h-1C9.72 22 2 14.28 2 5V5z" />
              </svg>
            </div>
            <div>
              <div className="cta-contact-label">Téléphone</div>
              <div className="cta-contact-value">07 63 20 87 53</div>
            </div>
          </TelLink>

          <EmailLink source="cta_block" className="cta-contact">
            <div className="cta-contact-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <div className="cta-contact-label">Email</div>
              <div className="cta-contact-value">contact@fbr-patrimoine.com</div>
            </div>
          </EmailLink>
        </div>
      </div>
    </section>
  );
}
