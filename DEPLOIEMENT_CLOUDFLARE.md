# 🚀 Déploiement sur Cloudflare Pages - RetrouvAfrik

## Vue d'ensemble

Ce guide vous explique comment déployer RetrouvAfrik sur Cloudflare Pages, une plateforme de déploiement rapide et gratuite pour les applications Next.js.

## Prérequis

1. Un compte Cloudflare (gratuit)
2. Un compte GitHub avec le projet RetrouvAfrik
3. Un projet Supabase configuré
4. Node.js 18+ installé localement (pour les tests)

## Méthode 1 : Déploiement via GitHub (Recommandé)

### Étape 1 : Connecter votre dépôt GitHub

1. **Connectez-vous à Cloudflare Dashboard**
   - Allez sur https://dash.cloudflare.com
   - Connectez-vous ou créez un compte

2. **Accédez à Pages**
   - Dans le menu de gauche, cliquez sur **Workers & Pages**
   - Cliquez sur **Create application**
   - Sélectionnez **Pages**
   - Cliquez sur **Connect to Git**

3. **Autoriser Cloudflare**
   - Autorisez Cloudflare à accéder à votre compte GitHub
   - Sélectionnez le dépôt `Semanou229/retrouvafrik`

### Étape 2 : Configuration du build

Dans la page de configuration du projet, configurez :

**Build settings:**
- **Framework preset**: `Next.js`
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (laisser vide)

**Environment variables:**
Ajoutez toutes les variables d'environnement nécessaires (voir section Variables d'environnement ci-dessous)

### Étape 3 : Variables d'environnement

Dans **Settings > Environment Variables**, ajoutez :

#### Variables publiques (NEXT_PUBLIC_*)

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
NEXT_PUBLIC_SITE_URL=https://retrouvafrik.pages.dev
```

#### Variables privées (API)

```env
SMTP_HOST=smtp.votre-domaine.com
SMTP_PORT=587
SMTP_USER=votre-email@votre-domaine.com
SMTP_PASSWORD=votre-mot-de-passe-smtp
SMTP_FROM=votre-email@votre-domaine.com
SMTP_FROM_NAME=RetrouvAfrik
SMTP_SECURE=false
SMTP_API_KEY=votre-cle-secrete-pour-l-api
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

### Étape 4 : Déploiement

1. Cliquez sur **Save and Deploy**
2. Cloudflare va automatiquement :
   - Cloner votre dépôt
   - Installer les dépendances (`npm install`)
   - Builder le projet (`npm run build`)
   - Déployer sur Cloudflare Pages

3. Une fois le déploiement terminé, votre site sera disponible à :
   `https://retrouvafrik.pages.dev`

### Étape 5 : Configuration du domaine personnalisé (Optionnel)

1. Dans **Settings > Custom domains**
2. Cliquez sur **Set up a custom domain**
3. Entrez votre domaine (ex: `retrouvafrik.com`)
4. Suivez les instructions pour configurer les DNS

## Méthode 2 : Déploiement via Wrangler CLI

### Installation de Wrangler

```bash
npm install -g wrangler
```

### Authentification

```bash
wrangler login
```

### Configuration

1. **Créer un projet Cloudflare Pages**

```bash
wrangler pages project create retrouvafrik
```

2. **Déployer le projet**

```bash
# Build le projet
npm run build

# Déployer
wrangler pages deploy .next --project-name=retrouvafrik
```

### Variables d'environnement avec Wrangler

```bash
# Ajouter une variable d'environnement
wrangler pages secret put NEXT_PUBLIC_SUPABASE_URL --project-name=retrouvafrik

# Ou pour la production
wrangler pages secret put SMTP_PASSWORD --project-name=retrouvafrik --env=production
```

## Configuration requise

### Variables d'environnement minimales

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de votre projet Supabase | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase | `eyJhbGc...` |
| `NEXT_PUBLIC_SITE_URL` | URL de votre site Cloudflare | `https://retrouvafrik.pages.dev` |

### Variables d'environnement optionnelles

| Variable | Description | Requis pour |
|----------|-------------|-------------|
| `SMTP_HOST` | Serveur SMTP | Notifications email |
| `SMTP_PORT` | Port SMTP | Notifications email |
| `SMTP_USER` | Utilisateur SMTP | Notifications email |
| `SMTP_PASSWORD` | Mot de passe SMTP | Notifications email |
| `SMTP_FROM` | Email expéditeur | Notifications email |
| `SMTP_FROM_NAME` | Nom expéditeur | Notifications email |
| `SMTP_API_KEY` | Clé API pour l'endpoint SMTP | Notifications email |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service_role Supabase | Scripts admin |

