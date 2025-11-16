# Fix: Erreur 404 sur Cloudflare Pages

## Problème

Après le déploiement, vous obtenez une erreur 404 : "Cette page retrouvafrik.pages.dev est introuvable".

## Cause

Cloudflare Pages ne supporte pas nativement Next.js avec SSR (Server-Side Rendering). Il faut utiliser `@cloudflare/next-on-pages` pour adapter Next.js à Cloudflare Pages.

## Solution

### Étape 1 : Mettre à jour la commande de build dans Cloudflare Pages

Dans le dashboard Cloudflare Pages > Settings > Builds & deployments, modifiez la commande de build :

**Commande de build :**
```
npm ci --legacy-peer-deps || npm install --legacy-peer-deps && npm run build:cloudflare && npm run pages:build
```

Cette commande :
1. Installe les dépendances
2. Build Next.js et nettoie le cache webpack
3. **Génère les fichiers pour Cloudflare Pages avec `@cloudflare/next-on-pages`** (nécessaire pour le SSR)

### Étape 2 : Mettre à jour le répertoire de sortie

Dans Cloudflare Pages Dashboard > Settings > Builds & deployments :

**Build output directory :**
```
.vercel/output/static
```

**OU** laissez Cloudflare Pages détecter automatiquement (il devrait détecter `.vercel/output/static`).

### Étape 3 : Vérifier la configuration

Assurez-vous que :
1. ✅ `@cloudflare/next-on-pages` est installé (déjà ajouté dans `package.json`)
2. ✅ La commande de build inclut `npm run pages:build`
3. ✅ Le répertoire de sortie est `.vercel/output/static`

## Alternative : Export Statique (Non recommandé pour ce projet)

Si vous voulez éviter `@cloudflare/next-on-pages`, vous pouvez utiliser `output: 'export'` dans `next.config.js`, mais cela désactivera le SSR et les routes API, ce qui n'est pas adapté pour ce projet qui utilise beaucoup de pages dynamiques.

## Vérification

Après le déploiement, vous devriez voir dans les logs :
```
✓ Built Next.js app for Cloudflare Pages
✓ Output directory: .vercel/output/static
```

Et le site devrait être accessible sur `https://retrouvafrik.pages.dev`.

