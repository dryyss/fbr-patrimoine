// Centralized analytics / Consent Mode v2 helpers.
// All events go through GTM's dataLayer; the Google Ads conversion tag
// itself is configured inside GTM (trigger = "generate_lead" event).

declare global {
  interface Window {
    // Matches @next/third-parties' own declaration (optional Object[]).
    dataLayer?: Object[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

type ConsentState = "granted" | "denied";

export function updateConsent(state: ConsentState) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const dl = (window.dataLayer = window.dataLayer || []);
  dl.push({ event: name, ...params });
}

export type LeadPayload = {
  source: string;
  projectType?: string;
  postalCode?: string;
  profile?: string;
};

export function trackLead({ source, projectType, postalCode, profile }: LeadPayload) {
  trackEvent("generate_lead", {
    lead_source: source,
    project_type: projectType,
    postal_code: postalCode,
    visitor_profile: profile,
    currency: "EUR",
    value: 1,
  });
}

export function trackTelClick(source: string) {
  trackEvent("tel_click", { click_source: source });
}

export function trackEmailClick(source: string) {
  trackEvent("email_click", { click_source: source });
}

export function trackCtaClick(label: string, destination: string) {
  trackEvent("cta_click", { cta_label: label, cta_destination: destination });
}
