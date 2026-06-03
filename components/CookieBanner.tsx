"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { updateConsent } from "@/lib/analytics";

const COOKIE_KEY = "fbr-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) setVisible(true);
  }, []);

  const choose = (action: "accept" | "refuse") => {
    localStorage.setItem(COOKIE_KEY, action);
    updateConsent(action === "accept" ? "granted" : "denied");
    setLeaving(true);
    setTimeout(() => setVisible(false), 350);
  };

  if (!visible) return null;

  return (
    <div
      className={`cookie-banner ${leaving ? "cookie-banner-leaving" : ""}`}
      role="dialog"
      aria-label="Consentement aux cookies"
    >
      <div className="cookie-banner-inner">
        <div className="cookie-banner-text">
          <strong>Respect de votre vie privée</strong>
          <p>
            Nous utilisons des cookies pour mesurer l&apos;audience du site et
            améliorer votre expérience. Vous pouvez accepter, refuser ou
            personnaliser vos choix. Pour en savoir plus, consultez notre{" "}
            <Link href="/politique-confidentialite">politique de confidentialité</Link>.
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button
            type="button"
            className="cookie-btn cookie-btn-refuse"
            onClick={() => choose("refuse")}
          >
            Refuser
          </button>
          <button
            type="button"
            className="cookie-btn cookie-btn-accept"
            onClick={() => choose("accept")}
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
