# 📧 Configuration des Templates d'Emails Supabase

## 🎯 Objectif

Personnaliser les templates d'emails d'authentification (création de compte, réinitialisation de mot de passe, etc.) pour RetrouvAfrik.

## 📋 Accès aux Templates

1. Connectez-vous à votre [Dashboard Supabase](https://app.supabase.com/)
2. Sélectionnez votre projet **retrouvafrik**
3. Allez dans **Settings** → **Auth**
4. Faites défiler jusqu'à **Email Templates** (Templates d'emails)

## 📝 Templates à Configurer

Supabase propose plusieurs templates d'emails que vous pouvez personnaliser :

1. **Confirm signup** - Confirmation d'inscription
2. **Magic Link** - Lien magique de connexion
3. **Change Email Address** - Changement d'adresse email
4. **Reset Password** - Réinitialisation de mot de passe
5. **Invite user** - Invitation d'utilisateur (si utilisé)

## 🔧 Variables Disponibles

Vous pouvez utiliser ces variables dans vos templates :

- `{{ .ConfirmationURL }}` - URL de confirmation
- `{{ .Token }}` - Token de confirmation
- `{{ .TokenHash }}` - Hash du token
- `{{ .SiteURL }}` - URL de votre site
- `{{ .Email }}` - Adresse email de l'utilisateur
- `{{ .RedirectTo }}` - URL de redirection
- `{{ .Data }}` - Données supplémentaires

## 📧 Template 1 : Confirmation d'Inscription (Confirm signup)

### Sujet (Subject)
```
Confirmez votre compte RetrouvAfrik
```

### Corps (Body) - Version HTML

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmez votre compte</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Bienvenue sur RetrouvAfrik !</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Bonjour,</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Merci de vous être inscrit sur <strong>RetrouvAfrik</strong>, la plateforme qui facilite les retrouvailles en Afrique.
    </p>
    
    <p style="font-size: 16px; margin-bottom: 30px;">
      Pour activer votre compte et commencer à utiliser nos services, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
        Confirmer mon compte
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
    </p>
    <p style="font-size: 12px; color: #999; word-break: break-all; background: #fff; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">
      {{ .ConfirmationURL }}
    </p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
      <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
        <strong>À quoi sert RetrouvAfrik ?</strong>
      </p>
      <ul style="font-size: 14px; color: #666; padding-left: 20px;">
        <li>Publier des annonces pour retrouver des personnes perdues de vue</li>
        <li>Recevoir des notifications pour les annonces dans votre secteur</li>
        <li>Communiquer de manière sécurisée avec d'autres membres</li>
        <li>Contribuer à créer des retrouvailles</li>
      </ul>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      Si vous n'avez pas créé de compte sur RetrouvAfrik, vous pouvez ignorer cet email.
    </p>
    
    <p style="font-size: 14px; color: #666; margin-top: 20px;">
      Cordialement,<br>
      <strong>L'équipe RetrouvAfrik</strong>
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
    <p style="font-size: 12px; color: #999;">
      RetrouvAfrik - Faciliter les retrouvailles en Afrique<br>
      <a href="{{ .SiteURL }}" style="color: #667eea; text-decoration: none;">{{ .SiteURL }}</a>
    </p>
  </div>
</body>
</html>
```

### Corps (Body) - Version Texte (Plain Text)

```
Bienvenue sur RetrouvAfrik !

Bonjour,

Merci de vous être inscrit sur RetrouvAfrik, la plateforme qui facilite les retrouvailles en Afrique.

Pour activer votre compte et commencer à utiliser nos services, veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :

{{ .ConfirmationURL }}

À quoi sert RetrouvAfrik ?
- Publier des annonces pour retrouver des personnes perdues de vue
- Recevoir des notifications pour les annonces dans votre secteur
- Communiquer de manière sécurisée avec d'autres membres
- Contribuer à créer des retrouvailles

Si vous n'avez pas créé de compte sur RetrouvAfrik, vous pouvez ignorer cet email.

Cordialement,
L'équipe RetrouvAfrik

---
RetrouvAfrik - Faciliter les retrouvailles en Afrique
{{ .SiteURL }}
```

## 🔑 Template 2 : Réinitialisation de Mot de Passe (Reset Password)

### Sujet (Subject)
```
Réinitialisez votre mot de passe RetrouvAfrik
```

### Corps (Body) - Version HTML

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation de mot de passe</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Réinitialisation de mot de passe</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Bonjour,</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Vous avez demandé à réinitialiser votre mot de passe sur <strong>RetrouvAfrik</strong>.
    </p>
    
    <p style="font-size: 16px; margin-bottom: 30px;">
      Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe. Ce lien est valide pendant 1 heure.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
        Réinitialiser mon mot de passe
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
    </p>
    <p style="font-size: 12px; color: #999; word-break: break-all; background: #fff; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">
      {{ .ConfirmationURL }}
    </p>
    
    <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin-top: 30px;">
      <p style="font-size: 14px; color: #856404; margin: 0;">
        <strong>⚠️ Sécurité :</strong> Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe actuel reste inchangé.
      </p>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      Ce lien expire dans <strong>1 heure</strong>. Pour des raisons de sécurité, ne partagez jamais ce lien avec d'autres personnes.
    </p>
    
    <p style="font-size: 14px; color: #666; margin-top: 20px;">
      Cordialement,<br>
      <strong>L'équipe RetrouvAfrik</strong>
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
    <p style="font-size: 12px; color: #999;">
      RetrouvAfrik - Faciliter les retrouvailles en Afrique<br>
      <a href="{{ .SiteURL }}" style="color: #667eea; text-decoration: none;">{{ .SiteURL }}</a>
    </p>
  </div>
</body>
</html>
```

