# 🔧 Configuration Supabase - Trouvita

## Étapes de configuration

### 1. Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un compte (gratuit)
3. Créer un nouveau projet
4. Noter l'URL du projet et la clé anonyme (anon key)

### 2. Configurer la base de données

1. Aller dans **SQL Editor** dans le dashboard Supabase
2. Copier le contenu du fichier `supabase/migrations/001_initial_schema.sql`
3. Coller dans l'éditeur SQL
4. Cliquer sur **Run** pour exécuter la migration

Cette migration crée :
- La table `announcements` (annonces)
- La table `comments` (commentaires)
- La table `reports` (signalements)
- Les index pour les performances
- Les politiques RLS (Row Level Security)

### 3. Configurer le stockage pour les photos

1. Aller dans **Storage** dans le dashboard
2. Cliquer sur **Create bucket**
3. Nom du bucket : `photos`
4. Cocher **Public bucket** (pour que les photos soient accessibles publiquement)
5. Cliquer sur **Create bucket**

### 4. Configurer les politiques de stockage

1. Dans le bucket `photos`, aller dans **Policies**
2. Ajouter une nouvelle politique :

**Policy Name**: `Allow public read`
**Policy Definition**:
```sql
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
```

**Policy Name**: `Allow authenticated upload`
**Policy Definition**:
```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');
```

**Policy Name**: `Users can delete their own files`
**Policy Definition**:
```sql
CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 5. Configurer l'authentification

1. Aller dans **Authentication** > **Settings**
2. Vérifier que **Enable Email Signup** est activé
3. (Optionnel) Configurer les templates d'email dans **Email Templates**

### 6. Variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important** : Ne jamais commiter le fichier `.env.local` dans Git !

### 7. Vérifier la configuration

1. Lancer le serveur de développement : `npm run dev`
2. Aller sur `http://localhost:3000`
3. Tester l'inscription d'un compte
4. Tester la publication d'une annonce

## Dépannage

### Erreur "relation does not exist"
- Vérifier que la migration SQL a bien été exécutée
- Vérifier que vous êtes connecté au bon projet Supabase

### Erreur "permission denied"
- Vérifier les politiques RLS dans Supabase
- Vérifier les politiques de stockage pour le bucket `photos`

### Les photos ne s'affichent pas
- Vérifier que le bucket `photos` est public
- Vérifier les politiques de stockage
- Vérifier que les URLs générées sont correctes

### Erreur d'authentification
- Vérifier les variables d'environnement
- Vérifier que l'URL et la clé Supabase sont correctes
- Vérifier la configuration de l'authentification dans Supabase

## Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Guide Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

