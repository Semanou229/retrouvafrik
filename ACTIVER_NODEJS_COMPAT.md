# 🔧 Activer le Flag nodejs_compat sur Cloudflare Pages

## ⚠️ Erreur Rencontrée

```
Node.JS Compatibility Error
no nodejs_compat compatibility flag set
```

## ✅ Solution

Vous devez activer le flag de compatibilité `nodejs_compat` dans votre projet Cloudflare Pages.

## 📋 Étapes Détaillées

### 1. Accéder aux Paramètres de Compatibilité

1. Allez sur [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Sélectionnez votre projet **retrouvafrik** (ou le nom de votre projet)
3. Allez dans **Settings** > **Functions** (ou **Compatibility Flags**)

### 2. Activer le Flag nodejs_compat

1. Dans la section **Compatibility Flags** ou **Functions** :
   - Cherchez **"Compatibility Flags"** ou **"Node.js Compatibility"**
   - Vous devriez voir une liste de flags disponibles

2. **Ajoutez le flag `nodejs_compat`** :
   - Cliquez sur **"Add compatibility flag"** ou **"Edit compatibility flags"**
   - Sélectionnez ou ajoutez : `nodejs_compat`
   - Assurez-vous qu'il est activé pour :
     - ✅ **Production**
     - ✅ **Preview** (recommandé)

3. **Sauvegardez** les modifications

### 3. Alternative : Via wrangler.toml

Si vous préférez configurer via le fichier `wrangler.toml`, ajoutez :

```toml
[compatibility_flags]
nodejs_compat = true
```

Puis poussez les modifications sur GitHub. Cloudflare Pages détectera automatiquement le changement.

## 🔍 Où Trouver les Paramètres

Les paramètres peuvent être trouvés dans différentes sections selon votre version de Cloudflare Pages :

### Option A : Settings > Functions
- Allez dans **Settings** > **Functions**
- Cherchez **"Compatibility Flags"** ou **"Node.js Compatibility"**

### Option B : Settings > Builds & deployments
- Allez dans **Settings** > **Builds & deployments**
- Cherchez **"Compatibility Flags"** dans les options avancées

### Option C : Functions > Compatibility Flags
- Allez directement dans **Functions** > **Compatibility Flags**

## ✅ Vérification

Après avoir activé le flag :

1. **Redéployez** votre projet (Cloudflare Pages devrait redéployer automatiquement)
2. Attendez que le build se termine
3. Visitez votre site : `https://retrouvafrik.pages.dev`
4. L'erreur devrait disparaître

## 📝 Note

Le flag `nodejs_compat` est nécessaire car :
- Next.js avec `@cloudflare/next-on-pages` nécessite certaines APIs Node.js
- Certaines dépendances peuvent nécessiter la compatibilité Node.js
- L'Edge Runtime de Cloudflare bénéficie de cette compatibilité pour certaines fonctionnalités

## 🆘 Si Vous Ne Trouvez Pas l'Option

Si vous ne trouvez pas l'option "Compatibility Flags" :

1. Vérifiez que vous êtes sur la **version récente** de Cloudflare Pages
2. Essayez de chercher **"Node.js Compatibility"** dans les paramètres
3. Contactez le support Cloudflare si nécessaire
4. Utilisez l'alternative `wrangler.toml` ci-dessus

## 🚀 Après Activation

Une fois le flag activé et le projet redéployé, votre site devrait fonctionner correctement avec Next.js et toutes les fonctionnalités devraient être disponibles.

