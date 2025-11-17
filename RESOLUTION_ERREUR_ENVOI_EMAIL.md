# 🔧 Résolution de l'Erreur "Error sending confirmation email"

## 🎯 Problème

L'erreur **"Error sending confirmation email"** apparaît lors de la création d'un compte. Cela signifie que Supabase n'arrive pas à envoyer l'email de confirmation.

## 🔍 Causes Possibles

1. **SMTP non configuré** : Le SMTP personnalisé n'est pas activé ou mal configuré dans Supabase
2. **Identifiants SMTP incorrects** : Les informations SMTP sont erronées
3. **Port bloqué** : Le port SMTP est bloqué par un firewall
4. **Limite d'envoi atteinte** : La limite d'envoi d'emails a été atteinte
5. **Email de test invalide** : L'email utilisé pour le test n'est pas valide

## ✅ Solutions

### Solution 1 : Vérifier la Configuration SMTP dans Supabase

1. **Accédez au Dashboard Supabase**
   - Allez sur [https://app.supabase.com/](https://app.supabase.com/)
   - Sélectionnez votre projet **retrouvafrik**
   - Allez dans **Settings** → **Auth**

2. **Vérifiez la Section SMTP Settings**
   - Faites défiler jusqu'à **SMTP Settings**
   - Vérifiez que **"Enable Custom SMTP"** est activé (toggle vert)

3. **Vérifiez les Informations SMTP**
   - **Host** : Doit être correct (ex: `smtp.mailpro.fr`, `ssl0.ovh.net`)
   - **Port** : Généralement `587` (ou `465` pour SSL)
   - **Username** : Votre email complet (ex: `noreply@votre-domaine.com`)
   - **Password** : Votre mot de passe SMTP
   - **Sender email** : L'email qui enverra les emails
   - **Sender name** : `RetrouvAfrik`

4. **Testez la Configuration**
   - Cliquez sur **"Send test email"**
   - Entrez votre adresse email
   - Vérifiez que vous recevez l'email de test
   - Si l'email n'arrive pas, vérifiez les logs dans Supabase

### Solution 2 : Vérifier les Logs Supabase

1. **Accédez aux Logs**
   - Dans Supabase Dashboard → **Logs** → **Auth Logs**
   - Cherchez les erreurs récentes liées à l'envoi d'emails

2. **Erreurs Courantes dans les Logs**
   - `Authentication failed` → Identifiants SMTP incorrects
   - `Connection timeout` → Port bloqué ou host incorrect
   - `Rate limit exceeded` → Limite d'envoi atteinte

### Solution 3 : Vérifier les Paramètres du Fournisseur SMTP

#### Pour OVH / Mailpro :
```
Host: ssl0.ovh.net ou smtp.mailpro.fr
Port: 587
Username: votre-email@votre-domaine.com
Password: votre-mot-de-passe-smtp
```

#### Pour Gmail :
```
Host: smtp.gmail.com
Port: 587
Username: votre-email@gmail.com
Password: mot-de-passe-d-application (pas le mot de passe normal)
```

**Important pour Gmail** : Vous devez générer un "Mot de passe d'application" dans les paramètres de sécurité de votre compte Google.

#### Pour Outlook / Office 365 :
```
Host: smtp.office365.com
Port: 587
Username: votre-email@outlook.com
Password: votre-mot-de-passe
```

### Solution 4 : Désactiver Temporairement la Confirmation d'Email

⚠️ **Attention** : Cette solution n'est recommandée que pour le développement/test.

1. **Dans Supabase Dashboard**
   - Allez dans **Settings** → **Auth**
   - Faites défiler jusqu'à **Email Auth**
   - Désactivez **"Enable email confirmations"**

2. **Réactivez après avoir configuré le SMTP**
   - Une fois le SMTP configuré, réactivez la confirmation d'email

### Solution 5 : Vérifier les Templates d'Emails

1. **Vérifiez les Templates**
   - Dans Supabase Dashboard → **Settings** → **Auth** → **Email Templates**
   - Vérifiez que le template **"Confirm signup"** est configuré
   - Vérifiez que les variables `{{ .ConfirmationURL }}` sont présentes

## 🧪 Test de la Configuration

### Étape 1 : Test SMTP dans Supabase
1. Allez dans **Settings** → **Auth** → **SMTP Settings**
2. Cliquez sur **"Send test email"**
3. Entrez votre email
4. Vérifiez votre boîte de réception (et les spams)

### Étape 2 : Test de Création de Compte
1. Allez sur votre site
2. Cliquez sur **"Créer un compte"**
3. Remplissez le formulaire
4. Vérifiez que vous recevez l'email de confirmation

### Étape 3 : Vérifier les Logs
1. Dans Supabase Dashboard → **Logs** → **Auth Logs**
2. Vérifiez qu'il n'y a pas d'erreurs

## 📋 Checklist de Vérification

- [ ] SMTP personnalisé activé dans Supabase
- [ ] Host SMTP correct
- [ ] Port SMTP correct (587 ou 465)
- [ ] Username SMTP correct (email complet)
- [ ] Password SMTP correct
- [ ] Sender email configuré
- [ ] Sender name configuré
- [ ] Test email fonctionne
- [ ] Templates d'emails configurés
- [ ] Pas d'erreurs dans les logs Supabase
- [ ] Email de confirmation reçu lors de la création de compte

## 🚨 Erreurs Fréquentes et Solutions

### Erreur : "Authentication failed"
**Solution** : Vérifiez que le username et le password SMTP sont corrects. Pour Gmail, utilisez un mot de passe d'application.

### Erreur : "Connection timeout"
**Solution** : 
- Vérifiez que le host et le port sont corrects
- Essayez le port 465 au lieu de 587 (ou vice versa)
- Vérifiez que votre firewall n'bloque pas le port SMTP

### Erreur : "Rate limit exceeded"
**Solution** : Attendez quelques minutes avant de réessayer. Si le problème persiste, vérifiez les limites de votre fournisseur SMTP.

### Erreur : "Invalid sender email"
**Solution** : Vérifiez que l'email sender correspond au domaine configuré dans votre SMTP.

## 📞 Support

Si le problème persiste après avoir suivi ces étapes :

1. **Vérifiez les logs Supabase** pour plus de détails
2. **Contactez le support de votre fournisseur SMTP** pour vérifier la configuration
3. **Consultez la documentation Supabase** : [https://supabase.com/docs/guides/auth/auth-smtp](https://supabase.com/docs/guides/auth/auth-smtp)

## 📝 Notes Importantes

- ⚠️ **Ne partagez jamais** vos identifiants SMTP publiquement
- ✅ Les emails peuvent prendre quelques minutes à arriver
- ✅ Vérifiez toujours les **spams** si l'email n'arrive pas
- ✅ Configurez **SPF, DKIM et DMARC** pour améliorer la délivrabilité des emails

