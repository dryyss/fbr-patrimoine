"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "fbr-loader-seen";
const HOLD_MS = 1400;     // logo visible time
const FADE_OUT_MS = 700;  // fade transition duration

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
      <div className="home-loader-bg" />
      <div className="home-loader-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo_full.jpg" alt="" className="home-loader-logo" />
        <div className="home-loader-bar">
          <div className="home-loader-bar-fill" />
        </div>
        <div className="home-loader-tagline">
          Restaurer&nbsp;·&nbsp;Préserver&nbsp;·&nbsp;Bâtir
        </div>
      </div>
    </div>
  );
}
