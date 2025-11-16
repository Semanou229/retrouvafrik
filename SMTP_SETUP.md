# 📧 Configuration SMTP pour les notifications email

## Vue d'ensemble

Le système utilise votre serveur SMTP professionnel pour envoyer les emails de notification aux membres inscrits dans le même secteur lorsqu'une nouvelle annonce est publiée.

## Architecture

1. **Edge Function Supabase** : Détecte les nouvelles annonces et prépare les emails
2. **API Next.js** (`/api/smtp/send`) : Reçoit les requêtes et envoie via SMTP avec nodemailer
3. **Serveur SMTP** : Votre serveur SMTP professionnel qui envoie les emails

## Configuration

### 1. Variables d'environnement dans `.env.local`

Ajoutez les variables suivantes dans votre fichier `.env.local` :

```env
# Configuration SMTP
SMTP_HOST=smtp.votre-domaine.com
SMTP_PORT=587
SMTP_USER=votre-email@votre-domaine.com
SMTP_PASSWORD=votre-mot-de-passe-smtp
SMTP_FROM=votre-email@votre-domaine.com
SMTP_FROM_NAME=RetrouvAfrik
SMTP_SECURE=false
SMTP_API_KEY=votre-cle-secrete-pour-l-api

# URL de votre site (pour l'API)
NEXT_PUBLIC_SITE_URL=https://votre-site.com
```

**Note sur SMTP_SECURE** :
- `false` pour le port 587 (STARTTLS)
- `true` pour le port 465 (SSL/TLS)

### 2. Variables d'environnement dans Supabase

Dans le Supabase Dashboard, allez dans **Edge Functions > Settings** et ajoutez :

```env
SMTP_API_ENDPOINT=https://votre-site.com/api/smtp/send
SMTP_API_KEY=votre-cle-secrete-pour-l-api (la même que dans .env.local)
SMTP_FROM=votre-email@votre-domaine.com
SMTP_FROM_NAME=RetrouvAfrik
NEXT_PUBLIC_SITE_URL=https://votre-site.com
```

### 3. Installation des dépendances

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

## Configuration SMTP selon votre fournisseur

### Gmail / Google Workspace

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-app (générez un mot de passe d'application)
SMTP_SECURE=false
```

**Note** : Pour Gmail, vous devez générer un "Mot de passe d'application" dans les paramètres de sécurité de votre compte Google.

### Outlook / Office 365

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=votre-email@outlook.com
SMTP_PASSWORD=votre-mot-de-passe
SMTP_SECURE=false
```

### OVH / Autres hébergeurs

```env
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=587
SMTP_USER=votre-email@votre-domaine.com
SMTP_PASSWORD=votre-mot-de-passe
SMTP_SECURE=false
```

### Serveur SMTP personnalisé

```env
SMTP_HOST=smtp.votre-domaine.com
SMTP_PORT=587
SMTP_USER=votre-email@votre-domaine.com
SMTP_PASSWORD=votre-mot-de-passe
SMTP_SECURE=false
```

## Test de la configuration

### 1. Tester l'API SMTP directement

```bash
curl -X POST http://localhost:3000/api/smtp/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer votre-cle-secrete" \
  -d '{
    "email": {
      "from": "RetrouvAfrik <test@votre-domaine.com>",
      "to": "destinataire@example.com",
      "subject": "Test SMTP",
      "html": "<h1>Test</h1><p>Ceci est un test.</p>"
    }
  }'
```

### 2. Vérifier les logs

- **Next.js** : Vérifiez la console pour les erreurs SMTP
- **Supabase Edge Function** : Vérifiez les logs dans le Dashboard Supabase

## Sécurité

### Protection de l'API

L'API `/api/smtp/send` est protégée par une clé API (`SMTP_API_KEY`). Assurez-vous de :

1. **Utiliser une clé forte** : Générez une clé aléatoire longue (minimum 32 caractères)
2. **Ne jamais exposer la clé** : Ne la commitez jamais dans Git
3. **Utiliser HTTPS** : En production, utilisez toujours HTTPS

### Générer une clé API sécurisée

```bash
# Générer une clé aléatoire
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Dépannage

### Erreur "Configuration SMTP manquante"

- Vérifiez que toutes les variables SMTP sont définies dans `.env.local`
- Redémarrez le serveur Next.js après avoir modifié `.env.local`

### Erreur "Non autorisé"

- Vérifiez que `SMTP_API_KEY` est identique dans `.env.local` et Supabase
- Vérifiez que l'en-tête `Authorization: Bearer ...` est correct

### Erreur de connexion SMTP

- Vérifiez les identifiants SMTP (host, port, user, password)
- Vérifiez que le port est correct (587 pour STARTTLS, 465 pour SSL)
- Vérifiez que `SMTP_SECURE` correspond au port utilisé
- Testez la connexion SMTP avec un client email (Thunderbird, Outlook, etc.)

### Les emails ne sont pas envoyés

1. Vérifiez les logs de l'API Next.js
2. Vérifiez les logs de la Edge Function Supabase
3. Vérifiez que les utilisateurs ont configuré leurs préférences de notification
4. Vérifiez que les emails sont confirmés dans Supabase Auth

### Emails dans les spams

- Configurez SPF, DKIM et DMARC pour votre domaine
- Utilisez un nom d'expéditeur cohérent (`SMTP_FROM_NAME`)
- Évitez les mots-clés spam dans le sujet et le contenu

## Exemple de configuration complète

### `.env.local`

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=notifications@votre-domaine.com
SMTP_PASSWORD=votre-mot-de-passe-app
SMTP_FROM=notifications@votre-domaine.com
SMTP_FROM_NAME=RetrouvAfrik
SMTP_SECURE=false
SMTP_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Site URL
NEXT_PUBLIC_SITE_URL=https://retrouvafrik.com
```

### Supabase Edge Functions Settings

```env
SMTP_API_ENDPOINT=https://retrouvafrik.com/api/smtp/send
SMTP_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
SMTP_FROM=notifications@votre-domaine.com
SMTP_FROM_NAME=RetrouvAfrik
NEXT_PUBLIC_SITE_URL=https://retrouvafrik.com
```

## Notes importantes

- Les emails sont envoyés uniquement aux utilisateurs avec un email confirmé
- L'auteur de l'annonce ne reçoit pas de notification pour sa propre annonce
- Les notifications sont envoyées uniquement pour les annonces actives et approuvées
- Le système évite les doublons grâce à la table `announcement_notifications`

