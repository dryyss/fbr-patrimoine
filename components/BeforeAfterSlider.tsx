"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  caption?: string;
  location?: string;
  date?: string;
  workType?: string;
  /** Initial slider position 0-100 (default 50). */
  initial?: number;
  /** Aspect ratio, e.g. "4 / 3" or "16 / 9". Default "3 / 2". */
  aspectRatio?: string;
};

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Avant",
  afterAlt = "Après",
  caption,
  location,
  date,
  workType,
  initial = 50,
  aspectRatio = "3 / 2",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(initial);
  const draggingRef = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, x)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      setFromClientX(e.clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
      document.body.style.userSelect = "";
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [setFromClientX]);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    document.body.style.userSelect = "none";
    setFromClientX(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
    if (e.key === "Home") setPos(0);
    if (e.key === "End") setPos(100);
  };

  return (
    <figure className="ba-figure">
      <div
        ref={ref}
        className="ba-slider"
        style={{ aspectRatio }}
        onPointerDown={onPointerDown}
      >
        {/* AFTER (full background) */}
        <div className="ba-layer ba-after">
          <Image
            src={afterSrc}
            alt={afterAlt}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            style={{ objectFit: "cover" }}
            priority={false}
          />
          <span className="ba-tag ba-tag-after">Après</span>
        </div>

        {/* BEFORE (clipped overlay) */}
        <div
          className="ba-layer ba-before"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden={pos === 0}
        >
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            style={{ objectFit: "cover" }}
            priority={false}
          />
          <span className="ba-tag ba-tag-before">Avant</span>
        </div>

        {/* Handle */}
        <div
          className="ba-handle"
          style={{ left: `${pos}%` }}
          role="slider"
          tabIndex={0}
          aria-label="Glisser pour comparer avant / après"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={onKeyDown}
        >
          <div className="ba-handle-line" />
          <div className="ba-handle-knob">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l-6-6 6-6M15 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>

      {(caption || location || date || workType) && (
        <figcaption className="ba-caption">
          {workType && <span className="ba-caption-type">{workType}</span>}
          {caption && <strong className="ba-caption-title">{caption}</strong>}
          <span className="ba-caption-meta">
            {location && <span>{location}</span>}
            {location && date && <span aria-hidden> · </span>}
            {date && <span>{date}</span>}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
