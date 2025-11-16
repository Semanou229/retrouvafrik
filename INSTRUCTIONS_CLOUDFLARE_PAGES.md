# 🔧 Instructions pour Configurer Cloudflare Pages - RetrouvAfrik

## ⚠️ IMPORTANT : Configuration Requise

Pour que le site fonctionne sur Cloudflare Pages, vous **DEVEZ** configurer la commande de build dans le dashboard Cloudflare Pages.

## 📋 Étapes de Configuration

### 1. Accéder aux Paramètres de Build

1. Allez sur [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Sélectionnez votre projet **retrouvafrik**
3. Allez dans **Settings** > **Builds & deployments**

### 2. Configurer la Commande de Build

Dans la section **Build configuration**, modifiez la **Build command** :

**Commande actuelle (incorrecte) :**
```
npm ci --legacy-peer-deps || npm install --legacy-peer-deps && npm run build:cloudflare
```

**Commande à utiliser (correcte) :**
```
npm ci --legacy-peer-deps || npm install --legacy-peer-deps && npm run build:cloudflare && npm run pages:build
```

⚠️ **IMPORTANT** : La partie `&& npm run pages:build` est **OBLIGATOIRE**. Elle génère les fichiers dans `.vercel/output/static` nécessaires pour Cloudflare Pages.

### 3. Configurer le Répertoire de Sortie

Dans la même section, configurez le **Build output directory** :

```
.vercel/output/static
```

### 4. Framework Preset

Si disponible, sélectionnez **Next.js** comme **Framework preset**.

### 5. Sauvegarder et Redéployer

1. Cliquez sur **Save**
2. Cloudflare Pages va automatiquement redéployer avec la nouvelle configuration
3. Attendez que le build se termine (cela peut prendre 5-10 minutes)

## ✅ Vérification

Après le déploiement, vous devriez voir dans les logs :

```
✓ Built Next.js app for Cloudflare Pages
✓ Output directory: .vercel/output/static
```

Et le site devrait être accessible sur `https://retrouvafrik.pages.dev`.

## 🔍 Dépannage

### Erreur : "Output directory .vercel/output/static not found"

**Cause** : La commande de build n'inclut pas `npm run pages:build`

**Solution** : Vérifiez que la commande de build inclut bien `&& npm run pages:build` à la fin.

### Erreur 404 après déploiement

**Cause** : Le répertoire de sortie n'est pas correctement configuré

**Solution** : Vérifiez que le **Build output directory** est bien `.vercel/output/static`

### Le build échoue avec des erreurs Supabase

**Cause** : Les variables d'environnement ne sont pas configurées

**Solution** : Voir `CLOUDFLARE_ENV_VARIABLES.md` pour configurer les variables d'environnement.

## 📝 Résumé de la Configuration

| Paramètre | Valeur |
|-----------|--------|
| **Build command** | `npm ci --legacy-peer-deps \|\| npm install --legacy-peer-deps && npm run build:cloudflare && npm run pages:build` |
| **Build output directory** | `.vercel/output/static` |
| **Framework preset** | `Next.js` (si disponible) |
| **Node version** | `18` (automatique) |

## 🚀 Après Configuration

Une fois la configuration mise à jour :
1. Cloudflare Pages va automatiquement redéployer
2. Le build devrait prendre 5-10 minutes
3. Le site sera accessible sur `https://retrouvafrik.pages.dev`

