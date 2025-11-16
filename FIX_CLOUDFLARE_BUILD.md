# 🔧 Correction de l'erreur de build Cloudflare Pages

## Problème identifié

L'erreur `npm error code EUSAGE` lors du build sur Cloudflare Pages peut être causée par :

1. **Problème avec `nodemailer`** : Cette dépendance nécessite des modules natifs qui peuvent ne pas être compatibles avec Cloudflare Pages
2. **Problème avec `package-lock.json`** : Le fichier contenait encore "trouvita" au lieu de "retrouvafrik"
3. **Configuration Cloudflare** : Le fichier `wrangler.toml` peut ne pas être détecté correctement

## Solutions appliquées

### 1. Correction du package-lock.json ✅

Le nom du projet a été mis à jour de "trouvita" à "retrouvafrik".

### 2. Création du fichier .npmrc ✅

Un fichier `.npmrc` a été créé pour gérer les dépendances :
```
legacy-peer-deps=true
engine-strict=false
```

### 3. Configuration Cloudflare Pages

Dans le dashboard Cloudflare Pages, vérifiez :

**Build settings:**
- **Framework preset**: `Next.js`
- **Build command**: `npm install && npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (vide)
- **Node version**: `18` ou `20`

**Alternative si le build échoue toujours:**

Essayez cette commande de build :
```bash
npm ci --legacy-peer-deps && npm run build
```

## Solution alternative : Remplacer nodemailer

Si `nodemailer` continue à causer des problèmes, vous pouvez utiliser une alternative compatible avec Cloudflare :

### Option 1 : Utiliser uniquement les Edge Functions Supabase

Les Edge Functions Supabase peuvent envoyer des emails sans dépendances natives.

### Option 2 : Utiliser un service d'email HTTP

Utiliser un service comme Resend, SendGrid, ou Mailgun qui fonctionne via HTTP.

### Option 3 : Rendre nodemailer optionnel

Modifier le code pour que nodemailer ne soit chargé que si disponible :

```typescript
// Dans app/api/smtp/send/route.ts
let nodemailer: any;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  // nodemailer non disponible, utiliser une alternative
}
```

## Vérification

1. Vérifiez que tous les fichiers sont commités :
   ```bash
   git add .
   git commit -m "Fix: Configuration Cloudflare Pages"
   git push
   ```

2. Relancez le déploiement sur Cloudflare Pages

3. Vérifiez les logs de build dans Cloudflare Dashboard

## Si le problème persiste

1. **Vérifier les logs complets** dans Cloudflare Dashboard > Deployments > [votre déploiement] > Build logs

2. **Tester le build localement** :
   ```bash
   npm ci --legacy-peer-deps
   npm run build
   ```

3. **Vérifier les variables d'environnement** dans Cloudflare Dashboard

4. **Contacter le support Cloudflare** si nécessaire

