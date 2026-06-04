# DEVIS N° FBR-2026-001

**Date :** 3 juin 2026  
**Validité :** 30 jours  
**Objet :** Conception, développement et mise en production du site vitrine **FBR Patrimoine**

---

## Émetteur

**[Votre nom / raison sociale]**  
[Votre adresse]  
[Votre email] · [Votre téléphone]  
SIRET : [à compléter]

## Client

**FBR Patrimoine**  
Société Francilienne de Bâtiment et Réhabilitation  
7 rue Joliot Curie — 95800 Courdimanche  
contact@fbr-patrimoine.com · 07 63 20 87 53

---

## 1. Contexte du projet

À partir des éléments fournis par le client (logos, photos de chantiers, documents Word/PDF, plaquette), conception et développement d’un **site vitrine professionnel** orienté génération de leads (demandes de devis) pour une entreprise de **ravalement, ITE, maçonnerie et réhabilitation du patrimoine bâti** en Île-de-France.

Le site est développé sous **Next.js 15** (React 19, TypeScript), responsive, optimisé SEO, conforme RGPD, et prêt pour un hébergement sur **Vercel** avec le domaine `fbr-patrimoine.com`.

---

## 2. Synthèse des prestations réalisées

| Lot | Description | Statut |
|-----|-------------|--------|
| **A** | Intégration graphique & charte (bleu / orange / pierre) | ✅ Livré |
| **B** | Pages vitrine & contenus métier | ✅ Livré |
| **C** | Formulaires de contact & capture de leads | ✅ Livré |
| **D** | Simulateur façade IA (MVP) | ✅ Livré |
| **E** | SEO, conformité légale & analytics | ✅ Livré |
| **F** | Documentation déploiement & tracking | ✅ Livré |

---

## 3. Détail technique — ce qui a été développé

### 3.1 Architecture & stack

- Application **Next.js 15** (App Router) avec **TypeScript**
- Composants React réutilisables (~15 composants métier)
- Feuille de styles globale (~3 300 lignes) : design system cohérent
- **40+ fichiers** source (pages, API, librairies, composants)
- Build de production validé (`npm run build` sans erreur)
- Prêt pour déploiement **Vercel** + domaine personnalisé

### 3.2 Pages du site (17 URLs)

| Page | URL | Contenu |
|------|-----|---------|
| Accueil | `/` | Hero, formulaire rapide, expertises, process, réalisations, CTA |
| Le cabinet | `/cabinet` | Présentation entreprise, valeurs, équipe |
| Expertises | `/expertises` | 4 métiers détaillés (maçonnerie, ravalement/ITE, patrimoine, VRD) |
| Réalisations | `/realisations` | Galerie photos + filtres par type de chantier |
| Témoignages | `/temoignages` | Avis clients |
| Contact | `/contact` | Formulaire de devis complet |
| Merci | `/contact/merci` | Page de confirmation post-envoi |
| Certifications | `/certifications` | Qualibat RGE, FFB 95, CoachCopro |
| Simulateur IA | `/simulateur` | Visualisation façade avant/après (IA) |
| Landing ravalement | `/devis-ravalement` | Page SEO Google Ads |
| Landing ITE | `/devis-ite` | Page SEO Google Ads |
| Landing patrimoine | `/devis-renovation-patrimoine` | Page SEO Google Ads |
| Mentions légales | `/mentions-legales` | Obligations légales |
| Politique confidentialité | `/politique-confidentialite` | RGPD |
| Sitemap | `/sitemap.xml` | Indexation moteurs de recherche |
| Robots | `/robots.txt` | Directives crawlers |

### 3.3 Composants & interface utilisateur

- **Navigation** fixe avec effet au scroll + **menu burger** mobile (drawer, verrouillage scroll, touche Échap)
- **Topbar** : téléphone, email, horaires
- **Footer** : liens, coordonnées, logo partenaire Magar Développement
- **Bandeau certifications** (Qualibat, FFB 95, CoachCopro)
- **Hero** accueil avec formulaire de demande de devis intégré
- **Cartes expertises** animées au scroll (reveal)
- **Grille réalisations** avec filtrage par catégorie
- **Slider avant/après** interactif (glisser pour comparer)
- **Blocs CTA** réutilisables sur toutes les pages
- **Écran d’introduction animé** (loader accueil) : monogramme SVG, animations, barre de progression, rideau de sortie — affiché une fois par session
- **Typographies** Google Fonts : Inter + Fraunces (titres serif)

