# 🔍 Vérification de la Configuration Supabase pour Résoudre l'Erreur 500

## 🎯 Problème

Erreur 500 lors de l'inscription : `POST /auth/v1/signup 500 (Internal Server Error)`

## ✅ Checklist de Vérification dans Supabase Dashboard

### 1. Vérifier les URLs Autorisées (Site URL)

**C'est souvent la cause principale de l'erreur 500 !**

1. Allez dans **Supabase Dashboard** → **Settings** → **Auth**
2. Faites défiler jusqu'à **Site URL**
3. Vérifiez que votre URL de production est dans la liste :
   - `https://retrouvafrik.vercel.app`
   - `https://retrouvafrik.com` (si vous avez un domaine personnalisé)

4. **Ajoutez aussi les URLs de redirection autorisées** :
   - Dans **Redirect URLs**, ajoutez :
     - `https://retrouvafrik.vercel.app/mon-compte`
     - `https://retrouvafrik.vercel.app/**` (pour autoriser toutes les pages)
     - `https://retrouvafrik.com/mon-compte` (si vous avez un domaine personnalisé)

### 2. Vérifier la Configuration SMTP

1. **Settings** → **Auth** → **SMTP Settings**
2. Vérifiez que **"Enable Custom SMTP"** est activé
3. **Testez la configuration** :
   - Cliquez sur **"Send test email"**
   - Entrez votre email
   - Vérifiez que vous recevez l'email

4. **Si le test échoue**, vérifiez :
   - Host SMTP correct
   - Port correct (587 ou 465)
   - Username et Password corrects
   - Sender email valide

### 3. Vérifier les Templates d'Emails

1. **Settings** → **Auth** → **Email Templates**
2. Vérifiez le template **"Confirm signup"** :
   - Le sujet (Subject) est défini
   - Le corps (Body) contient `{{ .ConfirmationURL }}`
   - Pas d'erreur de syntaxe dans le HTML

3. **Testez le template** :
   - Utilisez le bouton "Send test email" dans les templates
   - Vérifiez que l'email arrive correctement formaté

### 4. Vérifier les Logs Supabase

1. **Logs** → **Auth Logs**
2. Cherchez les erreurs récentes lors de l'inscription
3. Les erreurs courantes :
   - `Invalid redirect URL` → URL non autorisée
   - `SMTP error` → Problème avec l'envoi d'email
   - `Template error` → Erreur dans le template d'email

### 5. Vérifier les Paramètres d'Authentification

1. **Settings** → **Auth** → **Email Auth**
2. Vérifiez que :
   - **"Enable email confirmations"** est activé (si vous voulez la confirmation)
   - **"Secure email change"** est configuré correctement

## 🔧 Solutions Spécifiques

### Solution 1 : Ajouter l'URL de Redirection

**Dans Supabase Dashboard :**

1. **Settings** → **Auth** → **URL Configuration**
2. Dans **Redirect URLs**, ajoutez :
   ```
   https://retrouvafrik.vercel.app/**
   https://retrouvafrik.vercel.app/mon-compte
   ```
3. Cliquez sur **Save**

### Solution 2 : Vérifier le Template d'Email

**Si le template a une erreur, cela peut causer une erreur 500 :**

1. Allez dans **Settings** → **Auth** → **Email Templates**
2. Sélectionnez **"Confirm signup"**
3. Vérifiez que le template contient :
   ```html
   {{ .ConfirmationURL }}
   ```
4. Assurez-vous qu'il n'y a pas d'erreur de syntaxe HTML

### Solution 3 : Désactiver Temporairement la Confirmation

**Pour tester si le problème vient de l'envoi d'email :**

1. **Settings** → **Auth** → **Email Auth**
2. Désactivez **"Enable email confirmations"**
3. Testez la création d'un compte
4. Si ça fonctionne, le problème vient de l'envoi d'email
5. Réactivez après avoir corrigé le SMTP

### Solution 4 : Vérifier les Variables d'Environnement

**Assurez-vous que les variables sont correctes :**

- `NEXT_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé anonyme Supabase

## 🧪 Test Après Configuration

1. **Videz le cache du navigateur**
2. **Essayez de créer un compte**
3. **Vérifiez les logs Supabase** pour voir l'erreur exacte
4. **Vérifiez votre boîte email** (et les spams)

## 📋 Checklist Complète

- [ ] Site URL configuré dans Supabase
- [ ] Redirect URLs ajoutées dans Supabase
- [ ] SMTP activé et testé avec succès
- [ ] Template d'email "Confirm signup" configuré correctement
- [ ] Pas d'erreurs dans les logs Supabase Auth
- [ ] Variables d'environnement correctes
- [ ] Test de création de compte fonctionne

## 🚨 Erreurs Fréquentes

### Erreur : "Invalid redirect URL"
**Solution** : Ajoutez l'URL dans **Redirect URLs** dans Supabase Dashboard

### Erreur : "SMTP connection failed"
**Solution** : Vérifiez la configuration SMTP et testez avec "Send test email"

### Erreur : "Template rendering error"
**Solution** : Vérifiez le template d'email pour les erreurs de syntaxe

### Erreur : "Rate limit exceeded"
**Solution** : Attendez quelques minutes ou vérifiez les limites de votre SMTP

## 📞 Support

Si le problème persiste :
1. Consultez les **logs Supabase** pour l'erreur exacte
2. Vérifiez la [documentation Supabase](https://supabase.com/docs/guides/auth)
3. Contactez le support Supabase si nécessaire

