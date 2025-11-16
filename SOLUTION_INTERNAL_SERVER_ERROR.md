# 🔧 Solution pour "Internal Server Error"

## Problème

Le site affiche "Internal Server Error" après le déploiement sur Cloudflare Pages.

## Cause Probable

Le problème vient probablement de `cookies()` de `next/headers` qui ne fonctionne pas correctement dans Edge Runtime avec Cloudflare Pages.

## Solution Appliquée

J'ai modifié `lib/supabase/server.ts` pour être compatible avec Edge Runtime :

1. **Utilisation directe de `createClient`** au lieu de `createServerComponentClient`
2. **Gestion des erreurs** si `cookies()` n'est pas disponible
3. **Fallback** pour Edge Runtime qui crée un client sans cookies (les cookies seront gérés côté client)

## Vérifications Nécessaires

### 1. Vérifier les Variables d'Environnement

Assurez-vous que ces variables sont configurées dans Cloudflare Pages :

1. Allez dans **Cloudflare Pages** > **Settings** > **Environment Variables**
2. Vérifiez que ces variables sont définies :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
   ```

### 2. Vérifier les Logs Cloudflare Pages

Pour voir l'erreur exacte :

1. Allez sur [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Sélectionnez votre projet **retrouvafrik**
3. Allez dans **Deployments**
4. Cliquez sur le dernier déploiement
5. Allez dans **Functions Logs** ou **Runtime Logs**
6. Cherchez l'erreur exacte

### 3. Vérifier que nodejs_compat est Activé

Assurez-vous que le flag `nodejs_compat` est activé :

1. Allez dans **Settings** > **Functions** > **Compatibility Flags**
2. Vérifiez que `nodejs_compat` est activé pour **Production** et **Preview**

## Prochaines Étapes

1. **Les modifications ont été poussées** sur GitHub
2. **Cloudflare Pages va redéployer automatiquement**
3. **Attendez la fin du build** (5-10 minutes)
4. **Testez le site** : `https://retrouvafrik.pages.dev`

## Si l'Erreur Persiste

Si l'erreur persiste après le redéploiement :

1. **Consultez les logs Cloudflare Pages** pour voir l'erreur exacte
2. **Vérifiez les variables d'environnement** sont correctes
3. **Testez la page d'accueil** (`/`) pour voir si c'est spécifique à certaines pages
4. **Partagez les logs** pour identifier le problème exact

## Note

La modification de `lib/supabase/server.ts` devrait résoudre la plupart des problèmes liés à Edge Runtime, mais si l'erreur persiste, les logs Cloudflare Pages nous donneront plus d'informations sur la cause exacte.

