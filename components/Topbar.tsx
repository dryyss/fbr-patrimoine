"use client";

import { trackEmailClick, trackTelClick } from "@/lib/analytics";

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <a href="tel:0763208753" onClick={() => trackTelClick("topbar")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.49a1 1 0 01-.5 1.21l-2.26 1.13a11 11 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.49 1.5a1 1 0 01.68.95V20a2 2 0 01-2 2h-1C9.72 22 2 14.28 2 5V5z" />
            </svg>
            07 63 20 87 53
          </a>
          <a
            href="mailto:contact@fbr-patrimoine.com"
            onClick={() => trackEmailClick("topbar")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            contact@fbr-patrimoine.com
          </a>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Île-de-France
          </span>
        </div>
        <div className="topbar-right">
          <span className="badge">Devis gratuit</span>
          <span style={{ opacity: 0.85 }}>Lun – Sam · 8h – 19h</span>
        </div>
      </div>
    </div>
  );
}
