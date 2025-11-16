# Configuration du stockage Supabase pour RetrouvAfrik

## Bucket de stockage requis

Pour que les fonctionnalités de messagerie fonctionnent correctement, vous devez créer un bucket de stockage dans Supabase :

### Étapes :

1. Allez dans votre projet Supabase Dashboard
2. Naviguez vers **Storage** dans le menu de gauche
3. Cliquez sur **New bucket**
4. Créez un bucket nommé `messages` avec les paramètres suivants :
   - **Name**: `messages`
   - **Public bucket**: ✅ Activé (pour permettre l'accès aux photos)
   - **File size limit**: 10 MB (ou selon vos besoins)
   - **Allowed MIME types**: `image/*` (ou laissez vide pour tous les types)

### Politiques RLS pour le bucket

Après avoir créé le bucket, vous devez configurer les politiques RLS dans l'éditeur SQL de Supabase :

```sql
-- Permettre aux utilisateurs authentifiés d'uploader des fichiers
CREATE POLICY "Users can upload messages"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'messages');

-- Permettre aux utilisateurs authentifiés de lire les fichiers
CREATE POLICY "Users can read messages"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'messages');

-- Permettre aux utilisateurs de supprimer leurs propres fichiers
CREATE POLICY "Users can delete their own messages"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'messages' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Structure des dossiers

Les fichiers seront organisés comme suit :
- `messages/{announcement_id}/{timestamp}.{ext}` - Photos partagées dans les messages
- `messages/recognitions/{announcement_id}/{timestamp}.{ext}` - Photos de reconnaissances

