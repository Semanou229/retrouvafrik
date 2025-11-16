# 🔧 Solution Définitive pour Cloudflare Pages

## Problème

Cloudflare Pages utilise automatiquement `npm clean-install` qui n'existe pas, causant l'échec du build.

## ✅ Solution : Configuration dans Cloudflare Dashboard

### Étape 1 : Aller dans Cloudflare Dashboard

1. Connectez-vous à https://dash.cloudflare.com/
2. Allez dans **Workers & Pages** > votre projet **RetrouvAfrik**

### Étape 2 : Configurer la commande de build

1. Cliquez sur **Settings** > **Builds & deployments**
2. Dans la section **Build configuration**, modifiez :

   **Build command** :
   ```
   npm install --legacy-peer-deps && npm run build
   ```
   
   **Build output directory** :
   ```
   .next
   ```
   
   **Root directory** :
   ```
   / (vide)
   ```

### Étape 3 : Configurer les variables d'environnement

Dans **Settings** > **Environment variables**, ajoutez :

```
NODE_VERSION = 18
```

Et toutes vos variables Supabase :
```
NEXT_PUBLIC_SUPABASE_URL = votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY = votre_clé_anon
NEXT_PUBLIC_SITE_URL = https://retrouvafrik.pages.dev
```

### Étape 4 : Désactiver le système de build v2 (si nécessaire)

Si le problème persiste :

1. Dans **Settings** > **Builds & deployments**
2. Désactivez **"Use Cloudflare Build v2"**
3. Utilisez le système de build v1 (plus stable)

### Étape 5 : Sauvegarder et redéployer

1. Cliquez sur **Save**
2. Allez dans **Deployments**
3. Cliquez sur **Retry deployment** sur le dernier déploiement

## 🔍 Vérification

Après avoir configuré :

1. Vérifiez que la commande de build est correcte dans les settings
2. Vérifiez que toutes les variables d'environnement sont définies
3. Relancez un déploiement manuellement
4. Consultez les logs de build pour voir si l'erreur persiste

## ⚠️ Note importante

Le fichier `wrangler.toml` est lu par Cloudflare Pages, mais la commande de build doit être configurée manuellement dans le dashboard Cloudflare. Le fichier `wrangler.toml` définit seulement le répertoire de sortie (`.next`).

## 📋 Commandes de build alternatives à essayer

Si la première commande ne fonctionne pas, essayez :

**Option 1** :
```
npm ci --legacy-peer-deps && npm run build
```

**Option 2** :
```
rm -rf node_modules package-lock.json && npm install --legacy-peer-deps && npm run build
```

**Option 3** :
```
npm install --legacy-peer-deps --no-audit && npm run build
```

## 🎯 Configuration recommandée finale

**Build settings:**
- **Framework preset**: `Next.js` (détecté automatiquement)
- **Build command**: `npm install --legacy-peer-deps && npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (vide)
- **Node version**: `18` (via variable d'environnement `NODE_VERSION`)

**Environment variables:**
- `NODE_VERSION` = `18`
- Toutes les variables Supabase et SMTP

## ✅ Après configuration

Une fois configuré correctement, le build devrait réussir et votre application sera déployée sur Cloudflare Pages !

