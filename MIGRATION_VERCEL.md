# 🚀 Migration vers Vercel - Guide Complet

## Pourquoi Vercel ?

Cloudflare Pages a des limitations incompatibles avec Next.js :
- ❌ Edge Runtime ne supporte pas `async_hooks`
- ❌ `@cloudflare/next-on-pages` est déprécié
- ❌ Problèmes persistants avec les dépendances Node.js

Vercel offre :
- ✅ Support Next.js natif (créé par les créateurs de Next.js)
- ✅ Runtime Node.js complet sans limitations
- ✅ Déploiement automatique depuis GitHub
- ✅ Plan gratuit généreux (100 GB bandwidth/mois)
- ✅ Pas de configuration complexe

## Étapes de Migration

### 1. Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Sign Up"
3. Connectez votre compte GitHub

### 2. Importer le projet

1. Dans le dashboard Vercel, cliquez sur "Add New Project"
2. Sélectionnez le repository `retrouvafrik`
3. Vercel détectera automatiquement Next.js

### 3. Configurer les variables d'environnement

Dans les paramètres du projet, ajoutez ces variables :

```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SMTP_API_KEY=votre_cle_smtp (si nécessaire)
```

### 4. Configurer le build

Vercel détecte automatiquement Next.js, mais vous pouvez vérifier :
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (ou laisser vide pour auto-détection)
- **Output Directory**: `.next` (auto-détecté)
- **Install Command**: `npm install --legacy-peer-deps` (si nécessaire)

### 5. Déployer

1. Cliquez sur "Deploy"
2. Attendez la fin du build (2-3 minutes)
3. Votre site sera disponible sur `retrouvafrik.vercel.app`

## Avantages de Vercel

### Performance
- ✅ CDN global automatique
- ✅ Edge Functions pour les API routes
- ✅ Optimisations Next.js automatiques

### Développement
- ✅ Preview deployments pour chaque PR
- ✅ Analytics intégrés
- ✅ Logs en temps réel

### Coûts
- ✅ Plan gratuit : 100 GB bandwidth/mois
- ✅ Domaine personnalisé gratuit
- ✅ SSL automatique

## Nettoyage après migration

Une fois sur Vercel, vous pouvez supprimer :

```bash
# Fichiers Cloudflare spécifiques (optionnel)
rm wrangler.toml
rm .wranglerignore
rm cloudflare.json
rm scripts/clean-build.js

# Dépendance Cloudflare (optionnel)
npm uninstall @cloudflare/next-on-pages
```

## Support

- Documentation Vercel : https://vercel.com/docs
- Support Next.js : https://nextjs.org/docs
- Discord Vercel : https://vercel.com/discord

## Conclusion

Vercel est la solution recommandée pour Next.js. La migration prend moins de 10 minutes et résout tous les problèmes de compatibilité avec Cloudflare Pages.

