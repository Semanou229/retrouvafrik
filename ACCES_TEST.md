# 🔐 Accès de Test - Trouvita

## ✅ Comptes créés avec succès !

### 👤 Compte Utilisateur Standard
- **Email** : `test.trouvita@gmail.com`
- **Mot de passe** : `Test123456!`
- **Rôle** : Utilisateur standard
- **Accès** : 
  - ✅ Publier des annonces
  - ✅ Commenter
  - ✅ Signaler des informations
  - ✅ Gérer ses annonces
  - ✅ Accéder à `/mon-compte`

### 👨‍💼 Compte Administrateur
- **Email** : `admin.trouvita@gmail.com`
- **Mot de passe** : `Admin123456!`
- **Rôle** : Administrateur
- **Accès** :
  - ✅ Toutes les fonctionnalités utilisateur
  - ✅ Accès au tableau de bord admin (`/admin`)
  - ✅ Modération des annonces
  - ✅ Gestion des commentaires et signalements
  - ✅ Statistiques globales

### 🎭 Compte Démonstration
- **Email** : `demo.trouvita@gmail.com`
- **Mot de passe** : `Demo123456!`
- **Rôle** : Utilisateur standard
- **Accès** : Fonctionnalités complètes

---

## 🚀 Comment se connecter

1. **Ouvrir** : http://localhost:3000/connexion
2. **Entrer** l'email et le mot de passe ci-dessus
3. **Cliquer** sur "Se connecter"

---

## 📋 Tests à effectuer

### Test 1 : Publication d'annonce (Utilisateur)
1. Se connecter avec `test.trouvita@gmail.com` / `Test123456!`
2. Aller sur http://localhost:3000/publier
3. Remplir le formulaire :
   - Choisir un type (Personne, Animal, Objet)
   - Titre (minimum 10 caractères)
   - Description (minimum 50 caractères)
   - Date de disparition
   - Localisation (Pays, Ville)
   - Photos (optionnel)
   - Coordonnées de contact
4. Cliquer sur "Publier l'annonce"
5. ✅ Vérifier que l'annonce apparaît sur la page d'accueil

### Test 2 : Commentaires
1. Ouvrir une annonce existante
2. Se connecter avec `test.trouvita@gmail.com`
3. Ajouter un commentaire
4. ✅ Vérifier l'affichage du commentaire

### Test 3 : Signalements
1. Ouvrir une annonce
2. Cliquer sur "J'ai une information"
3. Remplir le formulaire de signalement
4. Envoyer
5. ✅ Vérifier la confirmation

### Test 4 : Espace Admin
1. Se connecter avec `admin.trouvita@gmail.com` / `Admin123456!`
2. Aller sur http://localhost:3000/admin
3. ✅ Vérifier les statistiques
4. ✅ Modérer des annonces (marquer comme résolue, supprimer)
5. ✅ Gérer les commentaires et signalements

### Test 5 : Gestion des annonces
1. Se connecter avec `test.trouvita@gmail.com`
2. Aller sur http://localhost:3000/mon-compte
3. ✅ Voir ses annonces
4. ✅ Marquer une annonce comme résolue
5. ✅ Archiver une annonce
6. ✅ Supprimer une annonce

---

## ⚙️ Configuration requise

### 1. Bucket Supabase Storage (pour les photos)

Si vous voulez tester l'upload de photos :

1. Aller dans **Supabase Dashboard** > **Storage** > **Buckets**
2. Créer un bucket nommé `photos`
3. Cocher **Public bucket**
4. Configurer les politiques :
   - **Public Access** : `SELECT` pour tous
   - **Authenticated Upload** : `INSERT` pour utilisateurs authentifiés

**Note** : Le formulaire fonctionne même sans photos. Les photos sont optionnelles.

### 2. Vérification de la base de données

Assurez-vous que la migration SQL a été exécutée :
- Table `announcements` existe
- Table `comments` existe
- Table `reports` existe
- Politiques RLS activées

---

## 🔧 Dépannage

### Erreur : "Email ou mot de passe incorrect"
- Vérifier que vous utilisez bien les identifiants ci-dessus
- Vérifier que les comptes ont bien été créés (voir console du script)

### Erreur : "Bucket not found" (pour les photos)
- Le formulaire fonctionne sans photos
- Pour activer les photos, créer le bucket `photos` dans Supabase Storage

### Erreur : "Permission denied"
- Vérifier les politiques RLS dans Supabase
- Vérifier que l'utilisateur est bien connecté

### Erreur lors de la publication
- Ouvrir la console du navigateur (F12)
- Vérifier les erreurs détaillées
- Vérifier que toutes les données requises sont remplies

---

## 📝 Notes importantes

1. **Les comptes sont créés dans Supabase Auth**
   - Vous pouvez vous connecter immédiatement
   - Pas besoin de vérification email pour ces comptes de test

2. **Les photos sont optionnelles**
   - Le formulaire fonctionne sans photos
   - Si le bucket n'existe pas, l'annonce sera créée sans photos

3. **L'espace admin**
   - Accessible à `/admin`
   - Tous les utilisateurs connectés peuvent y accéder pour le moment
   - En production, ajouter une vérification de rôle admin

---

## 🎯 Prochaines étapes

1. ✅ Se connecter avec les identifiants fournis
2. ✅ Tester la publication d'annonces
3. ✅ Tester les commentaires et signalements
4. ✅ Tester l'espace admin
5. ✅ Tester la gestion des annonces

**Bon test ! 🚀**
