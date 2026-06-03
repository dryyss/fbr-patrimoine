import type { MetadataRoute } from "next";

const BASE = "https://www.fbr-patrimoine.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${BASE}/`, lastModified, changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE}/cabinet`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/expertises`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/realisations`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/temoignages`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/simulateur`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/certifications`, lastModified, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified, changeFrequency: "yearly", priority: 0.9 },
    { url: `${BASE}/devis-ravalement`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/devis-ite`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/devis-renovation-patrimoine`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/mentions-legales`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/politique-confidentialite`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
