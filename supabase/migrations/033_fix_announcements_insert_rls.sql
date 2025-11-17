-- Fix: Corriger la politique RLS pour permettre la création d'annonces
-- Le problème est que la politique actuelle bloque les insertions si user_id est null (annonces anonymes)
-- ou si l'utilisateur n'est pas connecté

-- Supprimer l'ancienne politique
DROP POLICY IF EXISTS "Users can create announcements" ON announcements;

-- Créer une politique simple et permissive
-- Permet :
-- 1. Tous les utilisateurs authentifiés de créer des annonces (avec ou sans user_id)
-- 2. Les utilisateurs non authentifiés de créer des annonces anonymes (user_id doit être null)
CREATE POLICY "Users can create announcements"
  ON announcements FOR INSERT
  WITH CHECK (
    -- Si l'utilisateur est authentifié, il peut créer n'importe quelle annonce
    auth.uid() IS NOT NULL
    OR
    -- Si l'utilisateur n'est pas authentifié, il ne peut créer que des annonces anonymes
    (auth.uid() IS NULL AND announcements.user_id IS NULL)
  );

