# 🔍 Vérification des Variables d'Environnement

## ⚠️ IMPORTANT : L'erreur "Internal Server Error" peut être causée par des variables d'environnement manquantes

## 📋 Variables Requises dans Cloudflare Pages

Vous **DEVEZ** configurer ces variables dans Cloudflare Pages :

### 1. Accéder aux Variables d'Environnement

1. Allez sur [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Sélectionnez votre projet **retrouvafrik**
3. Allez dans **Settings** > **Environment Variables**

### 2. Variables Obligatoires

Ajoutez ces variables pour **Production** et **Preview** :

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_ici
```

### 3. Comment Obtenir ces Valeurs

#### NEXT_PUBLIC_SUPABASE_URL
1. Allez sur [Supabase Dashboard](https://app.supabase.com/)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Copiez l'**Project URL** (ex: `https://twfwahxnrivhsvhdbjul.supabase.co`)

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
1. Dans le même écran **Settings** > **API**
2. Copiez la **anon/public key** (commence par `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 4. Variables Optionnelles (pour emails)

Si vous utilisez Resend pour les emails :
```
RESEND_API_KEY=votre_clé_resend
```

Si vous utilisez SMTP :
```
SMTP_API_KEY=votre_clé_api_smtp
SMTP_HOST=smtp.mailpro.fr
SMTP_PORT=587
SMTP_USER=votre_email@domaine.com
SMTP_PASSWORD=votre_mot_de_passe
SMTP_FROM=noreply@retrouvafrik.com
SMTP_FROM_NAME=RetrouvAfrik
```

## ✅ Vérification

Après avoir ajouté les variables :

1. **Sauvegardez** les modifications
2. **Redéployez** votre projet (Cloudflare Pages devrait redéployer automatiquement)
3. Attendez la fin du build
4. Testez le site : `https://retrouvafrik.pages.dev`

## 🔍 Comment Vérifier si les Variables sont Définies

Si les variables ne sont pas définies, vous verrez dans les logs Cloudflare Pages :
```
Missing Supabase environment variables, using placeholder client
```

Cela signifie que le code utilise un client placeholder qui ne fonctionnera pas correctement.

## 🆘 Si l'Erreur Persiste

1. **Vérifiez les logs Cloudflare Pages** pour voir l'erreur exacte
2. **Vérifiez que les variables sont bien définies** pour **Production** (pas seulement Preview)
3. **Vérifiez qu'il n'y a pas d'espaces** avant/après les valeurs
4. **Vérifiez que les valeurs sont correctes** (pas de guillemets supplémentaires)

