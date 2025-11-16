-- Ajouter des politiques RLS pour permettre aux admins de gérer les annonces et commentaires
-- Les admins sont identifiés par leur email contenant 'admin' ou 'retrouvafrik'

-- Fonction helper pour vérifier si un utilisateur est admin
-- Utilise uniquement le JWT token pour éviter les problèmes de permissions
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Récupérer l'email depuis le JWT token
  user_email := COALESCE(
    auth.jwt() ->> 'email',
    ''
  );
  
  -- Vérifier si l'email contient 'admin' ou 'retrouvafrik'
  RETURN (
    user_email LIKE '%admin%' 
    OR user_email LIKE '%retrouvafrik%'
    OR user_email LIKE '%@retrouvafrik.%'
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Politiques admin pour les annonces
-- Admins peuvent voir toutes les annonces (même non approuvées)
DROP POLICY IF EXISTS "Admins can view all announcements" ON announcements;
CREATE POLICY "Admins can view all announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins peuvent mettre à jour toutes les annonces
DROP POLICY IF EXISTS "Admins can update all announcements" ON announcements;
CREATE POLICY "Admins can update all announcements"
  ON announcements FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins peuvent supprimer toutes les annonces
DROP POLICY IF EXISTS "Admins can delete all announcements" ON announcements;
CREATE POLICY "Admins can delete all announcements"
  ON announcements FOR DELETE
  TO authenticated
  USING (is_admin());

-- Politiques admin pour les commentaires
-- Admins peuvent supprimer tous les commentaires
DROP POLICY IF EXISTS "Admins can delete all comments" ON comments;
CREATE POLICY "Admins can delete all comments"
  ON comments FOR DELETE
  TO authenticated
  USING (is_admin());

-- Admins peuvent mettre à jour tous les commentaires
DROP POLICY IF EXISTS "Admins can update all comments" ON comments;
CREATE POLICY "Admins can update all comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Politiques admin pour donation_settings
-- Supprimer les anciennes politiques qui utilisent auth.users
DROP POLICY IF EXISTS "Admins can view all donation settings" ON donation_settings;
DROP POLICY IF EXISTS "Admins can view donation settings" ON donation_settings;
DROP POLICY IF EXISTS "Admins can update donation settings" ON donation_settings;
DROP POLICY IF EXISTS "Admins can insert donation settings" ON donation_settings;
DROP POLICY IF EXISTS "Admins can manage donation settings" ON donation_settings;

-- Admins peuvent voir tous les paramètres de don (même inactifs)
CREATE POLICY "Admins can view all donation settings"
  ON donation_settings FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins peuvent créer des paramètres de don
CREATE POLICY "Admins can insert donation settings"
  ON donation_settings FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admins peuvent mettre à jour les paramètres de don
CREATE POLICY "Admins can update donation settings"
  ON donation_settings FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins peuvent supprimer les paramètres de don
CREATE POLICY "Admins can delete donation settings"
  ON donation_settings FOR DELETE
  TO authenticated
  USING (is_admin());

