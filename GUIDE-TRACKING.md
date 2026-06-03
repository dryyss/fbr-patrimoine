# Guide d'installation du tracking — FBR Patrimoine

Ce document explique comment **créer et brancher les comptes Google** nécessaires au site et aux campagnes Google Ads. Tout le code côté Next.js est déjà en place : il suffit de coller les bons identifiants dans les variables d'environnement Vercel.

> **Tant que `NEXT_PUBLIC_GTM_ID` est vide, aucun tag Google n'est chargé.** Le site reste 100 % RGPD-safe en attendant.

---

## 1. Vue d'ensemble des comptes à créer

| # | Service | Pour quoi faire ? | Identifiant à récupérer |
|---|---|---|---|
| 1 | **Google Tag Manager (GTM)** | Conteneur central qui héberge tous les autres tags. Évite de toucher au code à chaque modif. | `GTM-XXXXXXX` |
| 2 | **Google Analytics 4 (GA4)** | Mesure d'audience, comportement, conversions. Branché *dans* GTM. | `G-XXXXXXXXXX` |
| 3 | **Google Ads** | Diffusion des annonces + suivi des conversions. Branché *dans* GTM. | `AW-XXXXXXXXX` + libellé conversion |
| 4 | **Google Search Console** | Suivi du SEO organique. Vérification via GTM. | (juste vérifier le domaine) |
| 5 | **Google Business Profile** | Fiche établissement Google Maps (gratuit, ROI énorme en local). | — |

Ordre d'exécution recommandé : **GA4 → GTM → Ads → GSC → GBP**.

---

## 2. Créer le compte Google Analytics 4

1. Aller sur https://analytics.google.com avec un compte Google (idéalement un compte créé pour FBR Patrimoine, ex. `gtm@fbr-patrimoine.com`).
2. **Administration** → **Créer un compte** :
   - Nom du compte : `FBR Patrimoine`
   - Décocher tous les partages de données sauf "Indispensables".
3. **Créer une propriété** :
   - Nom : `www.fbr-patrimoine.com`
   - Fuseau : `Europe/Paris`
   - Devise : `EUR`
