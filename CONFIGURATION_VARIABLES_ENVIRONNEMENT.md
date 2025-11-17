# 🔧 Configuration des Variables d'Environnement pour les Notifications Email

## 📋 Variables à configurer dans Vercel

### 1. Accéder aux Variables d'Environnement dans Vercel

1. Allez sur https://vercel.com
2. Connectez-vous à votre compte
3. Sélectionnez votre projet **retrouvafrik**
4. Cliquez sur **Settings** (Paramètres)
5. Cliquez sur **Environment Variables** (Variables d'environnement) dans le menu de gauche

### 2. Variables à ajouter

Ajoutez les variables suivantes **une par une** :

#### Variable 1 : `SMTP_API_KEY`
- **Nom** : `SMTP_API_KEY`
- **Valeur** : `votre_cle_secrete_aleatoire` (générez une clé aléatoire, ex: `sk_live_abc123xyz789`)
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development
- **Description** : Clé secrète pour sécuriser l'API d'envoi d'emails

**Générer une clé aléatoire :**
```bash
# Sur Linux/Mac
openssl rand -hex 32

# Ou utilisez un générateur en ligne : https://randomkeygen.com/
```

#### Variable 2 : `SMTP_API_ENDPOINT`
- **Nom** : `SMTP_API_ENDPOINT`
- **Valeur** : `/api/smtp/send`
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development
- **Description** : Endpoint de l'API SMTP

#### Variable 3 : `SMTP_FROM`
- **Nom** : `SMTP_FROM`
- **Valeur** : `hello@retrouvafrik.com`
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development
- **Description** : Email expéditeur

#### Variable 4 : `SMTP_FROM_NAME`
- **Nom** : `SMTP_FROM_NAME`
- **Valeur** : `RetrouvAfrik`
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development
- **Description** : Nom de l'expéditeur

#### Variable 5 : `NEXT_PUBLIC_SITE_URL`
- **Nom** : `NEXT_PUBLIC_SITE_URL`
- **Valeur** : `https://retrouvafrik.vercel.app` (ou votre domaine si vous en avez un)
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development
- **Description** : URL du site pour les liens dans les emails

#### Variable 6 : `SMTP_HOST`
- **Nom** : `SMTP_HOST`
- **Valeur** : `mail.retrouvafrik.com`
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development
- **Description** : Serveur SMTP

#### Variable 7 : `SMTP_PORT`
- **Nom** : `SMTP_PORT`
- **Valeur** : `587` (ou `465` pour SSL)
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development
- **Description** : Port SMTP (587 pour STARTTLS, 465 pour SSL)

#### Variable 8 : `SMTP_USER`
- **Nom** : `SMTP_USER`
- **Valeur** : `hello@retrouvafrik.com`
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development
- **Description** : Nom d'utilisateur SMTP (généralement l'email)

#### Variable 9 : `SMTP_PASSWORD`
- **Nom** : `SMTP_PASSWORD`
- **Valeur** : `Jesuislebossdugame@229`
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development
- **Description** : Mot de passe SMTP

#### Variable 10 : `SMTP_SECURE`
- **Nom** : `SMTP_SECURE`
- **Valeur** : `false` (si port 587) ou `true` (si port 465)
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development
- **Description** : Utiliser SSL/TLS (true pour port 465, false pour port 587)

## 📝 Résumé des valeurs à configurer

| Variable | Valeur |
|----------|--------|
| `SMTP_API_KEY` | `votre_cle_secrete_aleatoire` (générez-en une) |
| `SMTP_API_ENDPOINT` | `/api/smtp/send` |
| `SMTP_FROM` | `hello@retrouvafrik.com` |
| `SMTP_FROM_NAME` | `RetrouvAfrik` |
| `NEXT_PUBLIC_SITE_URL` | `https://retrouvafrik.vercel.app` |
| `SMTP_HOST` | `mail.retrouvafrik.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `hello@retrouvafrik.com` |
| `SMTP_PASSWORD` | `Jesuislebossdugame@229` |
| `SMTP_SECURE` | `false` |

## ⚠️ Important

1. **Après avoir ajouté les variables**, vous devez **redéployer** votre application :
   - Allez dans **Deployments**
   - Cliquez sur les **3 points** du dernier déploiement
   - Cliquez sur **Redeploy**

2. **Sécurité** : Ne partagez jamais vos variables d'environnement publiquement

3. **Test** : Après le redéploiement, testez en créant une annonce et vérifiez les logs Vercel

## 🔍 Vérification

Après configuration et redéploiement, vérifiez les logs Vercel :
- Allez dans **Deployments** → **Dernier déploiement** → **Functions** → **Logs**
- Créez une annonce de test
- Cherchez les logs `📧 [sendEmail]` pour voir si les emails sont envoyés

## 🆘 En cas de problème

Si les emails ne sont toujours pas envoyés :
1. Vérifiez que toutes les variables sont bien configurées
2. Vérifiez les logs Vercel pour les erreurs
3. Vérifiez que le port SMTP est correct (587 ou 465)
4. Vérifiez que `SMTP_SECURE` correspond au port utilisé

