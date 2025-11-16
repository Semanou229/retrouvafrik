# ⚡ Guide de déploiement rapide - Cloudflare Pages

## Déploiement en 5 minutes

### 1. Préparer le projet (déjà fait ✅)

Le projet est déjà configuré pour Cloudflare Pages avec :
- ✅ `wrangler.toml` - Configuration Cloudflare
- ✅ `cloudflare.json` - Configuration Pages
- ✅ `next.config.js` - Optimisé pour Cloudflare
- ✅ `.gitignore` - Exclut les fichiers Cloudflare

### 2. Connecter GitHub à Cloudflare

1. Allez sur https://dash.cloudflare.com
2. **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**
3. Autorisez Cloudflare et sélectionnez `Semanou229/retrouvafrik`

### 3. Configurer le build

Dans la configuration du projet :

- **Framework preset**: `Next.js`
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (vide)

### 4. Ajouter les variables d'environnement

Dans **Settings > Environment Variables**, ajoutez :

#### Production (obligatoires)

```
NEXT_PUBLIC_SUPABASE_URL = https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = votre_cle_anon
NEXT_PUBLIC_SITE_URL = https://retrouvafrik.pages.dev
```

#### Production (optionnelles - pour les emails)

```
SMTP_HOST = smtp.votre-domaine.com
SMTP_PORT = 587
SMTP_USER = votre-email@votre-domaine.com
SMTP_PASSWORD = votre-mot-de-passe
SMTP_FROM = votre-email@votre-domaine.com
SMTP_FROM_NAME = RetrouvAfrik
SMTP_SECURE = false
SMTP_API_KEY = votre-cle-secrete
SUPABASE_SERVICE_ROLE_KEY = votre_service_role_key
```

### 5. Déployer

Cliquez sur **Save and Deploy** - C'est tout ! 🎉

Votre site sera disponible sur : `https://retrouvafrik.pages.dev`

## Configuration Supabase

N'oubliez pas de mettre à jour Supabase :

1. **Settings > API** > **Site URL** : `https://retrouvafrik.pages.dev`
2. **Authentication > URL Configuration** > **Redirect URLs** : `https://retrouvafrik.pages.dev/**`

## Vérification

Après le déploiement, testez :
- ✅ Page d'accueil charge
- ✅ Connexion/Inscription fonctionne
- ✅ Les annonces s'affichent
- ✅ Les images se chargent

## Problèmes courants

**Build échoue** : Vérifiez les logs dans Cloudflare Dashboard
**Erreur Supabase** : Vérifiez que les variables d'environnement sont correctes
**404 sur les routes** : Normal, Cloudflare Pages gère automatiquement les routes Next.js

---

Pour plus de détails, voir `DEPLOIEMENT_CLOUDFLARE.md`

