# 📧 Configuration du système de notifications par email

## Vue d'ensemble

Le système de notifications par email permet d'envoyer automatiquement des emails aux membres inscrits dans le même secteur (pays/ville) lorsqu'une nouvelle annonce est publiée.

## Fonctionnement

1. **Préférences utilisateur** : Les utilisateurs peuvent configurer leurs préférences de notification dans leur profil (`/profil` > onglet "Notifications")
2. **Détection automatique** : Lorsqu'une nouvelle annonce est créée, un trigger PostgreSQL détecte automatiquement les membres à notifier
3. **Envoi d'emails** : Une Edge Function Supabase envoie les emails via Resend (ou autre service d'email)

## Configuration requise

### 1. Service d'email : Resend (recommandé)

1. **Créer un compte Resend** : https://resend.com
2. **Obtenir votre clé API** : Dashboard > API Keys > Create API Key
3. **Ajouter la clé dans Supabase** :
   - Aller dans Supabase Dashboard > Edge Functions > Settings
   - Ajouter la variable d'environnement : `RESEND_API_KEY` = votre clé API

### 2. Configuration du domaine d'email (optionnel mais recommandé)

Pour envoyer des emails depuis votre propre domaine :

1. **Dans Resend Dashboard** :
   - Aller dans "Domains"
   - Ajouter votre domaine (ex: `retrouvafrik.com`)
   - Configurer les enregistrements DNS (SPF, DKIM, DMARC)

2. **Mettre à jour la Edge Function** :
   - Modifier `supabase/functions/send-announcement-notifications/index.ts`
   - Changer `from: "RetrouvAfrik <notifications@retrouvafrik.com>"` avec votre domaine

### 3. Déployer la Edge Function

```bash
# Installer Supabase CLI si ce n'est pas déjà fait
npm install -g supabase

# Se connecter à Supabase
supabase login

# Lier votre projet
supabase link --project-ref votre-project-ref

# Déployer la fonction
supabase functions deploy send-announcement-notifications
```

## Structure de la base de données

### Tables créées

1. **`user_notification_preferences`** : Stocke les préférences de notification des utilisateurs
   - `user_id` : ID de l'utilisateur
   - `country` : Pays de notification
   - `city` : Ville de notification (optionnel)
   - `notify_on_new_announcement` : Activer/désactiver les notifications
   - `notify_on_same_city` : Notifier uniquement pour la même ville
   - `notify_on_same_country` : Notifier pour tout le pays

2. **`announcement_notifications`** : Suit les notifications envoyées
   - `announcement_id` : ID de l'annonce
   - `user_id` : ID de l'utilisateur notifié
   - `email_sent` : Statut d'envoi
   - `sent_at` : Date d'envoi
   - `error_message` : Message d'erreur si échec

### Fonctions PostgreSQL

1. **`find_users_to_notify()`** : Trouve les utilisateurs à notifier dans le même secteur
2. **`create_announcement_notifications()`** : Crée les entrées de notification (appelée par le trigger)

### Trigger

- **`trigger_create_announcement_notifications`** : Déclenché automatiquement après l'insertion d'une nouvelle annonce

## Utilisation

### Pour les utilisateurs

1. Aller dans `/profil` > onglet "Notifications"
2. Ajouter un secteur (pays et optionnellement ville)
3. Configurer les préférences (notifications activées, ville ou pays entier)
4. Recevoir automatiquement des emails lors de nouvelles annonces dans ce secteur

### Pour les développeurs

L'envoi d'emails est déclenché automatiquement lors de la création d'une annonce via :
- `PublicationForm.tsx` (annonces normales)
- `PerduDeVueForm.tsx` (annonces "perdu de vue")

L'API route `/api/notifications/send` appelle la Edge Function Supabase.

## Test

Pour tester le système :

1. **Créer un utilisateur de test** avec un email valide
2. **Configurer ses préférences** dans `/profil` > Notifications
3. **Créer une annonce** dans le même secteur
4. **Vérifier l'email** reçu

## Alternatives à Resend

Si vous préférez utiliser un autre service d'email :

1. **SendGrid** : Modifier la Edge Function pour utiliser l'API SendGrid
2. **Mailgun** : Modifier la Edge Function pour utiliser l'API Mailgun
3. **AWS SES** : Modifier la Edge Function pour utiliser AWS SES
4. **Supabase Email** : Utiliser le service d'email intégré de Supabase (limité)

## Dépannage

### Les emails ne sont pas envoyés

1. Vérifier que `RESEND_API_KEY` est configuré dans Supabase
2. Vérifier les logs de la Edge Function dans Supabase Dashboard
3. Vérifier que les utilisateurs ont configuré leurs préférences
4. Vérifier que les emails sont confirmés dans Supabase Auth

### Erreur "Email not sent"

1. Vérifier les logs dans `announcement_notifications.error_message`
2. Vérifier que le domaine d'email est vérifié dans Resend
3. Vérifier les limites de quota Resend

## Notes importantes

- Les emails ne sont envoyés qu'aux utilisateurs avec un email confirmé
- L'auteur de l'annonce ne reçoit pas de notification pour sa propre annonce
- Les notifications sont envoyées uniquement pour les annonces actives et approuvées
- Le système évite les doublons grâce à la table `announcement_notifications`

