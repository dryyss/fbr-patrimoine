"use client";

import Image from "next/image";
import { useState } from "react";

type Cat = "all" | "patrimoine" | "copro" | "religieux" | "interieur";

type Item = {
  id: string;
  src: string;
  alt: string;
  tag: string;
  title: string;
  loc: string;
  cat: Exclude<Cat, "all">;
  tall?: boolean;
};

const ITEMS: Item[] = [
  {
    id: "saint-jean-baptiste",
    src: "/project5.jpg",
    alt: "Clocher Église Saint Jean-Baptiste — ravalement complet",
    tag: "Édifice religieux",
    title: "Clocher Église Saint Jean-Baptiste",
    loc: "Île-de-France · Ravalement complet sur échafaudage",
    cat: "religieux",
    tall: true,
  },
  {
    id: "pierre-de-taille",
    src: "/project1.jpg",
    alt: "Résidence en pierre de taille — copropriété",
    tag: "Copropriété",
    title: "Résidence en pierre de taille",
    loc: "Île-de-France · Ravalement & ITE",
    cat: "copro",
  },
  {
    id: "facade-reconstruite",
    src: "/project2.jpg",
    alt: "Façade reconstruite — copropriété",
    tag: "Copropriété",
    title: "Façade reconstruite",
    loc: "Hauts-de-Seine · Maçonnerie & ravalement",
    cat: "copro",
  },
  {
    id: "haussmannien",
    src: "/project6.jpg",
    alt: "Hôtel particulier haussmannien — Paris",
    tag: "Patrimoine",
    title: "Hôtel particulier haussmannien",
    loc: "Paris · Ravalement à la chaux",
    cat: "patrimoine",
  },
  {
    id: "balcons",
    src: "/project3.jpg",
    alt: "Résidence aux balcons restaurés",
    tag: "Ravalement",
    title: "Résidence aux balcons restaurés",
    loc: "Île-de-France · Ravalement",
    cat: "copro",
  },
  {
    id: "clocher-detail",
    src: "/project4.jpg",
    alt: "Clocher restauré — détail final",
    tag: "Restauration",
    title: "Clocher restauré — détail final",
    loc: "Édifice classé · Pierre & béton",
    cat: "religieux",
    tall: true,
  },
  {
    id: "cage-escalier",
    src: "/project7.jpg",
    alt: "Cage d'escalier — restauration parties communes",
    tag: "Intérieur",
    title: "Cage d'escalier — parties communes",
    loc: "Paris · Restauration moulures",
    cat: "interieur",
  },
  {
    id: "escalier-bois",
    src: "/project8.jpg",
    alt: "Escalier ancien et moulures — immeuble haussmannien",
    tag: "Patrimoine",
    title: "Escalier ancien & moulures",
    loc: "Immeuble haussmannien · Restauration",
    cat: "interieur",
  },
  {
    id: "pavage",
    src: "/project9.jpg",
    alt: "Pavage cour parisienne — pavés anciens",
    tag: "Maçonnerie",
    title: "Pavage cour pavée parisienne",
    loc: "Paris · Pavés anciens",
    cat: "patrimoine",
  },
  {
    id: "art-nouveau",
    src: "/project10.jpg",
    alt: "Façade Art Nouveau aux décors floraux et ferronneries dorées",
    tag: "Patrimoine d'exception",
    title: "Façade Art Nouveau",
    loc: "Restauration de décors peints, ferronneries & menuiseries",
    cat: "patrimoine",
    tall: true,
  },
];

const FILTERS: { id: Cat; label: string }[] = [
  { id: "all", label: "Tout voir" },
  { id: "patrimoine", label: "Patrimoine" },
  { id: "copro", label: "Copropriétés" },
  { id: "religieux", label: "Édifices religieux" },
  { id: "interieur", label: "Intérieurs" },
];

export default function RealisationsGrid({ withFilter = true }: { withFilter?: boolean }) {
  const [filter, setFilter] = useState<Cat>("all");

  return (
    <>
      {withFilter && (
        <div className="real-filters reveal">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter-btn ${filter === f.id ? "active" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="real-grid">
        {ITEMS.map((item) => {
          const hidden = filter !== "all" && filter !== item.cat;
          return (
            <div
              key={item.id}
              className={`real-card reveal ${item.tall ? "tall" : ""} ${hidden ? "hidden" : ""}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
              <div className="real-overlay">
                <div className="real-tag">{item.tag}</div>
                <div className="real-title">{item.title}</div>
                <div className="real-loc">{item.loc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
