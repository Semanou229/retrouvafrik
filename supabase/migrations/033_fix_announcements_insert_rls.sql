-- Fix: Corriger la politique RLS pour permettre la création d'annonces
-- Le problème est que la politique actuelle bloque les insertions si user_id est null (annonces anonymes)
-- ou si l'utilisateur n'est pas connecté

-- Supprimer toutes les anciennes politiques INSERT
DROP POLICY IF EXISTS "Users can create announcements" ON announcements;
DROP POLICY IF EXISTS "Authenticated users can create announcements" ON announcements;
DROP POLICY IF EXISTS "Anonymous users can create anonymous announcements" ON announcements;

-- Créer une politique ultra-permissive pour les utilisateurs authentifiés
-- Permet à tous les utilisateurs authentifiés de créer des annonces (peu importe le user_id)
CREATE POLICY "Authenticated users can create announcements"
  ON announcements FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Permettre aussi les annonces anonymes pour les utilisateurs non authentifiés
CREATE POLICY "Anonymous users can create anonymous announcements"
  ON announcements FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

