-- Fix: Corriger la politique RLS pour permettre la création d'annonces
-- Le problème est que la politique actuelle bloque les insertions si user_id est null (annonces anonymes)
-- ou si l'utilisateur n'est pas connecté

-- Supprimer l'ancienne politique
DROP POLICY IF EXISTS "Users can create announcements" ON announcements;

-- Créer une nouvelle politique qui permet :
-- 1. Les utilisateurs authentifiés de créer des annonces avec leur user_id
-- 2. Les utilisateurs non authentifiés de créer des annonces anonymes (user_id = null)
CREATE POLICY "Users can create announcements"
  ON announcements FOR INSERT
  WITH CHECK (
    -- Si user_id est défini, l'utilisateur doit être authentifié et être le propriétaire
    (announcements.user_id IS NOT NULL AND auth.uid() = announcements.user_id)
    OR
    -- Si user_id est null, permettre l'insertion (annonce anonyme)
    (announcements.user_id IS NULL)
  );

-- S'assurer que les utilisateurs authentifiés peuvent aussi créer des annonces avec user_id null
-- (pour permettre la création d'annonces anonymes même quand connecté)
-- La politique ci-dessus le permet déjà

