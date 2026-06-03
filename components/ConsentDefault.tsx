import Script from "next/script";

// Google Consent Mode v2 — default to "denied" before any tag fires.
// Persisted choice is restored from localStorage so returning visitors
// keep their previous decision without flicker.
const CONSENT_KEY = "fbr-cookie-consent";

export default function ConsentDefault() {
  const inline = `
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
      wait_for_update: 500
    });
    gtag('set', 'ads_data_redaction', true);
    gtag('set', 'url_passthrough', true);
    try {
      var v = localStorage.getItem('${CONSENT_KEY}');
      if (v === 'accept') {
        gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          analytics_storage: 'granted'
        });
      }
    } catch (e) {}
  `;

  return (
    <Script
      id="gtm-consent-default"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: inline }}
    />
  );
}
