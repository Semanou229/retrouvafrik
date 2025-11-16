# 🚀 Commande de Build pour Cloudflare Pages

## ⚠️ IMPORTANT : Copiez-Collez Cette Commande Exacte

Dans **Cloudflare Pages Dashboard** > **Settings** > **Builds & deployments** > **Build command**, utilisez **EXACTEMENT** cette commande :

```bash
npm ci --legacy-peer-deps || npm install --legacy-peer-deps && npm run build:pages
```

## 📋 Configuration Complète

### 1. Build Command
```
npm ci --legacy-peer-deps || npm install --legacy-peer-deps && npm run build:pages
```

### 2. Build Output Directory
```
.vercel/output/static
```

### 3. Root Directory (si nécessaire)
```
/ (racine du projet)
```

## ✅ Vérification

Après avoir configuré la commande, le build devrait :
1. ✅ Installer les dépendances avec `--legacy-peer-deps`
2. ✅ Builder Next.js (`next build`)
3. ✅ Nettoyer le cache webpack (`clean-build.js`)
4. ✅ Générer les fichiers pour Cloudflare Pages (`@cloudflare/next-on-pages`)
5. ✅ Créer le répertoire `.vercel/output/static`

## 🔍 Dépannage

### Erreur : "Syntax error: && unexpected"

**Cause** : La commande commence par `&&` au lieu de commencer par `npm`

**Solution** : Utilisez la commande complète ci-dessus, qui commence par `npm ci`

### Erreur : "Output directory .vercel/output/static not found"

**Cause** : La commande `npm run pages:build` n'a pas été exécutée

**Solution** : Utilisez `npm run build:pages` qui inclut automatiquement `pages:build`

## 📝 Note

Le script `build:pages` dans `package.json` combine automatiquement :
- `build:cloudflare` (qui fait `next build` + nettoyage cache)
- `pages:build` (qui génère les fichiers pour Cloudflare Pages)

Cela simplifie la commande de build dans Cloudflare Pages.

