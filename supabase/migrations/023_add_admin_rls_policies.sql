-- Ajouter des politiques RLS pour permettre aux admins de gérer les annonces et commentaires
-- Les admins sont identifiés par leur email contenant 'admin' ou 'retrouvafrik'

-- Fonction helper pour vérifier si un utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (
      auth.users.email LIKE '%admin%' 
      OR auth.users.email LIKE '%retrouvafrik%'
      OR (auth.jwt() ->> 'email') LIKE '%admin%'
      OR (auth.jwt() ->> 'email') LIKE '%retrouvafrik%'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
-- Admins peuvent gérer les paramètres de don
DROP POLICY IF EXISTS "Admins can manage donation settings" ON donation_settings;
CREATE POLICY "Admins can manage donation settings"
  ON donation_settings FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

