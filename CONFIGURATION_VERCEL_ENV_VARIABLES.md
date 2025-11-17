# 🔧 Configuration des Variables d'Environnement dans Vercel

## 📋 Guide étape par étape

### 1. Accéder aux Variables d'Environnement

1. Allez sur **https://vercel.com**
2. Connectez-vous à votre compte
3. Sélectionnez votre projet **retrouvafrik**
4. Cliquez sur **Settings** (Paramètres) dans le menu du haut
5. Cliquez sur **Environment Variables** (Variables d'environnement) dans le menu de gauche

### 2. Ajouter les Variables

Cliquez sur **Add New** (Ajouter nouveau) pour chaque variable et remplissez :

#### Variable 1 : `SMTP_API_KEY`
- **Key (Nom)** : `SMTP_API_KEY`
- **Value (Valeur)** : `sk_retrouvafrik_2024_secure_key_abc123xyz789` (générez une clé aléatoire)
- **Environments** : Cochez ✅ Production, ✅ Preview, ✅ Development
- Cliquez sur **Save**

**Pour générer une clé aléatoire :**
- Utilisez : https://randomkeygen.com/ (choisissez "CodeIgniter Encryption Keys")
- Ou créez une clé simple mais sécurisée comme : `sk_retrouvafrik_2024_$(date +%s)`

#### Variable 2 : `SMTP_API_ENDPOINT`
- **Key** : `SMTP_API_ENDPOINT`
- **Value** : `/api/smtp/send`
- **Environments** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez sur **Save**

#### Variable 3 : `SMTP_FROM`
- **Key** : `SMTP_FROM`
- **Value** : `hello@retrouvafrik.com`
- **Environments** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez sur **Save**

#### Variable 4 : `SMTP_FROM_NAME`
- **Key** : `SMTP_FROM_NAME`
- **Value** : `RetrouvAfrik`
- **Environments** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez sur **Save**

#### Variable 5 : `NEXT_PUBLIC_SITE_URL`
- **Key** : `NEXT_PUBLIC_SITE_URL`
- **Value** : `https://retrouvafrik.vercel.app` (ou votre domaine si vous en avez un)
- **Environments** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez sur **Save**

#### Variable 6 : `SMTP_HOST`
- **Key** : `SMTP_HOST`
- **Value** : `mail.retrouvafrik.com`
- **Environments** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez sur **Save**

#### Variable 7 : `SMTP_PORT`
- **Key** : `SMTP_PORT`
- **Value** : `587` (essayez d'abord 587, si ça ne marche pas essayez 465)
- **Environments** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez sur **Save**

#### Variable 8 : `SMTP_USER`
- **Key** : `SMTP_USER`
- **Value** : `hello@retrouvafrik.com`
- **Environments** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez sur **Save**

#### Variable 9 : `SMTP_PASSWORD`
- **Key** : `SMTP_PASSWORD`
- **Value** : `Jesuislebossdugame@229`
- **Environments** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez sur **Save**

#### Variable 10 : `SMTP_SECURE`
- **Key** : `SMTP_SECURE`
- **Value** : `false` (si port 587) ou `true` (si port 465)
- **Environments** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez sur **Save**

## 📝 Résumé des valeurs à configurer

| Variable | Valeur |
|----------|--------|
| `SMTP_API_KEY` | `sk_retrouvafrik_2024_secure_key_abc123xyz789` (générez-en une) |
| `SMTP_API_ENDPOINT` | `/api/smtp/send` |
| `SMTP_FROM` | `hello@retrouvafrik.com` |
| `SMTP_FROM_NAME` | `RetrouvAfrik` |
| `NEXT_PUBLIC_SITE_URL` | `https://retrouvafrik.vercel.app` |
| `SMTP_HOST` | `mail.retrouvafrik.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `hello@retrouvafrik.com` |
| `SMTP_PASSWORD` | `Jesuislebossdugame@229` |
| `SMTP_SECURE` | `false` |

## ⚠️ IMPORTANT : Redéployer après configuration

**Après avoir ajouté toutes les variables :**

1. Allez dans l'onglet **Deployments** (Déploiements)
2. Cliquez sur les **3 points** (⋯) à droite du dernier déploiement
3. Cliquez sur **Redeploy** (Redéployer)
4. Attendez que le déploiement se termine

**Sans redéploiement, les nouvelles variables ne seront pas disponibles !**

## ✅ Vérification

Après le redéploiement :
1. Créez une annonce de test
2. Allez dans **Deployments** → **Dernier déploiement** → **Functions** → **Logs**
3. Cherchez les logs `📧 [sendEmail]` pour voir si les emails sont envoyés

## 🆘 Si ça ne marche toujours pas

1. Vérifiez que toutes les variables sont bien configurées (pas de fautes de frappe)
2. Vérifiez les logs Vercel pour les erreurs exactes
3. Essayez de changer le port de `587` à `465` et `SMTP_SECURE` de `false` à `true`
4. Vérifiez que votre serveur SMTP `mail.retrouvafrik.com` accepte les connexions depuis Vercel

