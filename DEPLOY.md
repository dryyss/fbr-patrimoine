# Déploiement — FBR Patrimoine

Procédure pour mettre le site en ligne sur Vercel et brancher le domaine
`fbr-patrimoine.com`.

## 1. Import du projet dans Vercel

1. Aller sur https://vercel.com/new
2. **Import Git Repository** → sélectionner `dryyss/fbr-patrimoine`
   (autoriser l'app GitHub Vercel si demandé)
3. Framework : **Next.js** (détecté automatiquement)
4. Build command : `next build` (par défaut)
5. Output : `.next` (par défaut)
6. **Ne pas cliquer Deploy** tout de suite — passer d'abord à l'étape 2.

## 2. Variables d'environnement (Project Settings → Environment Variables)

Renseigner pour **Production** + **Preview** :

| Variable | Valeur | Indispensable ? |
|---|---|---|
| `NEXT_PUBLIC_FORMSPREE_ID` | ID Formspree du formulaire contact | Oui pour le devis |
| `NEXT_PUBLIC_GTM_ID` | `GTM-XXXXXXX` | Non — vide = pas de tracking |
| `REPLICATE_API_TOKEN` | clé Replicate | Non — vide = simulateur en mode stub |
| `RESEND_API_KEY` | clé Resend | Non — vide = leads loggés en console seulement |
| `FBR_NOTIFY_TO` | `contact@fbr-patrimoine.com` | Uniquement avec `RESEND_API_KEY` |
| `FBR_NOTIFY_FROM` | `Simulateur FBR <noreply@fbr-patrimoine.com>` | Uniquement avec `RESEND_API_KEY` |

Le site fonctionne **sans aucune variable** : Formspree affiche un message
d'erreur tant que l'ID n'est pas renseigné, le simulateur tourne en stub
(renvoie la photo originale), aucun email n'est envoyé.

## 3. Premier déploiement

Une fois les variables saisies → **Deploy**.

Vercel build en ~2 min, puis donne une URL temporaire en
`fbr-patrimoine-xxx.vercel.app`. Vérifier rapidement :
- [ ] Home charge avec le loader + logo
- [ ] Burger menu fonctionne sur mobile
- [ ] `/simulateur` → la gate s'affiche, le form est obligatoire
- [ ] `/contact` → le formulaire envoie bien si `NEXT_PUBLIC_FORMSPREE_ID` est OK
- [ ] `/realisations#avant-apres` → le slider drag-to-reveal marche

## 4. Domaine `fbr-patrimoine.com`

1. Project Settings → **Domains** → ajouter `fbr-patrimoine.com` et
   `www.fbr-patrimoine.com`
2. Vercel donne 2 records à créer chez le registrar du client :
   - `A` `@` → `76.76.21.21`
   - `CNAME` `www` → `cname.vercel-dns.com`
3. Attendre la propagation DNS (5 min à 2 h)
4. Vercel génère automatiquement le certificat SSL Let's Encrypt

## 5. Activation des features optionnelles, post-MVP

### Simulateur IA réel (Replicate)
1. Créer un compte sur https://replicate.com (Sign in with GitHub OK)
2. Récupérer une clé sur https://replicate.com/account/api-tokens
3. Choisir un modèle façade — recommandation : un ControlNet SDXL ou
   `flux-schnell` adapté architecture. Tester d'abord depuis le playground
   Replicate avec une photo de façade.
4. **Pinner la version du modèle** dans
   [app/api/simulator/route.ts](app/api/simulator/route.ts) (chercher le
   commentaire `TODO: remplacer par la version pinnée`).
5. Ajouter `REPLICATE_API_TOKEN` dans Vercel env → redeploy
6. Surveiller la facturation Replicate les premiers jours
   (rate-limit déjà en place : 3/jour/IP + 500/mois global).

### Notifications email vers FBR (Resend)
1. Créer un compte sur https://resend.com (100 emails/jour gratuits)
2. **Verify domain** `fbr-patrimoine.com` → Resend donne 3 records DNS
   (SPF, DKIM, MX) à créer chez le registrar.
3. Une fois le domaine vérifié, créer une clé API.
4. Ajouter dans Vercel env :
   - `RESEND_API_KEY`
   - `FBR_NOTIFY_TO=contact@fbr-patrimoine.com`
   - `FBR_NOTIFY_FROM=Simulateur FBR <noreply@fbr-patrimoine.com>`
5. Redeploy. À partir de là, chaque génération du simulateur envoie un email
   à FBR avec la photo en pièce jointe + les coordonnées du lead.

### Tracking Google (GTM + GA4 + Ads)
Voir [GUIDE-TRACKING.md](GUIDE-TRACKING.md) pour la procédure complète
(création des comptes, branchement, configuration des conversions Ads).

## 6. Workflow Git après le premier déploiement

À chaque `git push` sur la branche `main`, Vercel rebuild et déploie
automatiquement en production. Les autres branches déclenchent des
déploiements **Preview** avec une URL unique (utile pour faire valider une
modif au client avant fusion).

```bash
# workflow type
git checkout -b feat/nom-de-la-feature
# ... éditer ...
git add .
git commit -m "feat: description"
git push -u origin feat/nom-de-la-feature
# → preview URL Vercel automatique
# puis merge dans main quand validé
```
