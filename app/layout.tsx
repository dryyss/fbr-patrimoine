import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import Topbar from "@/components/Topbar";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import ConsentDefault from "@/components/ConsentDefault";
import RevealOnScroll from "@/components/RevealOnScroll";
import { GTM_ID } from "@/lib/analytics";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fbr-patrimoine.com"),
  title: {
    default:
      "FBR Patrimoine — Réhabilitation du patrimoine bâti · Ravalement · ITE · Maçonnerie · Île-de-France",
    template: "%s — FBR Patrimoine",
  },
  description:
    "FBR Patrimoine, entreprise Qualibat RGE en Île-de-France. Spécialiste du ravalement de façades, isolation thermique extérieure, maçonnerie traditionnelle et réhabilitation du patrimoine bâti. Devis gratuit sous 48h.",
  keywords: [
    "ravalement façade Île-de-France",
    "ITE copropriété",
    "réhabilitation patrimoine",
    "maçonnerie traditionnelle",
    "Qualibat RGE",
    "FFB 95",
    "CoachCopro",
    "MaPrimeRénov",
  ],
  authors: [{ name: "FBR Patrimoine" }],
  alternates: {
    canonical: "https://www.fbr-patrimoine.com/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.fbr-patrimoine.com/",
    siteName: "FBR Patrimoine",
    title: "FBR Patrimoine — Réhabilitation du patrimoine bâti",
    description:
      "Spécialiste du ravalement, ITE, maçonnerie et réhabilitation du patrimoine en Île-de-France. Qualibat RGE.",
    images: ["/project6.jpg"],
  },
  icons: {
    icon: "/logo_mark.jpg",
  },
  robots: { index: true, follow: true },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "FBR Patrimoine",
  description:
    "Entreprise spécialisée en réhabilitation du patrimoine bâti, ravalement de façades, isolation thermique extérieure et maçonnerie traditionnelle.",
  url: "https://www.fbr-patrimoine.com",
  logo: "https://www.fbr-patrimoine.com/logo_mark.jpg",
  image: "https://www.fbr-patrimoine.com/project6.jpg",
  telephone: "+33763208753",
  email: "contact@fbr-patrimoine.com",
  areaServed: { "@type": "Place", name: "Île-de-France" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "7 Rue Joliot Curie",
    postalCode: "95800",
    addressLocality: "Courdimanche",
    addressRegion: "Île-de-France",
    addressCountry: "FR",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "08:00",
    closes: "19:00",
  },
  hasCredential: ["Qualibat RGE", "Adhérent FFB 95", "Affilié CoachCopro"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <ConsentDefault />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <Topbar />
        <Nav />
        {children}
        <Footer />
        <CookieBanner />
        <RevealOnScroll />
      </body>
      {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
    </html>
  );
}
