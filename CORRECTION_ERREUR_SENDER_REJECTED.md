# 🔧 Correction de l'Erreur "550 sender rejected"

## 🎯 Problème Identifié

L'erreur dans les logs Supabase montre :
```
gomail: could not send email 1: 550 5.1.0 <hello@retrouvafrik.com> sender rejected
```

**Cela signifie que le serveur SMTP rejette l'email sender `hello@retrouvafrik.com`.**

## ✅ Solution

### Étape 1 : Vérifier l'Email Sender dans Supabase

1. Allez dans **Supabase Dashboard** → **Settings** → **Auth** → **SMTP Settings**
2. Vérifiez le champ **"Sender email"**
3. **Le problème** : L'email `hello@retrouvafrik.com` n'est probablement pas valide dans votre système SMTP

### Étape 2 : Corriger l'Email Sender

**Option A : Utiliser un email qui existe dans votre système SMTP**

1. Dans **SMTP Settings**, changez **"Sender email"** pour utiliser un email qui existe réellement dans votre système SMTP
2. Par exemple :
   - `noreply@votre-domaine.com` (si vous avez configuré ce domaine)
   - `votre-email@votre-domaine.com` (votre email professionnel)
   - `contact@votre-domaine.com` (si cet email existe)

**Option B : Créer l'email dans votre système SMTP**

Si vous voulez utiliser `hello@retrouvafrik.com` ou `noreply@retrouvafrik.com` :

1. **Créez cet email** dans votre panneau d'administration (cPanel, Plesk, OVH, etc.)
2. **Ou utilisez un alias** qui redirige vers votre email principal
3. **Vérifiez que l'email existe** avant de l'utiliser dans Supabase

### Étape 3 : Vérifier la Configuration SMTP

Assurez-vous que :

1. **Username SMTP** correspond à un email valide dans votre système
2. **Sender email** correspond à un email qui existe OU qui est autorisé dans votre système SMTP
3. **Le domaine** (`retrouvafrik.com`) est bien configuré dans votre système SMTP

### Étape 4 : Tester la Configuration

1. Dans **SMTP Settings**, cliquez sur **"Send test email"**
2. Entrez votre email
3. Vérifiez que vous recevez l'email
4. Si ça fonctionne, l'inscription devrait maintenant fonctionner

## 🔍 Vérifications Supplémentaires

### Vérifier que le Domaine est Configuré

Si vous utilisez `@retrouvafrik.com` :

1. **Vérifiez que le domaine `retrouvafrik.com` est configuré** dans votre système SMTP
2. **Vérifiez les enregistrements DNS** (MX, SPF, DKIM, DMARC)
3. **Créez l'email** `hello@retrouvafrik.com` ou `noreply@retrouvafrik.com` dans votre panneau d'administration

### Utiliser un Email Existant

**Solution la plus simple** : Utilisez un email qui existe déjà dans votre système SMTP :

1. Si vous avez configuré votre SMTP avec `votre-email@votre-domaine.com`
2. Utilisez ce même email comme **Sender email** dans Supabase
3. Ou créez un alias `noreply@votre-domaine.com` qui redirige vers votre email

## 📋 Configuration Recommandée

### Pour OVH / Mailpro :

```
Sender name: RetrouvAfrik
Sender email: noreply@votre-domaine.com (ou votre-email@votre-domaine.com)
Host: ssl0.ovh.net ou smtp.mailpro.fr
Port: 587
Username: votre-email@votre-domaine.com
Password: votre-mot-de-passe-smtp
```

**Important** : L'email dans **"Sender email"** doit exister dans votre système OVH/Mailpro ou être un alias valide.

### Pour Gmail :

```
Sender name: RetrouvAfrik
Sender email: votre-email@gmail.com (doit être le même que Username)
Host: smtp.gmail.com
Port: 587
Username: votre-email@gmail.com
Password: mot-de-passe-d-application
```

## ✅ Checklist de Vérification

- [ ] L'email dans **"Sender email"** existe dans votre système SMTP
- [ ] Le **Username SMTP** correspond à un email valide
- [ ] Le domaine est configuré dans votre système SMTP
- [ ] Le test email fonctionne dans Supabase
- [ ] L'inscription fonctionne maintenant

## 🚨 Erreurs Fréquentes

### Erreur : "550 sender rejected"
**Cause** : L'email sender n'existe pas dans votre système SMTP
**Solution** : Utilisez un email qui existe ou créez-le dans votre système SMTP

### Erreur : "550 5.1.0 sender rejected"
**Cause** : Le domaine n'est pas configuré ou l'email n'existe pas
**Solution** : Vérifiez que le domaine est configuré et que l'email existe

## 📞 Support

Si le problème persiste :
1. Vérifiez avec votre hébergeur que l'email existe
2. Vérifiez les enregistrements DNS pour le domaine
3. Contactez le support de votre fournisseur SMTP

