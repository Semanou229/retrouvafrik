# 🔧 Correction : Erreur "Email not confirmed"

## Problème

Lors de la connexion, vous voyez l'erreur **"Email not confirmed"**. Cela signifie que Supabase nécessite une confirmation d'email avant de pouvoir se connecter.

## ✅ Solution rapide (Recommandée)

### Désactiver la confirmation d'email dans Supabase

1. **Aller dans Supabase Dashboard**
   - Ouvrir votre projet : https://supabase.com/dashboard
   - Sélectionner votre projet Trouvita

2. **Aller dans Authentication > Settings**
   - Menu de gauche : **Authentication**
   - Sous-menu : **Settings**

3. **Désactiver la confirmation d'email**
   - Trouver la section **"Email Auth"**
   - Décocher **"Enable email confirmations"**
   - Cliquer sur **"Save"**

4. **Tester la connexion**
   - Retourner sur http://localhost:3000/connexion
   - Se connecter avec les identifiants de test
   - ✅ La connexion devrait fonctionner maintenant

---

## 🔄 Solution alternative : Confirmer les emails manuellement

Si vous préférez garder la confirmation d'email activée :

1. **Aller dans Supabase Dashboard > Authentication > Users**
2. **Trouver les utilisateurs de test** :
   - `admin.trouvita@gmail.com`
   - `test.trouvita@gmail.com`
   - `demo.trouvita@gmail.com`
3. **Pour chaque utilisateur** :
   - Cliquer sur l'utilisateur
   - Cliquer sur **"Send confirmation email"** ou **"Confirm email"**
   - Vérifier la boîte email (ou confirmer directement dans le dashboard)

---

## 🎯 Solution pour le développement : Email de test automatique

Pour éviter ce problème à l'avenir :

1. **Aller dans Authentication > Settings**
2. **Dans "Email Auth"**, trouver **"Test Email Addresses"**
3. **Ajouter un domaine de test** (ex: `@test.local`)
4. **Les emails avec ce domaine seront automatiquement confirmés**

Exemple : Si vous ajoutez `@test.local`, les emails comme `admin@test.local` seront automatiquement confirmés.

---

## 📝 Comptes de test mis à jour

Après avoir désactivé la confirmation d'email, vous pouvez utiliser :

### Compte Admin
- Email : `admin.trouvita@gmail.com`
- Mot de passe : `Admin123456!`

### Compte Utilisateur
- Email : `test.trouvita@gmail.com`
- Mot de passe : `Test123456!`

---

## ⚠️ Note importante

- **En développement** : Désactiver la confirmation d'email est normal et pratique
- **En production** : Réactiver la confirmation d'email pour la sécurité

---

## 🚀 Après correction

Une fois la confirmation d'email désactivée :

1. ✅ Les utilisateurs peuvent se connecter immédiatement
2. ✅ Pas besoin de vérifier les emails
3. ✅ Parfait pour les tests et le développement

**La solution la plus rapide est de désactiver la confirmation d'email dans Supabase Dashboard !**

