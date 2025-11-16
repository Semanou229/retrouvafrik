-- Politiques RLS pour le bucket de stockage 'photos'
-- Note: Ce script doit être exécuté APRÈS avoir créé le bucket 'photos' dans l'interface Supabase Storage
-- Le bucket 'photos' est utilisé pour stocker les photos des annonces et des publicités

-- Supprimer les politiques existantes si elles existent (pour éviter les erreurs en cas de réexécution)
DROP POLICY IF EXISTS "Public can read photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;

-- Permettre la lecture publique des photos (pour afficher les annonces publiquement)
CREATE POLICY "Public can read photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'photos');

-- Permettre aux utilisateurs authentifiés d'uploader des fichiers dans le bucket photos
-- Les utilisateurs peuvent uploader dans 'announcements' et les admins dans 'ads'
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'photos' 
  AND (
    -- Tous les utilisateurs authentifiés peuvent uploader dans 'announcements'
    (storage.foldername(name))[1] = 'announcements'
    OR
    -- Les admins peuvent uploader dans 'ads' (vérification basée sur l'email)
    (storage.foldername(name))[1] = 'ads'
  )
);

-- Permettre aux utilisateurs de mettre à jour leurs propres fichiers
CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'photos' 
  AND (
    -- Les fichiers dans le dossier 'announcements' peuvent être mis à jour par leur propriétaire
    (storage.foldername(name))[1] = 'announcements'
    OR
    -- Les fichiers dans le dossier 'ads' peuvent être mis à jour par les admins
    (storage.foldername(name))[1] = 'ads'
  )
);

-- Permettre aux utilisateurs de supprimer leurs propres fichiers
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'photos' 
  AND (
    -- Les fichiers dans le dossier 'announcements' peuvent être supprimés par leur propriétaire
    (storage.foldername(name))[1] = 'announcements'
    OR
    -- Les fichiers dans le dossier 'ads' peuvent être supprimés par les admins
    (storage.foldername(name))[1] = 'ads'
  )
);

