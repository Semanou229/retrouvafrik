# 🔧 Instructions : Résoudre "Email not confirmed"

## Problème

Vous voyez l'erreur : **"Votre email n'est pas confirmé"** lors de la connexion.

## ✅ Solution 1 : Désactiver la confirmation d'email (RECOMMANDÉ pour le développement)

### Étapes :

1. **Ouvrir Supabase Dashboard**
   - Aller sur : https://supabase.com/dashboard
   - Sélectionner votre projet Trouvita

2. **Aller dans Authentication > Settings**
   - Menu de gauche : **Authentication**
   - Cliquer sur **Settings**

3. **Désactiver la confirmation d'email**
   - Section **"Email Auth"**
   - **Décocher** la case **"Enable email confirmations"**
   - Cliquer sur **"Save"** en bas de la page

4. **Tester la connexion**
   - Retourner sur http://localhost:3000/connexion
   - Se connecter avec les identifiants de test
   - ✅ La connexion devrait fonctionner maintenant !

---

## ✅ Solution 2 : Confirmer les emails automatiquement (Alternative)

Si vous préférez garder la confirmation d'email activée :

### Étape 1 : Obtenir la clé SERVICE_ROLE

1. **Aller dans Supabase Dashboard > Settings > API**
2. **Copier la "service_role" key** (c'est une clé secrète, ne la partagez jamais !)
3. **Ajouter dans `.env.local`** :
   ```env
   SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role_ici
   ```

### Étape 2 : Exécuter le script

```bash
npm run confirm-emails
```

Ce script confirmera automatiquement les emails des comptes de test.

---

## ✅ Solution 3 : Confirmer manuellement dans Supabase Dashboard

1. **Aller dans Supabase Dashboard > Authentication > Users**
2. **Trouver les utilisateurs de test** :
   - `admin.trouvita@gmail.com`
   - `test.trouvita@gmail.com`
   - `demo.trouvita@gmail.com`
3. **Pour chaque utilisateur** :
   - Cliquer sur l'utilisateur
   - Dans les détails, trouver l'option **"Confirm email"** ou **"Send confirmation email"**
   - Cliquer pour confirmer

---

## 🎯 Solution la plus rapide

**Pour le développement, la Solution 1 est la plus rapide :**

1. Ouvrir Supabase Dashboard
2. Authentication > Settings
3. Décocher "Enable email confirmations"
4. Save
5. Se connecter ✅

**C'est tout !** Les utilisateurs pourront se connecter immédiatement sans confirmation d'email.

---

## 📝 Comptes de test

Après avoir résolu le problème, utilisez :

### Compte Admin
- Email : `admin.trouvita@gmail.com`
- Mot de passe : `Admin123456!`

### Compte Utilisateur
- Email : `test.trouvita@gmail.com`
- Mot de passe : `Test123456!`

---

## ⚠️ Note importante

- **En développement** : Désactiver la confirmation d'email est normal et pratique
- **En production** : Réactiver la confirmation d'email pour la sécurité des utilisateurs

---

## 🆘 Si ça ne fonctionne toujours pas

1. Vérifier que vous avez bien sauvegardé les changements dans Supabase
2. Rafraîchir la page de connexion (F5)
3. Vérifier la console du navigateur pour d'autres erreurs
4. Vérifier que les variables d'environnement sont correctes dans `.env.local`

