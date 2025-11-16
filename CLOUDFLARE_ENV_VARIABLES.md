# Configuration des Variables d'Environnement sur Cloudflare Pages

## Variables Requises

Pour que le projet fonctionne correctement sur Cloudflare Pages, vous devez configurer les variables d'environnement suivantes dans le dashboard Cloudflare Pages :

### Variables Supabase (Obligatoires)

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Valeur : L'URL de votre projet Supabase
   - Exemple : `https://twfwahxnrivhsvhdbjul.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Valeur : La clé anonyme (anon key) de votre projet Supabase
   - Où la trouver : Supabase Dashboard > Settings > API > anon/public key

### Variables SMTP (Optionnelles - pour les notifications email)

3. **SMTP_HOST**
   - Valeur : Le serveur SMTP de votre fournisseur email
   - Exemple : `smtp.mailpro.fr` ou `smtp.gmail.com`

4. **SMTP_PORT**
   - Valeur : Le port SMTP (généralement 587 ou 465)
   - Exemple : `587`

5. **SMTP_SECURE**
   - Valeur : `true` pour port 465, `false` pour port 587
   - Exemple : `false`

6. **SMTP_USER**
   - Valeur : Votre adresse email SMTP
   - Exemple : `contact@retrouvafrik.com`

7. **SMTP_PASSWORD**
   - Valeur : Le mot de passe de votre compte email SMTP

8. **SMTP_FROM**
   - Valeur : L'adresse email d'expéditeur
   - Exemple : `contact@retrouvafrik.com`

9. **SMTP_FROM_NAME**
   - Valeur : Le nom de l'expéditeur
   - Exemple : `RetrouvAfrik`

10. **SMTP_API_KEY**
    - Valeur : Une clé API secrète pour protéger l'endpoint `/api/smtp/send`
    - Exemple : Générez une clé aléatoire sécurisée

## Comment Configurer dans Cloudflare Pages

1. Allez sur le [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Sélectionnez votre projet Cloudflare Pages
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez chaque variable d'environnement :
   - **Variable name** : Le nom de la variable (ex: `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value** : La valeur de la variable
   - **Environment** : Sélectionnez **Production** (et **Preview** si nécessaire)
5. Cliquez sur **Save**

## Variables par Environnement

Vous pouvez configurer différentes valeurs pour :
- **Production** : Variables pour le site en production
- **Preview** : Variables pour les déploiements de prévisualisation (branches)

## Important

⚠️ **Ne jamais commiter les variables d'environnement dans Git !**

Les variables sensibles comme `SMTP_PASSWORD` et `SMTP_API_KEY` doivent rester secrètes.

## Vérification

Après avoir configuré les variables d'environnement :
1. Redéployez votre projet sur Cloudflare Pages
2. Vérifiez que le build réussit
3. Testez les fonctionnalités qui nécessitent Supabase (connexion, annonces, etc.)

## Dépannage

Si le build échoue avec des erreurs liées à Supabase :
- Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont bien configurées
- Vérifiez que les valeurs sont correctes (pas d'espaces, pas de guillemets)
- Vérifiez que les variables sont définies pour l'environnement correct (Production/Preview)

