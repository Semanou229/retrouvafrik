# ⚙️ Configuration Cloudflare Pages Dashboard

## 🔴 PROBLÈME ACTUEL

Cloudflare Pages utilise automatiquement `npm clean-install` (qui n'existe pas) au lieu de `npm ci` ou `npm install`.

## ✅ SOLUTION : Configurer la commande de build dans le Dashboard

### Étapes à suivre :

1. **Connectez-vous à Cloudflare Dashboard**
   - https://dash.cloudflare.com/

2. **Allez dans Workers & Pages > votre projet RetrouvAfrik**

3. **Cliquez sur "Settings" > "Builds & deployments"**

4. **Dans la section "Build configuration"**, modifiez :

   **Build command** :
   ```
   npm ci --legacy-peer-deps || npm install --legacy-peer-deps && npm run build
   ```
   
   Ou plus simple :
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

5. **Dans "Environment variables"**, ajoutez :

   ```
   NODE_VERSION = 18
   ```

   Et toutes vos variables Supabase :
   ```
   NEXT_PUBLIC_SUPABASE_URL = votre_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = votre_clé
   NEXT_PUBLIC_SITE_URL = https://retrouvafrik.pages.dev
   ```

6. **Framework preset** :
   - Sélectionnez `Next.js` (devrait être détecté automatiquement)

7. **Sauvegardez** et **relancez le déploiement**

## 🔧 Alternative : Utiliser le système de build v1

Si le problème persiste avec le système de build v2 :

1. Dans **Settings > Builds & deployments**
2. Désactivez **"Use Cloudflare Build v2"**
3. Utilisez le système de build v1 (plus stable)

## 📋 Vérification

Après avoir configuré :

1. **Vérifiez que la commande de build est correcte** dans les settings
2. **Relancez un déploiement** manuellement
3. **Consultez les logs de build** pour voir si l'erreur persiste

## 🎯 Commandes de build testées

Ces commandes fonctionnent localement :

```bash
# Option 1 (recommandée)
npm ci --legacy-peer-deps && npm run build

# Option 2 (fallback)
npm install --legacy-peer-deps && npm run build

# Option 3 (si package-lock.json pose problème)
rm -rf node_modules package-lock.json && npm install --legacy-peer-deps && npm run build
```

## ⚠️ Note importante

Le fichier `cloudflare-pages.json` n'est **pas automatiquement utilisé** par Cloudflare Pages. Vous devez **configurer manuellement** la commande de build dans le dashboard Cloudflare.

Les fichiers de configuration (`wrangler.toml`, `cloudflare-pages.json`) sont utiles pour référence, mais la configuration réelle se fait dans le dashboard.

