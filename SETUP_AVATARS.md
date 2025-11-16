# Configuration du bucket de stockage pour les avatars

## Bucket de stockage requis

Pour que les photos de profil fonctionnent correctement, vous devez créer un bucket de stockage dans Supabase :

### Étapes :

1. Allez dans votre projet Supabase Dashboard
2. Naviguez vers **Storage** dans le menu de gauche
3. Cliquez sur **New bucket**
4. Créez un bucket nommé `avatars` avec les paramètres suivants :
   - **Name**: `avatars`
   - **Public bucket**: ✅ Activé (pour permettre l'accès aux photos de profil)
   - **File size limit**: 5 MB (ou selon vos besoins)
   - **Allowed MIME types**: `image/*` (ou laissez vide pour tous les types d'images)

### Politiques RLS pour le bucket

Après avoir créé le bucket, vous devez configurer les politiques RLS dans l'éditeur SQL de Supabase :

```sql
-- Permettre aux utilisateurs authentifiés d'uploader leurs propres avatars
CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permettre à tous de lire les avatars (public)
CREATE POLICY "Anyone can read avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Permettre aux utilisateurs de mettre à jour leurs propres avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permettre aux utilisateurs de supprimer leurs propres avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Structure des dossiers

Les fichiers seront organisés comme suit :
- `avatars/{user_id}/{timestamp}.{ext}` - Photos de profil des utilisateurs

