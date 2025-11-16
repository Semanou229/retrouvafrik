# 🚀 Déploiement Cloudflare Pages - RetrouvAfrik

## Configuration rapide

Le projet est maintenant prêt pour Cloudflare Pages ! 🎉

## Fichiers de configuration créés

- ✅ `wrangler.toml` - Configuration Cloudflare Workers/Pages
- ✅ `cloudflare.json` - Configuration Pages avec headers et routes
- ✅ `public/_headers` - Headers de sécurité
- ✅ `public/_redirects` - Redirections
- ✅ `next.config.js` - Optimisé pour Cloudflare
- ✅ `.gitignore` - Exclut les fichiers Cloudflare

## Déploiement en 3 étapes

### 1. Connecter GitHub à Cloudflare

1. Allez sur https://dash.cloudflare.com
2. **Workers & Pages** > **Create application** > **Pages**
3. **Connect to Git** > Sélectionnez `Semanou229/retrouvafrik`

### 2. Configurer le build

- **Framework preset**: `Next.js`
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (vide)

### 3. Ajouter les variables d'environnement

Dans **Settings > Environment Variables** :

**Obligatoires :**
```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
NEXT_PUBLIC_SITE_URL=https://retrouvafrik.pages.dev
```

**Optionnelles (pour les emails) :**
```
SMTP_HOST=smtp.votre-domaine.com
SMTP_PORT=587
SMTP_USER=votre-email@votre-domaine.com
SMTP_PASSWORD=votre-mot-de-passe
SMTP_FROM=votre-email@votre-domaine.com
SMTP_FROM_NAME=RetrouvAfrik
SMTP_SECURE=false
SMTP_API_KEY=votre-cle-secrete
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

## Configuration Supabase

N'oubliez pas de mettre à jour Supabase :

1. **Settings > API** > **Site URL** : `https://retrouvafrik.pages.dev`
2. **Authentication > URL Configuration** > **Redirect URLs** : `https://retrouvafrik.pages.dev/**`

## Déploiement

Cliquez sur **Save and Deploy** - C'est tout ! 🚀

Votre site sera disponible sur : `https://retrouvafrik.pages.dev`

## Documentation complète

Voir `DEPLOIEMENT_CLOUDFLARE.md` pour plus de détails.

