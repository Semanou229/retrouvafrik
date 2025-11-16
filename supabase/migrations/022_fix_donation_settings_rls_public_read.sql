-- Corriger les politiques RLS pour donation_settings
-- S'assurer que les utilisateurs publics peuvent lire les paramètres actifs

-- Supprimer TOUTES les politiques existantes pour éviter les conflits
DROP POLICY IF EXISTS "Admins can view donation settings" ON donation_settings;
DROP POLICY IF EXISTS "Admins can view all donation settings" ON donation_settings;
DROP POLICY IF EXISTS "Anyone can view active donation settings" ON donation_settings;
DROP POLICY IF EXISTS "Public can view active donation settings" ON donation_settings;
DROP POLICY IF EXISTS "Public can read photos" ON donation_settings;

-- Créer une politique publique pour lire les paramètres actifs
-- Cette politique permet à tous (y compris les utilisateurs non authentifiés) de lire les paramètres actifs
-- Pas de restriction TO public ou TO authenticated, donc accessible à tous
CREATE POLICY "Anyone can view active donation settings"
  ON donation_settings FOR SELECT
  USING (is_active = TRUE);

-- Créer une politique pour les admins (pour la gestion)
-- Permet aux admins de voir tous les paramètres, même inactifs
CREATE POLICY "Admins can view all donation settings"
  ON donation_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (
        auth.users.email LIKE '%admin%' 
        OR auth.users.email LIKE '%retrouvafrik%'
        OR (auth.jwt() ->> 'email') LIKE '%admin%'
        OR (auth.jwt() ->> 'email') LIKE '%retrouvafrik%'
      )
    )
  );

