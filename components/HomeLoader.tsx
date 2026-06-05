"use client";

import { useEffect, useState, type CSSProperties } from "react";

const SESSION_KEY = "fbr-loader-seen";
const HOLD_MS = 2400;
const FADE_OUT_MS = 900;

const TAGLINE_WORDS = ["Restaurer", "Préserver", "Bâtir"] as const;

export default function HomeLoader() {
  const [phase, setPhase] = useState<"hidden" | "visible" | "fading">("hidden");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    sessionStorage.setItem(SESSION_KEY, "1");
    document.body.classList.add("loader-locked");
    setPhase("visible");

    const fadeAt = setTimeout(() => setPhase("fading"), HOLD_MS);
    const doneAt = setTimeout(() => {
      setPhase("hidden");
      document.body.classList.remove("loader-locked");
    }, HOLD_MS + FADE_OUT_MS);

    return () => {
      clearTimeout(fadeAt);
      clearTimeout(doneAt);
      document.body.classList.remove("loader-locked");
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={`home-loader ${phase === "fading" ? "fading" : ""}`}
      aria-hidden
    >
      <div className="home-loader-bg">
        <div className="home-loader-orb home-loader-orb--blue" />
        <div className="home-loader-orb home-loader-orb--orange" />
        <div className="home-loader-lines" aria-hidden />
      </div>

      <div className="home-loader-curtain" aria-hidden />

      <div className="home-loader-stage">
        <div className="home-loader-brand">
          <div className="home-loader-mark-wrap">
            <div className="home-loader-mark-glow" aria-hidden />
            <div className="home-loader-mark-ring" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo_mark.jpg"
              alt=""
              className="home-loader-mark"
              width={120}
              height={120}
            />
          </div>

          <p className="home-loader-claim">
            <span className="home-loader-claim-line">Réhabilitation</span>
            <span className="home-loader-claim-line">du patrimoine</span>
          </p>
        </div>

        <div className="home-loader-progress" role="presentation">
          <div className="home-loader-progress-track">
            <div className="home-loader-progress-fill" />
          </div>
          <span className="home-loader-progress-label">Chargement</span>
        </div>

        <p className="home-loader-tagline">
          {TAGLINE_WORDS.map((word, i) => (
            <span key={word} style={{ "--i": i } as CSSProperties}>
              {word}
              {i < TAGLINE_WORDS.length - 1 && (
                <span className="home-loader-tagline-dot" aria-hidden>
                  ·
                </span>
              )}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
