-- Corriger les politiques RLS pour ad_campaigns en utilisant la fonction is_admin()
-- au lieu d'accéder directement à auth.users

-- Supprimer les anciennes politiques qui utilisent auth.users
DROP POLICY IF EXISTS "Admins can manage all campaigns" ON ad_campaigns;
DROP POLICY IF EXISTS "Admins can view all ad requests" ON ad_requests;
DROP POLICY IF EXISTS "Admins can update ad requests" ON ad_requests;
DROP POLICY IF EXISTS "Admins can manage ad placements" ON ad_placements;

-- Politiques pour ad_campaigns utilisant is_admin()
-- Admins peuvent gérer toutes les campagnes (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can manage all campaigns"
  ON ad_campaigns FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Politiques pour ad_requests utilisant is_admin()
-- Admins peuvent voir toutes les demandes
CREATE POLICY "Admins can view all ad requests"
  ON ad_requests FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins peuvent mettre à jour les demandes
CREATE POLICY "Admins can update ad requests"
  ON ad_requests FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins peuvent supprimer les demandes
CREATE POLICY "Admins can delete ad requests"
  ON ad_requests FOR DELETE
  TO authenticated
  USING (is_admin());

-- Politiques pour ad_placements utilisant is_admin()
-- Admins peuvent gérer tous les emplacements
CREATE POLICY "Admins can manage ad placements"
  ON ad_placements FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