### 3.4 Formulaire de contact & emails

- Formulaire multi-champs : identité, email, téléphone, profil visiteur, type de projet, CP/ville, message libre
- Case à cocher **RGPD** obligatoire avec lien politique de confidentialité
- **Champ honeypot** anti-spam (bots)
- **Limitation de débit** : 5 envois / jour / IP
- Validation serveur (email, code postal 5 chiffres, champs obligatoires)
- API `/api/contact` avec envoi d’emails via **Resend** :
  - Notification interne à FBR (tableau récapitulatif HTML)
  - Accusé de réception automatique au prospect
- Gestion du **mode test Resend** (sandbox) et fallback développement
- Redirection vers `/contact/merci` après succès
- Réutilisation du formulaire sur les **3 landing pages** dédiées

### 3.5 Simulateur façade IA (fonctionnalité différenciante)

- Upload photo façade (drag & drop ou sélection fichier, max 8 Mo)
- **4 styles de finition** : enduit chaux, enduit moderne, ITE bardage bois, ITE enduit
- **3 niveaux d’intensité** de transformation
- Champ description libre du projet (intégré au prompt IA)
- Formulaire lead obligatoire avant génération (coordonnées + RGPD)
- Persistance des données en session (sessionStorage)
- API `/api/simulator` :
  - Vérification que l’image est bien une façade (vision)
  - Composition de prompt métier (règles par style)
  - Génération image via **Replicate** (ou mode démo sans clé API)
  - Intégration **Gemini** pour enrichissement du prompt
- API `/api/simulator/vision` pour analyse d’image
- **Rate limiting** : 3 générations / jour / IP, plafond 500 / mois global
- Notification email à FBR après génération (si Resend configuré)
- Affichage résultat avant/après + CTA devis

### 3.6 SEO & référencement

- Balises **meta** title / description sur toutes les pages
- **Open Graph** pour partage réseaux sociaux
- **JSON-LD LocalBusiness** (Schema.org) : adresse, téléphone, horaires, certifications
- **Sitemap XML** dynamique
- **robots.txt** configuré
- URLs canoniques
- Pages landing optimisées pour mots-clés : ravalement, ITE, rénovation patrimoine
- Structure sémantique (titres H1–H3, sections, liens internes)

### 3.7 Conformité RGPD & cookies

- **Bandeau cookies** avec choix Accepter / Refuser
- **Google Consent Mode v2** (tout refusé par défaut tant que pas de consentement)
- Aucun tag Google chargé tant que `GTM_ID` est vide (site « clean » par défaut)
- Pages mentions légales et politique de confidentialité rédigées
- Formulaires : consentement explicite au traitement des données

### 3.8 Tracking & marketing (pré-câblé, activation par le client)

- Module `lib/analytics.ts` centralisé
- Événements **dataLayer** prêts pour GTM :
  - `generate_lead` (soumission formulaire)
  - `tel_click` / `email_click` (clics coordonnées)
  - `cta_click` (boutons d’action)
- Liens téléphone/email trackés (`TrackedContact`)
- Guide complet **GUIDE-TRACKING.md** (GA4, GTM, Google Ads, Search Console, Business Profile)

### 3.9 Contenus & assets

- Intégration des **logos** FBR (monogramme, versions couleur / transparent)
- **10+ photos** de chantiers en galerie
- Logos partenaires : Qualibat RGE, FFB 95, CoachCopro
- Textes métier rédigés à partir des documents client (ravalement, isolation, peinture, patrimoine)
- Coordonnées et zone d’intervention Île-de-France

### 3.10 Documentation livrée

| Document | Contenu |
|----------|---------|
| `.env.example` | Variables d’environnement documentées |
| `DEPLOY.md` | Procédure déploiement Vercel + domaine |
| `GUIDE-TRACKING.md` | Configuration Google Analytics / Ads |
| `DEVIS-FBR-PATRIMOINE.md` | Le présent document |

