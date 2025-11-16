# 🔧 Instructions pour corriger l'erreur de build Cloudflare Pages

## Problème

Erreur `npm error code EUSAGE` lors du build sur Cloudflare Pages.

## Solutions à appliquer dans Cloudflare Dashboard

### Solution 1 : Modifier la commande de build (RECOMMANDÉ)

Dans **Cloudflare Dashboard > Workers & Pages > votre projet > Settings > Builds & deployments** :

1. **Modifiez la commande de build** :
   ```
   npm install --legacy-peer-deps && npm run build
   ```
   
   Ou si cela ne fonctionne pas :
   ```
   npm ci --legacy-peer-deps && npm run build
   ```

2. **Vérifiez la version de Node.js** :
   - Dans **Environment Variables**, ajoutez :
   ```
   NODE_VERSION = 18
   ```
   Ou utilisez `.nvmrc` (déjà créé dans le projet)

### Solution 2 : Utiliser le système de build v1

Si vous utilisez le système de build v2 :

1. Allez dans **Settings > Builds & deployments**
2. Désactivez **"Use Cloudflare Build v2"** (utilisez v1)
3. Relancez le déploiement

### Solution 3 : Vérifier les variables d'environnement

Assurez-vous que toutes les variables d'environnement sont définies :

**Obligatoires :**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Solution 4 : Si nodemailer cause des problèmes

Si l'erreur persiste à cause de `nodemailer` :

1. **Option A** : Rendre nodemailer optionnel (modification du code)
2. **Option B** : Utiliser uniquement les Edge Functions Supabase pour les emails
3. **Option C** : Utiliser un service d'email HTTP (Resend, SendGrid)

## Configuration recommandée Cloudflare Pages

**Build settings:**
- **Framework preset**: `Next.js`
- **Build command**: `npm install --legacy-peer-deps && npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (vide)
- **Node version**: `18` (via `.nvmrc` ou variable d'environnement)

**Environment variables:**
- `NODE_VERSION` = `18`
- Toutes les variables Supabase et SMTP

## Fichiers créés pour corriger le problème

✅ `.npmrc` - Configuration npm avec `legacy-peer-deps`
✅ `.nvmrc` - Version Node.js 18
✅ `wrangler.toml` - Configuration Cloudflare
✅ `cloudflare.json` - Configuration Pages
✅ `public/_headers` - Headers de sécurité
✅ `public/_redirects` - Redirections

## Prochaines étapes

1. **Mettre à jour la commande de build** dans Cloudflare Dashboard
2. **Ajouter la variable NODE_VERSION** si nécessaire
3. **Relancer le déploiement**
4. **Vérifier les logs** si l'erreur persiste

## Vérification

Après avoir appliqué ces corrections, le build devrait réussir. Si l'erreur persiste :

1. Consultez les logs complets dans Cloudflare Dashboard
2. Vérifiez que tous les fichiers sont bien commités sur GitHub
3. Testez le build localement : `npm install --legacy-peer-deps && npm run build`

