# 📧 Alternative pour l'Envoi d'Emails sur Cloudflare Pages

## Problème

`nodemailer` nécessite des modules Node.js natifs (`stream`, `fs`, `path`, `crypto`) qui ne sont pas disponibles dans l'Edge Runtime de Cloudflare Pages. `@cloudflare/next-on-pages` exige que toutes les routes non-statiques utilisent Edge Runtime.

## Solutions

### Option 1 : Utiliser Resend API (Recommandé)

Resend est un service d'envoi d'emails moderne, compatible Edge Runtime, et facile à configurer.

#### Configuration

1. Créez un compte sur [Resend](https://resend.com)
2. Obtenez votre clé API
3. Ajoutez dans Cloudflare Pages > Settings > Environment Variables :
   ```
   RESEND_API_KEY=votre_clé_api_resend
   ```

#### Avantages
- ✅ Compatible Edge Runtime
- ✅ Simple à configurer
- ✅ API moderne et rapide
- ✅ Plan gratuit généreux (3000 emails/mois)

### Option 2 : Utiliser Supabase Edge Function pour SMTP

Créez une Edge Function Supabase qui gère l'envoi SMTP en utilisant `nodemailer` côté serveur.

#### Étapes

1. Créez une Edge Function dans Supabase :
   ```bash
   supabase functions new send-email
   ```

2. Dans `supabase/functions/send-email/index.ts`, utilisez `nodemailer` :
   ```typescript
   import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
   import { createClient } from 'jsr:@supabase/supabase-js@2'
   // Note: nodemailer peut nécessiter des polyfills pour Deno

   serve(async (req) => {
     const { to, subject, html, from } = await req.json()
     
     // Configuration SMTP depuis les variables d'environnement Supabase
     // Utiliser nodemailer ou une alternative compatible Deno
     
     return new Response(JSON.stringify({ success: true }), {
       headers: { 'Content-Type': 'application/json' },
     })
   })
   ```

3. Déployez la fonction :
   ```bash
   supabase functions deploy send-email
   ```

4. Configurez les variables d'environnement dans Supabase Dashboard :
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASSWORD`
   - `SMTP_FROM`

#### Avantages
- ✅ Utilise votre serveur SMTP existant (Mail Pro)
- ✅ Fonctionne avec `nodemailer`
- ✅ Contrôle total sur l'envoi

### Option 3 : Utiliser SendGrid API (Alternative)

SendGrid offre également une API compatible Edge Runtime.

#### Configuration

1. Créez un compte sur [SendGrid](https://sendgrid.com)
2. Obtenez votre clé API
3. Modifiez `/api/smtp/send/route.ts` pour utiliser SendGrid API au lieu de Resend

## Recommandation

**Utilisez Resend** pour une solution rapide et moderne, ou **Supabase Edge Function** si vous devez absolument utiliser votre serveur SMTP Mail Pro.

## Migration depuis nodemailer

La route `/api/smtp/send/route.ts` a été mise à jour pour :
1. Essayer Resend API en premier (si `RESEND_API_KEY` est configuré)
2. Essayer Supabase Edge Function en second (si disponible)
3. Retourner une erreur explicative si aucune option n'est configurée

## Variables d'Environnement Requises

### Pour Resend
- `RESEND_API_KEY` : Votre clé API Resend

### Pour Supabase Edge Function
- Les variables SMTP dans Supabase Dashboard (pas dans Cloudflare Pages)
- `NEXT_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé anonyme Supabase

## Test

Après configuration, testez l'envoi d'email via l'API :
```bash
curl -X POST https://votre-site.pages.dev/api/smtp/send \
  -H "Authorization: Bearer votre_smtp_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "email": {
      "to": "test@example.com",
      "subject": "Test",
      "html": "<p>Test email</p>"
    }
  }'
```