---

## 4. Liste exhaustive des fonctionnalités

### Site vitrine
- [x] Page d’accueil complète (hero, expertises, méthode, réalisations, témoignages, CTA)
- [x] Page « Le cabinet »
- [x] Page « Expertises » (4 pôles métiers)
- [x] Page « Réalisations » avec galerie filtrable
- [x] Page « Témoignages »
- [x] Page « Certifications & affiliations »
- [x] Page « Contact »
- [x] Page « Merci » post-formulaire
- [x] 3 landing pages SEO (/devis-ravalement, /devis-ite, /devis-renovation-patrimoine)
- [x] Mentions légales
- [x] Politique de confidentialité

### Design & UX
- [x] Charte graphique professionnelle (bleu marine, orange, tons pierre)
- [x] Design 100 % responsive (mobile, tablette, desktop)
- [x] Menu navigation desktop + burger mobile
- [x] Animations au scroll (reveal)
- [x] Écran d’accueil animé (loader première visite)
- [x] Slider avant/après interactif
- [x] Formulaire hero sur la page d’accueil

### Leads & communication
- [x] Formulaire de demande de devis (contact + landings)
- [x] Envoi email notification FBR (Resend)
- [x] Email accusé de réception prospect
- [x] Anti-spam (honeypot + rate limit IP)
- [x] Validation des champs côté serveur

### Simulateur IA
- [x] Upload et prévisualisation photo façade
- [x] Choix du style de finition (4 options)
- [x] Choix de l’intensité (3 niveaux)
- [x] Description libre du projet
- [x] Capture lead avant génération
- [x] Génération image IA (Replicate + Gemini)
- [x] Mode démo sans API (stub)
- [x] Limitation d’usage (anti-abus)
- [x] Notification email post-simulation

### SEO & technique
- [x] Meta tags & Open Graph
- [x] Données structurées LocalBusiness (JSON-LD)
- [x] Sitemap XML automatique
- [x] robots.txt
- [x] Performance : pages statiques pré-rendues (SSG)

### RGPD & analytics
- [x] Bandeau cookies
- [x] Consent Mode Google v2
- [x] Tracking GTM prêt (désactivé par défaut)
- [x] Événements conversion (lead, tel, email, CTA)

---

## 5. Hors périmètre (non inclus dans le forfait)

Les éléments suivants restent à la charge du client ou font l’objet d’une prestation complémentaire :

- Achat et configuration du **nom de domaine** `fbr-patrimoine.com`
- Abonnement / facturation **Vercel**, **Resend**, **Replicate**, **Google Ads**
- Vérification du domaine email chez Resend (SPF, DKIM, DMARC)
- Création et paramétrage des comptes **GTM / GA4 / Google Ads**
- Rédaction ou shooting de **nouvelles photos** / vidéos
- Maintenance évolutive mensuelle (hors garantie corrective 30 jours*)
- Traduction multilingue

*\* Garantie corrective : correction des bugs bloquants signalés dans les 30 jours suivant la livraison, hors évolutions fonctionnelles.*

---

## 6. Conditions financières

| Désignation | Montant |
|-------------|---------|
| Conception, développement et livraison du site FBR Patrimoine (lots A à F) | **1 500,00 €** |
| **Total forfaitaire** | **1 500,00 €** |

**Modalités de paiement proposées :**
- 50 % à la commande (750 €)
- 50 % à la livraison / mise en ligne (750 €)

**Délai de réalisation :** livré (site fonctionnel en local, build OK, documentation fournie).  
**Mise en production :** à planifier avec le client (import Vercel + DNS domaine).

*TVA : [non applicable — art. 293 B du CGI / ou TVA 20 % en sus selon votre régime — à adapter]*

---

## 7. Acceptation du devis

Bon pour accord :

| | Client | Prestataire |
|---|--------|-------------|
| **Nom** | | |
| **Date** | | |
| **Signature** | | |

---

*Document généré le 3 juin 2026 — Projet FBR Patrimoine · Site Next.js vitrine & simulateur IA*