### Corps (Body) - Version Texte (Plain Text)

```
Réinitialisation de mot de passe RetrouvAfrik

Bonjour,

Vous avez demandé à réinitialiser votre mot de passe sur RetrouvAfrik.

Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe. Ce lien est valide pendant 1 heure.

{{ .ConfirmationURL }}

⚠️ Sécurité : Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe actuel reste inchangé.

Ce lien expire dans 1 heure. Pour des raisons de sécurité, ne partagez jamais ce lien avec d'autres personnes.

Cordialement,
L'équipe RetrouvAfrik

---
RetrouvAfrik - Faciliter les retrouvailles en Afrique
{{ .SiteURL }}
```

## ✉️ Template 3 : Changement d'Email (Change Email Address)

### Sujet (Subject)
```
Confirmez votre nouvelle adresse email RetrouvAfrik
```

### Corps (Body) - Version HTML

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Changement d'adresse email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Confirmation de changement d'email</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Bonjour,</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Vous avez demandé à changer votre adresse email sur <strong>RetrouvAfrik</strong>.
    </p>
    
    <p style="font-size: 16px; margin-bottom: 30px;">
      Pour confirmer cette modification, veuillez cliquer sur le bouton ci-dessous :
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
        Confirmer le changement
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
    </p>
    <p style="font-size: 12px; color: #999; word-break: break-all; background: #fff; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">
      {{ .ConfirmationURL }}
    </p>
    
    <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin-top: 30px;">
      <p style="font-size: 14px; color: #856404; margin: 0;">
        <strong>⚠️ Important :</strong> Si vous n'avez pas demandé ce changement, ignorez cet email et contactez notre support.
      </p>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 20px;">
      Cordialement,<br>
      <strong>L'équipe RetrouvAfrik</strong>
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
    <p style="font-size: 12px; color: #999;">
      RetrouvAfrik - Faciliter les retrouvailles en Afrique<br>
      <a href="{{ .SiteURL }}" style="color: #667eea; text-decoration: none;">{{ .SiteURL }}</a>
    </p>
  </div>
</body>
</html>
```

## 🔗 Template 4 : Magic Link (Connexion sans mot de passe)

### Sujet (Subject)
```
Votre lien de connexion RetrouvAfrik
```

### Corps (Body) - Version HTML

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lien de connexion</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Connexion à RetrouvAfrik</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Bonjour,</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Cliquez sur le bouton ci-dessous pour vous connecter à votre compte <strong>RetrouvAfrik</strong> sans mot de passe.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
        Se connecter
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
    </p>
    <p style="font-size: 12px; color: #999; word-break: break-all; background: #fff; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">
      {{ .ConfirmationURL }}
    </p>
    
    <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin-top: 30px;">
      <p style="font-size: 14px; color: #856404; margin: 0;">
        <strong>🔒 Sécurité :</strong> Ce lien est valide pendant 1 heure. Ne partagez jamais ce lien avec d'autres personnes.
      </p>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 20px;">
      Si vous n'avez pas demandé ce lien de connexion, ignorez cet email.
    </p>
    
    <p style="font-size: 14px; color: #666; margin-top: 20px;">
      Cordialement,<br>
      <strong>L'équipe RetrouvAfrik</strong>
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
    <p style="font-size: 12px; color: #999;">
      RetrouvAfrik - Faciliter les retrouvailles en Afrique<br>
      <a href="{{ .SiteURL }}" style="color: #667eea; text-decoration: none;">{{ .SiteURL }}</a>
    </p>
  </div>
</body>
</html>
```

## 📝 Instructions de Configuration

### Pour chaque template :

1. **Copiez le contenu HTML** dans le champ "Body" (Corps)
2. **Copiez le contenu texte** dans le champ "Plain text body" (Corps texte) si disponible
3. **Copiez le sujet** dans le champ "Subject" (Sujet)
4. **Cliquez sur "Save"** (Enregistrer)

### Ordre recommandé :

1. ✅ **Confirm signup** (le plus important)
2. ✅ **Reset Password**
3. ✅ **Change Email Address**
4. ✅ **Magic Link** (si utilisé)

## 🎨 Personnalisation

Vous pouvez personnaliser :

- **Couleurs** : Remplacez `#667eea` et `#764ba2` par vos couleurs de marque
- **Logo** : Ajoutez une image de logo dans l'en-tête
- **Texte** : Adaptez les messages selon vos besoins
- **Style** : Modifiez les styles CSS inline selon vos préférences

## ✅ Test

Après avoir configuré les templates :

1. **Testez la création d'un compte** pour voir l'email de confirmation
2. **Testez la réinitialisation de mot de passe** pour voir l'email de réinitialisation
3. **Vérifiez que les liens fonctionnent** correctement
4. **Vérifiez l'affichage** sur mobile et desktop

## 🚨 Notes Importantes

- ⚠️ **Ne supprimez jamais** les variables `{{ .ConfirmationURL }}` ou `{{ .SiteURL }}`
- ✅ Les templates HTML sont préférés pour un meilleur rendu
- ✅ Incluez toujours une version texte pour les clients email qui ne supportent pas HTML
- ✅ Testez sur différents clients email (Gmail, Outlook, etc.)

## 📞 Support

Si vous avez des questions ou des problèmes avec les templates, consultez la [documentation Supabase](https://supabase.com/docs/guides/auth/auth-email-templates).

