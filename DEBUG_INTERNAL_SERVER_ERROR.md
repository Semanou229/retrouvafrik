# 🔍 Débogage de l'Erreur "Internal Server Error"

## Problème

Le site affiche "Internal Server Error" après le déploiement sur Cloudflare Pages.

## Causes Possibles

### 1. Variables d'Environnement Manquantes

Les variables d'environnement Supabase doivent être configurées dans Cloudflare Pages.

**Vérification :**
1. Allez dans Cloudflare Pages > Settings > Environment Variables
2. Vérifiez que ces variables sont définies :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Erreur dans le Code Edge Runtime

Certaines APIs Node.js ne sont pas disponibles dans Edge Runtime.

**Vérification :**
- Consultez les logs Cloudflare Pages pour voir l'erreur exacte
- Allez dans Cloudflare Pages > Deployments > [Dernier déploiement] > Functions Logs

### 3. Problème avec Supabase Client dans Edge Runtime

Le client Supabase peut avoir des problèmes avec Edge Runtime.

**Solution :**
- Vérifiez que `createServerSupabaseClient` utilise des APIs compatibles Edge Runtime
- Utilisez `@supabase/ssr` au lieu de `@supabase/auth-helpers-nextjs` si nécessaire

### 4. Erreur dans une Route API

Une route API peut causer l'erreur.

**Vérification :**
- Testez chaque route API individuellement
- Vérifiez les logs pour identifier la route problématique

## 🔧 Solutions

### Solution 1 : Vérifier les Logs Cloudflare Pages

1. Allez sur [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Sélectionnez votre projet **retrouvafrik**
3. Allez dans **Deployments**
4. Cliquez sur le dernier déploiement
5. Allez dans **Functions Logs** ou **Runtime Logs**
6. Cherchez l'erreur exacte dans les logs

### Solution 2 : Vérifier les Variables d'Environnement

Assurez-vous que toutes les variables nécessaires sont configurées :

**Variables Requises :**
```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
```

**Variables Optionnelles (pour emails) :**
```
RESEND_API_KEY=votre_clé_resend (si vous utilisez Resend)
SMTP_API_KEY=votre_clé_api_smtp
```

### Solution 3 : Tester les Routes Individuellement

Testez chaque route pour identifier celle qui cause l'erreur :

1. `/` (page d'accueil)
2. `/annonces`
3. `/api/notifications/send`
4. `/api/smtp/send`

### Solution 4 : Vérifier la Compatibilité Edge Runtime

Certaines fonctionnalités peuvent ne pas fonctionner dans Edge Runtime :

- `fs` (système de fichiers)
- `path` (chemins de fichiers)
- `crypto` (certaines fonctions)
- `stream` (certaines fonctions)

**Solution :** Utilisez uniquement des APIs Web Standards dans Edge Runtime.

## 📋 Checklist de Débogage

- [ ] Vérifier les logs Cloudflare Pages
- [ ] Vérifier les variables d'environnement
- [ ] Tester la page d'accueil (`/`)
- [ ] Tester les routes API
- [ ] Vérifier que `nodejs_compat` est activé
- [ ] Vérifier la compatibilité Edge Runtime du code

## 🆘 Si l'Erreur Persiste

1. **Partagez les logs Cloudflare Pages** pour identifier l'erreur exacte
2. **Vérifiez la console du navigateur** (F12) pour d'autres erreurs
3. **Testez en local** avec `npm run dev` pour voir si l'erreur se reproduit

## 📝 Note

L'erreur "Internal Server Error" est générique. Les logs Cloudflare Pages contiendront l'erreur exacte qui causera le problème.

