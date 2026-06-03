import Link from "next/link";

type Props = {
  bgImage: string;
  breadcrumb: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  minHeight?: number;
};

export default function PageHero({
  bgImage,
  breadcrumb,
  eyebrow,
  title,
  description,
  minHeight,
}: Props) {
  return (
    <section className="page-hero" style={minHeight ? { minHeight } : undefined}>
      <div className="page-hero-bg" style={{ backgroundImage: `url(${bgImage})` }} />
      <div className="page-hero-inner">
        <div className="breadcrumb">
          <Link href="/">Accueil</Link> · <span>{breadcrumb}</span>
        </div>
        {eyebrow && <div className="page-hero-eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </section>
  );
}
