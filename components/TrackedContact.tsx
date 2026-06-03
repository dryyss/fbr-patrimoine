"use client";

import { trackEmailClick, trackTelClick } from "@/lib/analytics";

type Props = {
  source: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

const PHONE = "0763208753";
const EMAIL = "contact@fbr-patrimoine.com";

export function TelLink({ source, className, style, children }: Props) {
  return (
    <a
      href={`tel:${PHONE}`}
      className={className}
      style={style}
      onClick={() => trackTelClick(source)}
    >
      {children}
    </a>
  );
}

export function EmailLink({ source, className, style, children }: Props) {
  return (
    <a
      href={`mailto:${EMAIL}`}
      className={className}
      style={style}
      onClick={() => trackEmailClick(source)}
    >
      {children}
    </a>
  );
}
