# Configuration du Build pour Cloudflare Pages

## Commande de Build Requise

Dans le dashboard Cloudflare Pages, configurez la commande de build suivante :

```
npm ci --legacy-peer-deps || npm install --legacy-peer-deps && npm run build:cloudflare && npm run pages:build
```

**IMPORTANT** : Cette commande inclut `npm run pages:build` qui utilise `@cloudflare/next-on-pages` pour adapter Next.js à Cloudflare Pages. C'est nécessaire pour le SSR (Server-Side Rendering).

## Répertoire de Sortie

Dans Cloudflare Pages Dashboard > Settings > Builds & deployments :

**Build output directory :**
```
.vercel/output/static
```

Cloudflare Pages devrait détecter automatiquement ce répertoire, mais vous pouvez le spécifier manuellement si nécessaire.

## Pourquoi cette commande ?

1. **`npm ci --legacy-peer-deps || npm install --legacy-peer-deps`**
   - Installe les dépendances avec `--legacy-peer-deps` pour gérer les conflits de versions
   - Utilise `npm ci` en premier (plus rapide), puis `npm install` en fallback

2. **`npm run build:cloudflare`**
   - Lance le build Next.js standard
   - **Nettoie automatiquement le cache webpack** après le build
   - Le cache webpack peut contenir des fichiers >50 MiB, ce qui dépasse la limite de 25 MiB par fichier de Cloudflare Pages

## Problème Résolu

Cloudflare Pages a une limite de **25 MiB par fichier**. Le cache webpack généré par Next.js peut contenir des fichiers très volumineux (jusqu'à 52+ MiB), ce qui cause l'erreur :

```
Error: Pages only supports files up to 25 MiB in size
cache/webpack/client-production/0.pack is 52.3 MiB in size
```

## Solution

Le script `scripts/clean-build.js` supprime automatiquement le cache webpack après le build, libérant généralement **100-150 MB** d'espace et évitant les fichiers trop volumineux.

## Fichiers Exclus

Le fichier `.wranglerignore` exclut également le cache webpack du déploiement :
- `.next/cache/webpack/` (tous les dossiers de cache webpack)
- `.next/cache/client-development/`
- `.next/cache/server-development/`
- `.next/trace`
- `.next/types/`

## Vérification

Après le build, vous devriez voir dans les logs :
```
🧹 Nettoyage du cache webpack pour Cloudflare Pages...
  ✓ Supprimé: client-production (XX MB)
  ✓ Supprimé: server-production (XX MB)
✓ Cache webpack supprimé: X fichiers, XX MB libérés
✓ Cache nettoyé (SWC conservé)
```

## Notes

- Le cache SWC est conservé car il est petit et utile
- Le cache webpack n'est pas nécessaire pour le déploiement, seulement pour accélérer les builds locaux
- Cette solution ne affecte pas les performances en production

