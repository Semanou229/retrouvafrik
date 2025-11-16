-- Politiques RLS pour le bucket de stockage 'messages'
-- Note: Ce script doit être exécuté APRÈS avoir créé le bucket 'messages' dans l'interface Supabase Storage

-- Permettre aux utilisateurs authentifiés d'uploader des fichiers dans le bucket messages
CREATE POLICY IF NOT EXISTS "Users can upload messages"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'messages');

-- Permettre aux utilisateurs authentifiés de lire les fichiers du bucket messages
CREATE POLICY IF NOT EXISTS "Users can read messages"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'messages');

-- Permettre aux utilisateurs de supprimer leurs propres fichiers
CREATE POLICY IF NOT EXISTS "Users can delete their own messages"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'messages' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR auth.uid()::text = (storage.foldername(name))[2]
  )
);

-- Permettre aux utilisateurs de mettre à jour leurs propres fichiers
CREATE POLICY IF NOT EXISTS "Users can update their own messages"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'messages' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR auth.uid()::text = (storage.foldername(name))[2]
  )
);

