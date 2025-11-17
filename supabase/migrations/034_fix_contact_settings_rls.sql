-- Fix: Corriger les politiques RLS pour contact_settings
-- Utiliser la fonction is_admin() au lieu d'accéder directement à auth.users

-- Supprimer toutes les anciennes politiques
DROP POLICY IF EXISTS "Admins can view contact settings" ON contact_settings;
DROP POLICY IF EXISTS "Admins can update contact settings" ON contact_settings;
DROP POLICY IF EXISTS "Anyone can view active contact settings" ON contact_settings;
DROP POLICY IF EXISTS "Admins can insert contact settings" ON contact_settings;
DROP POLICY IF EXISTS "Admins can delete contact settings" ON contact_settings;

-- Politique publique : n'importe qui peut voir les paramètres actifs
CREATE POLICY "Anyone can view active contact settings"
  ON contact_settings FOR SELECT
  USING (is_active = TRUE);

-- Politiques admin : utiliser is_admin()
-- Admins peuvent voir tous les paramètres (même inactifs)
CREATE POLICY "Admins can view all contact settings"
  ON contact_settings FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins peuvent créer des paramètres
CREATE POLICY "Admins can insert contact settings"
  ON contact_settings FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admins peuvent mettre à jour les paramètres
CREATE POLICY "Admins can update contact settings"
  ON contact_settings FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins peuvent supprimer les paramètres
CREATE POLICY "Admins can delete contact settings"
  ON contact_settings FOR DELETE
  TO authenticated
  USING (is_admin());

