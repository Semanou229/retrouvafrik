# 🔍 Guide de débogage des notifications email

## 📋 Vérifications à faire

### 1. Vérifier les variables d'environnement dans Vercel

Allez dans **Vercel Dashboard** → **Votre projet** → **Settings** → **Environment Variables** et vérifiez :

- ✅ `SMTP_API_KEY` - Clé API pour sécuriser l'envoi d'emails
- ✅ `SMTP_API_ENDPOINT` - Endpoint SMTP (par défaut: `/api/smtp/send`)
- ✅ `SMTP_FROM` - Email expéditeur (ex: `noreply@retrouvafrik.com`)
- ✅ `SMTP_FROM_NAME` - Nom de l'expéditeur (ex: `RetrouvAfrik`)
- ✅ `NEXT_PUBLIC_SITE_URL` - URL du site (ex: `https://retrouvafrik.vercel.app`)
- ✅ `RESEND_API_KEY` - Clé API Resend (si vous utilisez Resend)

### 2. Vérifier les logs dans Vercel

Allez dans **Vercel Dashboard** → **Votre projet** → **Deployments** → **Cliquez sur le dernier déploiement** → **Functions** → **Logs**

Cherchez les logs avec les préfixes :
- `📧 [sendEmail]` - Logs de la fonction d'envoi d'email
- `📧 [API]` - Logs des API routes de notification
- `📧 [PublicationForm]` - Logs du formulaire de publication
- `📧 [AdminAnnouncementsManager]` - Logs de l'approbation d'annonce
- `❌` - Erreurs
- `✅` - Succès

### 3. Vérifier l'email admin

L'email admin est configuré dans `lib/utils/email.ts` :
```typescript
const ADMIN_EMAIL = 'hello@retrouvafrik.com'
```

Vérifiez que cet email est bien utilisé dans les logs :
- Cherchez `📧 [API] Envoi email à admin: hello@retrouvafrik.com`

### 4. Tester manuellement l'envoi d'email

Vous pouvez tester l'API directement :

```bash
curl -X POST https://retrouvafrik.vercel.app/api/notifications/admin/announcement \
  -H "Content-Type: application/json" \
  -d '{"announcementId": "VOTRE_ANNONCE_ID"}'
```

### 5. Vérifier la configuration SMTP

L'API `/api/smtp/send` nécessite :
- Soit `RESEND_API_KEY` configuré (pour utiliser Resend)
- Soit une Edge Function Supabase configurée

**Si vous utilisez Resend :**
1. Créez un compte sur https://resend.com
2. Obtenez votre clé API
3. Ajoutez `RESEND_API_KEY` dans les variables d'environnement Vercel

**Si vous utilisez votre propre SMTP :**
1. Configurez les variables SMTP dans Vercel
2. Créez une Edge Function Supabase pour l'envoi SMTP

### 6. Erreurs courantes

#### Erreur : "SMTP_API_KEY not configured"
**Solution :** Ajoutez `SMTP_API_KEY` dans les variables d'environnement Vercel

#### Erreur : "Aucun service d'envoi d'email configuré"
**Solution :** Configurez soit `RESEND_API_KEY` soit une Edge Function Supabase

#### Erreur : "Non autorisé" (401)
**Solution :** Vérifiez que `SMTP_API_KEY` correspond bien à la clé utilisée dans l'API

#### Erreur : "sender rejected"
**Solution :** L'email `SMTP_FROM` doit être un email valide sur votre serveur SMTP

### 7. Vérifier que les notifications sont bien appelées

Dans les logs Vercel, vous devriez voir :

**Lors de la création d'une annonce :**
```
📧 [PublicationForm] Envoi notification admin pour annonce: [ID]
📧 [API] Notification admin - Nouvelle annonce
📧 [API] Announcement ID: [ID]
📧 [API] Envoi email à admin: hello@retrouvafrik.com
📧 [sendEmail] Début envoi email à: hello@retrouvafrik.com
📧 [sendEmail] Sujet: 🔔 Nouvelle annonce à approuver - [Titre]
📧 [sendEmail] Endpoint: https://retrouvafrik.vercel.app/api/smtp/send
✅ [sendEmail] Email envoyé avec succès
✅ [API] Email envoyé avec succès à l'administrateur
```

**Lors de l'approbation d'une annonce :**
```
📧 [AdminAnnouncementsManager] Envoi notification utilisateur pour annonce approuvée: [ID]
📧 [sendEmail] Début envoi email à: [email_utilisateur]
✅ [sendEmail] Email envoyé avec succès
```

### 8. Vérifier les emails dans votre boîte de réception

- Vérifiez les **spams** si vous ne recevez pas les emails
- Vérifiez que l'email `hello@retrouvafrik.com` existe et peut recevoir des emails
- Vérifiez que `SMTP_FROM` est un email valide sur votre serveur SMTP

## 🔧 Configuration recommandée

### Pour Resend (Recommandé)

```env
SMTP_API_KEY=votre_cle_secrete
SMTP_API_ENDPOINT=/api/smtp/send
SMTP_FROM=noreply@retrouvafrik.com
SMTP_FROM_NAME=RetrouvAfrik
RESEND_API_KEY=re_xxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://retrouvafrik.vercel.app
```

### Pour SMTP personnalisé

```env
SMTP_API_KEY=votre_cle_secrete
SMTP_API_ENDPOINT=/api/smtp/send
SMTP_FROM=votre-email@votre-domaine.com
SMTP_FROM_NAME=RetrouvAfrik
SMTP_HOST=smtp.votre-domaine.com
SMTP_PORT=587
SMTP_USER=votre-email@votre-domaine.com
SMTP_PASSWORD=votre-mot-de-passe
NEXT_PUBLIC_SITE_URL=https://retrouvafrik.vercel.app
```

## 📞 Support

Si les emails ne sont toujours pas envoyés après avoir vérifié tout ce qui précède :
1. Vérifiez les logs Vercel pour voir les erreurs exactes
2. Vérifiez que toutes les variables d'environnement sont bien configurées
3. Testez l'API `/api/smtp/send` directement avec curl ou Postman

