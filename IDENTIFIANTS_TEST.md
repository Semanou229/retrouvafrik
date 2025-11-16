# 🔐 Identifiants de Test - RetrouvAfrik

## ✅ Comptes créés et confirmés automatiquement

### 👨‍💼 Compte Administrateur
```
Email    : admin.retrouvafrik@gmail.com
Password : Admin123456!
URL      : https://retrouvafrik.vercel.app/admin
```
**Accès** :
- ✅ Toutes les fonctionnalités utilisateur
- ✅ Tableau de bord admin (`/admin`)
- ✅ Gestion des annonces
- ✅ Gestion des utilisateurs
- ✅ Statistiques globales
- ✅ Support & tickets
- ✅ Paramètres de don et contact

### 👤 Compte Utilisateur Standard
```
Email    : test.retrouvafrik@gmail.com
Password : Test123456!
URL      : https://retrouvafrik.vercel.app/mon-compte
```
**Accès** :
- ✅ Publier des annonces
- ✅ Commenter
- ✅ Signaler des informations
- ✅ Gérer ses annonces
- ✅ Messages privés
- ✅ Profil et paramètres

### 🎭 Compte Démonstration
```
Email    : demo.retrouvafrik@gmail.com
Password : Demo123456!
```
**Accès** : Fonctionnalités complètes utilisateur

---

## 🚀 Comment se connecter

1. **Ouvrir** : https://retrouvafrik.vercel.app/connexion
2. **Entrer** l'email et le mot de passe ci-dessus
3. **Cliquer** sur "Se connecter"

**Note** : Les emails sont automatiquement confirmés, vous pouvez vous connecter immédiatement !

---

## 📋 Tests recommandés

### Test Admin
1. Se connecter avec `admin.retrouvafrik@gmail.com`
2. Accéder à `/admin` pour voir le tableau de bord
3. Tester la gestion des annonces, utilisateurs, statistiques

### Test Utilisateur
1. Se connecter avec `test.retrouvafrik@gmail.com`
2. Publier une annonce sur `/publier`
3. Gérer ses annonces sur `/mon-compte`
4. Tester les messages et commentaires

---

## ⚙️ Création des comptes

Pour créer/recréer les comptes, exécutez :

```bash
node scripts/create-and-confirm-test-users.js
```

**Prérequis** :
- Fichier `.env.local` avec :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (pour confirmer les emails)

---

## 🔧 Dépannage

### Erreur : "Email ou mot de passe incorrect"
- Vérifier que vous utilisez bien les identifiants ci-dessus
- Exécuter le script de création pour recréer les comptes

### Erreur : "Email not confirmed"
- Exécuter le script `create-and-confirm-test-users.js` qui confirme automatiquement les emails

### Impossible d'accéder à `/admin`
- Vérifier que l'email contient "admin" ou que `user_metadata.role === 'admin'`
- Le compte `admin.retrouvafrik@gmail.com` a le rôle admin défini

---

**Bon test ! 🚀**

