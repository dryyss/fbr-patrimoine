export default function TrustBar({ label = "Certifications & affiliations" }: { label?: string }) {
  return (
    <section className="trust">
      <div className="trust-inner">
        <div className="trust-label">{label}</div>
        <div className="trust-logos">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/qualibat.png" alt="Qualibat RGE" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ffb95.jpg" alt="Adhérent FFB 95" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/coachcopro.jpg" alt="Affilié CoachCopro" />
        </div>
      </div>
    </section>
  );
}