## Configuration Supabase pour Cloudflare

### 1. Autoriser le domaine Cloudflare

Dans Supabase Dashboard > **Settings > API** :

1. Ajoutez votre domaine Cloudflare dans **Site URL** :
   ```
   https://retrouvafrik.pages.dev
   ```

2. Ajoutez dans **Redirect URLs** :
   ```
   https://retrouvafrik.pages.dev/**
   ```

### 2. Configuration CORS

Les requêtes depuis Cloudflare Pages vers Supabase fonctionnent automatiquement. Aucune configuration CORS supplémentaire n'est nécessaire.

## Vérification du déploiement

### Checklist post-déploiement

- [ ] Le site est accessible sur l'URL Cloudflare
- [ ] L'authentification fonctionne (connexion/inscription)
- [ ] Les annonces s'affichent correctement
- [ ] Les images se chargent depuis Supabase Storage
- [ ] Les formulaires fonctionnent
- [ ] Les routes API fonctionnent (`/api/smtp/send`, `/api/notifications/send`)
- [ ] Les emails de notification sont envoyés (si configuré)

### Tests à effectuer

1. **Test d'authentification**
   - Inscription d'un nouvel utilisateur
   - Connexion avec un compte existant
   - Déconnexion

2. **Test de publication**
   - Créer une nouvelle annonce
   - Ajouter des photos
   - Publier l'annonce

3. **Test de recherche**
   - Rechercher des annonces
   - Utiliser les filtres
   - Trier les résultats

4. **Test des fonctionnalités**
   - Envoyer un message
   - Commenter une annonce
   - Signaler une information

## Optimisations Cloudflare

### Cache

Cloudflare Pages met automatiquement en cache :
- Les fichiers statiques (`/_next/static/`)
- Les assets (images, CSS, JS)

### Performance

- **CDN global** : Votre site est distribué sur le réseau Cloudflare
- **Compression automatique** : Gzip/Brotli activé par défaut
- **HTTP/2 et HTTP/3** : Support automatique

### Sécurité

Les headers de sécurité sont configurés dans `cloudflare.json` :
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy

## Dépannage

### Erreur de build

**Problème** : Le build échoue sur Cloudflare

**Solutions** :
1. Vérifier que toutes les dépendances sont dans `package.json`
2. Vérifier la version de Node.js (Cloudflare utilise Node.js 18+)
3. Vérifier les logs de build dans Cloudflare Dashboard

### Erreur "Module not found"

**Problème** : Erreur lors du build concernant des modules manquants

**Solutions** :
1. Vérifier que `node_modules` n'est pas dans `.gitignore` (il ne doit pas être commité)
2. Vérifier que toutes les dépendances sont listées dans `package.json`
3. Vérifier que `package-lock.json` est présent

### Erreur d'authentification Supabase

**Problème** : Les requêtes Supabase échouent

**Solutions** :
1. Vérifier que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont correctement configurées
2. Vérifier que le domaine Cloudflare est autorisé dans Supabase
3. Vérifier les CORS dans Supabase Dashboard

### Erreur API routes

**Problème** : Les routes API (`/api/*`) ne fonctionnent pas

**Solutions** :
1. Vérifier que les routes API sont dans `app/api/`
2. Vérifier que les variables d'environnement nécessaires sont configurées
3. Vérifier les logs dans Cloudflare Dashboard > Functions

## Commandes utiles

### Déploiement manuel

```bash
# Build local
npm run build

# Déployer avec Wrangler
wrangler pages deploy .next --project-name=retrouvafrik
```

### Vérifier les variables d'environnement

```bash
wrangler pages secret list --project-name=retrouvafrik
```

### Voir les logs

```bash
wrangler pages deployment tail --project-name=retrouvafrik
```

## Support

Pour plus d'aide :
- Documentation Cloudflare Pages : https://developers.cloudflare.com/pages/
- Documentation Next.js : https://nextjs.org/docs
- Support Cloudflare : https://support.cloudflare.com/

---

**RetrouvAfrik** - Déployé avec ❤️ sur Cloudflare Pages

