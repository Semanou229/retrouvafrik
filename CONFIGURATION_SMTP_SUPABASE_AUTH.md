# 📧 Configuration SMTP Personnalisé pour l'Authentification Supabase

## 🎯 Objectif

Configurer votre serveur SMTP professionnel dans Supabase pour remplacer le service d'envoi d'emails par défaut et éviter l'erreur "email rate limit exceeded".

## ⚠️ Problème Actuel

L'erreur **"email rate limit exceeded"** apparaît lors de la création de compte car Supabase a atteint sa limite d'envoi d'emails gratuits. En configurant votre SMTP professionnel, vous contournez cette limite.

## 📋 Étapes de Configuration

### 1. Accéder aux Paramètres SMTP de Supabase

1. Connectez-vous à votre [Dashboard Supabase](https://app.supabase.com/)
2. Sélectionnez votre projet **retrouvafrik**
3. Allez dans **Settings** (Paramètres) dans le menu latéral
4. Cliquez sur **Auth** dans le menu des paramètres
5. Faites défiler jusqu'à la section **SMTP Settings** (Paramètres SMTP)

### 2. Activer le SMTP Personnalisé

1. Activez le toggle **"Enable Custom SMTP"** (Activer SMTP personnalisé)
2. Remplissez les champs suivants avec les informations de votre serveur SMTP professionnel :

### 3. Informations SMTP à Remplir

#### Pour un serveur SMTP professionnel standard :

```
Sender name: RetrouvAfrik
Sender email: noreply@votre-domaine.com (ou votre email professionnel)
Host: smtp.votre-domaine.com (ex: smtp.mailpro.fr, smtp.ovh.net)
Port: 587 (ou 465 pour SSL)
Username: votre-email@votre-domaine.com
Password: votre-mot-de-passe-smtp
```

#### Exemples selon votre fournisseur :

**OVH / Mailpro :**
```
Host: ssl0.ovh.net ou smtp.mailpro.fr
Port: 587
Username: votre-email@votre-domaine.com
Password: votre-mot-de-passe
```

**Gmail / Google Workspace :**
```
Host: smtp.gmail.com
Port: 587
Username: votre-email@gmail.com
Password: mot-de-passe-d-application (généré dans les paramètres Google)
```

**Outlook / Office 365 :**
```
Host: smtp.office365.com
Port: 587
Username: votre-email@outlook.com
Password: votre-mot-de-passe
```

**Autres hébergeurs (ex: Hostinger, Namecheap, etc.) :**
```
Host: smtp.votre-hebergeur.com (consultez la documentation de votre hébergeur)
Port: 587 (ou 465)
Username: votre-email@votre-domaine.com
Password: votre-mot-de-passe
```

### 4. Paramètres de Sécurité

- **Port 587** : Utilisez STARTTLS (recommandé)
- **Port 465** : Utilisez SSL/TLS
- Cochez **"Enable secure email"** si vous utilisez le port 465

### 5. Tester la Configuration

1. Cliquez sur **"Send test email"** (Envoyer un email de test)
2. Entrez votre adresse email
3. Vérifiez que vous recevez l'email de test
4. Si l'email arrive, la configuration est correcte ✅

### 6. Sauvegarder

1. Cliquez sur **"Save"** (Enregistrer) en bas de la page
2. Attendez quelques secondes pour que les changements soient appliqués

## 🔍 Informations SMTP à Obtenir

### Si vous ne connaissez pas vos paramètres SMTP :

1. **Contactez votre hébergeur** ou consultez la documentation de votre fournisseur d'email
2. **Vérifiez votre panneau d'administration** (cPanel, Plesk, etc.)
3. **Consultez la documentation** de votre fournisseur :
   - OVH : https://docs.ovh.com/fr/emails/
   - Mailpro : https://www.mailpro.com/aide/
   - Gmail : https://support.google.com/mail/answer/7126229

### Paramètres courants :

| Fournisseur | Host | Port | Sécurité |
|------------|------|------|----------|
| OVH | ssl0.ovh.net | 587 | STARTTLS |
| Mailpro | smtp.mailpro.fr | 587 | STARTTLS |
| Gmail | smtp.gmail.com | 587 | STARTTLS |
| Outlook | smtp.office365.com | 587 | STARTTLS |
| Hostinger | smtp.hostinger.com | 587 | STARTTLS |

## ✅ Vérification

Après la configuration :

1. **Testez la création d'un compte** sur votre site
2. Vérifiez que l'email de confirmation arrive bien
3. Vérifiez aussi les **spams** au cas où

## 🚨 Dépannage

### Erreur "Authentication failed"

- Vérifiez que le **username** et le **password** sont corrects
- Assurez-vous que le compte email n'a pas de **double authentification** activée
- Pour Gmail, utilisez un **mot de passe d'application** au lieu du mot de passe normal

### Erreur "Connection timeout"

- Vérifiez que le **host** et le **port** sont corrects
- Vérifiez que votre **firewall** n'bloque pas le port SMTP
- Essayez le port **465** au lieu de **587** (ou vice versa)

### Les emails arrivent dans les spams

- Configurez **SPF**, **DKIM** et **DMARC** pour votre domaine
- Utilisez un **nom d'expéditeur cohérent** (ex: RetrouvAfrik)
- Évitez les mots-clés spam dans les sujets

### Erreur "Rate limit exceeded" persiste

- Attendez quelques minutes après la configuration
- Vérifiez que le SMTP personnalisé est bien **activé** dans Supabase
- Redémarrez votre application si nécessaire

## 📝 Notes Importantes

- ⚠️ **Ne partagez jamais** vos identifiants SMTP publiquement
- ✅ Les emails d'authentification (création de compte, réinitialisation) utiliseront maintenant votre SMTP
- ✅ Les notifications d'annonces continueront d'utiliser l'API SMTP configurée dans Next.js (voir `SMTP_SETUP.md`)
- 🔒 Assurez-vous que votre serveur SMTP est sécurisé et fiable

## 🎉 Résultat Attendu

Une fois configuré, vous devriez pouvoir :
- ✅ Créer des comptes sans erreur "rate limit exceeded"
- ✅ Recevoir les emails de confirmation
- ✅ Recevoir les emails de réinitialisation de mot de passe
- ✅ Avoir un contrôle total sur l'envoi d'emails d'authentification