4. **Choix du secteur** : Bâtiment / construction.
5. **Flux de données Web** → URL `https://www.fbr-patrimoine.com` → nom `Site principal`.
6. ➡️ **Récupérer l'identifiant `G-XXXXXXXXXX`** (en haut à droite du flux). On le branchera dans GTM, pas ici directement.
7. Dans **Administration → Paramètres de la propriété → Conservation des données** : passer à **14 mois** (par défaut c'est 2 mois, trop court).
8. Optionnel mais recommandé : **Administration → Anonymisation IP** → activé (RGPD).

---

## 3. Créer le compte Google Tag Manager

1. Aller sur https://tagmanager.google.com avec le **même compte Google** que pour GA4.
2. **Créer un compte** :
   - Nom : `FBR Patrimoine`
   - Pays : France
3. **Créer un conteneur** :
   - Nom : `www.fbr-patrimoine.com`
   - Cible : **Web**
4. ➡️ **Récupérer l'identifiant `GTM-XXXXXXX`** (en haut à droite, à côté de la version).

### 3.1 Brancher GTM sur le site

Dans **Vercel → Project Settings → Environment Variables**, ajouter pour `Production` et `Preview` :

```
NEXT_PUBLIC_GTM_ID = GTM-XXXXXXX
```

Puis redéployer. Le `<script GTM>` se charge automatiquement (cf. `app/layout.tsx`).

### 3.2 Configurer la balise GA4 dans GTM

Dans GTM → **Balises → Nouvelle** :
- Type : **Google Tag (GA4)**
- ID du tag : `G-XXXXXXXXXX` (récupéré à l'étape 2)
- Déclencheur : **All Pages**
- Nom de la balise : `GA4 — Config`

Puis **Publier** la version (bouton en haut à droite).

### 3.3 Configurer les événements personnalisés dans GA4

Le site pousse déjà ces événements dans `dataLayer` (cf. `lib/analytics.ts`). Il suffit de les déclarer dans GTM pour qu'ils remontent dans GA4 :

| Événement dataLayer | Quand | Paramètres |
|---|---|---|
| `generate_lead` | Formulaire de contact soumis avec succès | `lead_source`, `project_type`, `postal_code`, `visitor_profile`, `currency=EUR`, `value=1` |
| `tel_click` | Clic sur n'importe quel numéro de téléphone | `click_source` (topbar / footer / cta_block / contact_page / merci_page) |
| `email_click` | Clic sur n'importe quel lien mailto | `click_source` (idem) |
| `cta_click` | Clic sur un CTA tracké (optionnel, helper dispo) | `cta_label`, `cta_destination` |

Dans GTM, créer pour chaque événement :
- Un **Déclencheur** type **Événement personnalisé** avec le nom exact (ex. `generate_lead`).
- Une **Balise GA4 — Événement** liée au tag de config, nom de l'événement identique.

---

## 4. Créer le compte Google Ads et le suivi des conversions

1. Aller sur https://ads.google.com avec le même compte Google.
2. **Mode expert** (ne pas prendre le mode simplifié "Smart").
3. Compte facturation France, EUR.
4. **Outils → Conversions → + Nouvelle action de conversion** :
   - Source : **Site Web**
   - Type d'objectif : **Prospect → Envoi de formulaire de prospect**
   - Nom : `Lead — Formulaire devis`
   - Valeur : **Utiliser la même valeur pour chaque conversion** = `1` EUR (ajustable plus tard)
   - Comptabilisation : **Une**
   - Fenêtre de conversion : 30 jours
   - Inclure dans "Conversions" : **Oui**
5. **Méthode de configuration → Google Tag Manager**.
6. ➡️ Récupérer **ID de conversion** (`AW-XXXXXXXXX`) et **Libellé de conversion** (ex. `abc123XYZ`).

### 4.1 Brancher la conversion dans GTM

Dans GTM → **Balises → Nouvelle** :
- Type : **Suivi des conversions Google Ads**
- ID de conversion : `AW-XXXXXXXXX`
- Libellé : `abc123XYZ`
- **Valeur de la conversion → Utiliser une variable du data layer → `value`**
- **Devise → Utiliser une variable du data layer → `currency`**
- Déclencheur : **Événement personnalisé `generate_lead`** (créé à l'étape 3.3)
- Nom de la balise : `Ads — Conversion Lead`

Publier. À partir de là, chaque soumission de formulaire compte 1 conversion à 1 € dans Ads.

### 4.2 (Optionnel) Conversion sur clic téléphone

Pour compter les appels téléphoniques mobiles comme conversions :
- Créer une seconde action Ads → **Appel téléphonique → Appels depuis le site Web**
- Brancher sur l'événement `tel_click` dans GTM
- Valeur recommandée : 5 € (lead chaud)

---

## 5. Lier Ads ↔ GA4 ↔ Search Console

1. **Ads → Outils → Comptes associés → Google Analytics (GA4)** → lier la propriété.
2. **GA4 → Administration → Liens produits → Google Ads** → confirmer le lien (importer les audiences).
3. **Search Console** : créer la propriété domaine `fbr-patrimoine.com`, méthode de vérification = **Google Tag Manager** (auto si GTM publié).
4. **GA4 → Administration → Liens produits → Search Console** → lier.

---

## 6. Consent Mode v2 (RGPD)

Déjà en place dans le code :
- Par défaut, **tous les stockages publicitaires et analytiques sont en `denied`** (cf. `components/ConsentDefault.tsx`).
- Le bandeau cookie (`components/CookieBanner.tsx`) appelle `updateConsent('granted')` ou `('denied')` au clic.
- Le choix est mémorisé dans `localStorage` (clé `fbr-cookie-consent`) et restauré dès le prochain chargement, avant que GTM ne s'initialise.

**Aucune action côté Google** : Consent Mode v2 fonctionne tout seul, il faut juste s'assurer que dans Ads → Paramètres → "Mode de consentement Google" est bien activé (par défaut oui).

---

## 7. Emails — Resend (formulaire de contact + simulateur)

Le formulaire de contact et le simulateur IA passent tous les deux par **Resend** (100 emails/jour gratuits, pas de CB demandée).

### 7.1 Créer le compte et vérifier le domaine

1. Compte sur https://resend.com avec le même Google (ou créer un compte dédié).
2. **Domains → Add Domain → `fbr-patrimoine.com`**.
3. Resend affiche 3 enregistrements DNS à ajouter dans le registrar du domaine (OVH, Gandi, etc.) :
   - **SPF** : enregistrement TXT racine
   - **DKIM** : enregistrement TXT sur un sous-domaine `resend._domainkey`
   - **DMARC** (recommandé) : enregistrement TXT sur `_dmarc`
4. Attendre la propagation (~30 min à 24 h). Resend coche le domaine en vert.
5. **API Keys → Create API Key** → nom `Site Production`, permission **Sending access**, domaine **fbr-patrimoine.com**.
6. ➡️ Copier la clé `re_xxxxxxxxxxxx` (elle n'est affichée qu'une fois).

### 7.2 Variables Vercel à renseigner

| Variable | Exemple | Rôle |
|---|---|---|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxx` | Clé API Resend |
| `FBR_NOTIFY_TO` | `contact@fbr-patrimoine.com` | Où FBR reçoit les leads |
| `FBR_NOTIFY_FROM` | `FBR Patrimoine <noreply@fbr-patrimoine.com>` | Expéditeur (doit être sur un domaine vérifié) |

Sans ces variables : le formulaire répond 503 et affiche "Service email temporairement indisponible, appelez-nous au 07 63 20 87 53".

### 7.3 Ce que le code fait

- `app/api/contact/route.ts` reçoit le POST du formulaire, valide les champs (regex email + CP 5 chiffres), filtre les bots (honeypot + rate-limit 5/jour/IP).
- Envoie en parallèle :
  - **Email interne à FBR** (template HTML soigné, `reply_to: prospect@email` pour répondre directement)
  - **Accusé de réception au prospect** (template HTML aux couleurs FBR, `reply_to: contact@fbr-patrimoine.com`)
- Renvoie 200 OK → ContactForm pousse `generate_lead` dans dataLayer → redirige vers `/contact/merci`.

---

## 8. Checklist de déploiement

Avant de lancer la première campagne Ads :

- [ ] Domaine `fbr-patrimoine.com` vérifié dans Resend (SPF + DKIM + DMARC verts)
- [ ] Variables `RESEND_API_KEY`, `FBR_NOTIFY_TO`, `FBR_NOTIFY_FROM` renseignées dans Vercel
- [ ] Test live : remplir le formulaire `/contact` → vérifier que **FBR reçoit l'email** et le **prospect reçoit l'accusé de réception**
- [ ] Variable `NEXT_PUBLIC_GTM_ID` renseignée dans Vercel
- [ ] Tag GA4 publié dans GTM
- [ ] Événement `generate_lead` configuré dans GTM avec déclencheur correspondant
- [ ] Tag Ads Conversion publié dans GTM
- [ ] Test live : remplir le formulaire de contact → vérifier que `/contact/merci` s'affiche → vérifier dans GA4 → DebugView que l'événement `generate_lead` arrive
- [ ] Test Ads : Outils → Configuration → **Diagnostic des balises** → statut "Actif"
- [ ] Search Console : vérification domaine OK, sitemap soumis (`/sitemap.xml`)
- [ ] Google Business Profile créé et adresse 95800 Courdimanche validée

---

## 9. Récap des fichiers code touchés

| Fichier | Rôle |
|---|---|
| `lib/analytics.ts` | Helpers `updateConsent`, `trackLead`, `trackTelClick`, `trackEmailClick`, `trackCtaClick`, `trackEvent` |
| `components/ConsentDefault.tsx` | Script inline `beforeInteractive` — Consent Mode v2 default + restauration localStorage |
| `components/CookieBanner.tsx` | Bandeau cookie — pilote le Consent Mode au clic |
| `components/TrackedContact.tsx` | `<TelLink>` / `<EmailLink>` — wrappers cliquables avec tracking |
| `components/ContactForm.tsx` | POST vers `/api/contact` + push `generate_lead` + redirection vers `/contact/merci` |
| `app/api/contact/route.ts` | API route Resend — email FBR + accusé prospect + honeypot + rate-limit |
| `app/layout.tsx` | Injection `<ConsentDefault />` + `<GoogleTagManager />` conditionnelle |
| `app/contact/merci/page.tsx` | Page de remerciement (cible URL conversion + `noindex`) |
| `app/devis-ravalement/`, `app/devis-ite/`, `app/devis-renovation-patrimoine/` | Landing pages Ads, basées sur `components/LandingPage.tsx` |
| `.env.example` | Documentation des variables d'env |
