-- Ajouter une politique INSERT pour donation_settings
-- Actuellement, il n'y a que SELECT et UPDATE, mais pas INSERT

DROP POLICY IF EXISTS "Admins can insert donation settings" ON donation_settings;

CREATE POLICY "Admins can insert donation settings" ON donation_settings
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'email' LIKE '%admin%' 
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' LIKE '%retrouvafrik%'
  );

-- Corriger aussi les autres politiques pour utiliser auth.jwt() au lieu de auth.users
DROP POLICY IF EXISTS "Admins can view donation settings" ON donation_settings;
DROP POLICY IF EXISTS "Admins can update donation settings" ON donation_settings;

CREATE POLICY "Admins can view donation settings" ON donation_settings
  FOR SELECT
  USING (
    auth.jwt() ->> 'email' LIKE '%admin%' 
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' LIKE '%retrouvafrik%'
  );

CREATE POLICY "Admins can update donation settings" ON donation_settings
  FOR UPDATE
  USING (
    auth.jwt() ->> 'email' LIKE '%admin%' 
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' LIKE '%retrouvafrik%'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' LIKE '%admin%' 
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' LIKE '%retrouvafrik%'
  );

