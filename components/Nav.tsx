"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavLink = {
  href: string;
  label: string;
  highlight?: boolean;
};

const links: NavLink[] = [
  { href: "/", label: "Accueil" },
  { href: "/cabinet", label: "Le cabinet" },
  { href: "/expertises", label: "Expertises" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/simulateur", label: "Simulateur", highlight: true },
  { href: "/temoignages", label: "Témoignages" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll + ESC handler when drawer open
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("nav-locked");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("nav-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const linkClass = (l: NavLink) =>
    [
      isActive(l.href) ? "active" : "",
      l.highlight ? "nav-highlight" : "",
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <nav className={`site-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <Link href="/" className="logo" aria-label="FBR Patrimoine — Accueil">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo_mark.jpg" alt="" className="logo-img" />
          <div className="logo-text">
            <span className="name">FBR Patrimoine</span>
            <span className="tag">Réhabilitation du patrimoine</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="nav-desktop">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={linkClass(l)}>
                {l.label}
                {l.highlight && <span className="nav-badge">Nouveau</span>}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/contact"
              className={`nav-cta ${pathname === "/contact" ? "active" : ""}`}
            >
              Devis gratuit
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </li>
        </ul>

        {/* Burger button */}
        <button
          type="button"
          className={`nav-burger ${open ? "open" : ""}`}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="nav-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`nav-drawer-backdrop ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <aside
        id="nav-drawer"
        className={`nav-drawer ${open ? "open" : ""}`}
        aria-hidden={!open}
      >
        <div className="nav-drawer-head">
          <span className="nav-drawer-title">Menu</span>
          <button
            type="button"
            className="nav-drawer-close"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul className="nav-drawer-list">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={linkClass(l)}>
                {l.label}
                {l.highlight && <span className="nav-badge">Nouveau</span>}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/contact" className="btn-primary nav-drawer-cta">
          Devis gratuit
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>

        <div className="nav-drawer-foot">
          <a href="tel:0763208753" className="nav-drawer-foot-line">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.49a1 1 0 01-.5 1.21l-2.26 1.13a11 11 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.49 1.5a1 1 0 01.68.95V20a2 2 0 01-2 2h-1C9.72 22 2 14.28 2 5V5z" />
            </svg>
            07 63 20 87 53
          </a>
          <a href="mailto:contact@fbr-patrimoine.com" className="nav-drawer-foot-line">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            contact@fbr-patrimoine.com
          </a>
        </div>
      </aside>
    </nav>
  );
}
