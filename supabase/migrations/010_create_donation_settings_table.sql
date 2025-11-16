-- Create donation_settings table for admin to manage donation links
CREATE TABLE donation_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL DEFAULT 'Faites un don',
  description TEXT,
  donation_url TEXT NOT NULL, -- URL du lien de don (PayPal, Stripe, etc.)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default donation setting
INSERT INTO donation_settings (title, description, donation_url, is_active)
VALUES (
  'Soutenez RetrouvAfrik',
  'Votre don nous aide à maintenir la plateforme et à aider plus de personnes',
  'https://paypal.me/retrouvafrik', -- L'admin pourra modifier ce lien
  TRUE
);

-- Enable RLS
ALTER TABLE donation_settings ENABLE ROW LEVEL SECURITY;

-- Policies: Only admins can view and update
-- Note: Using email check for admin role. Adjust based on your admin detection method.
CREATE POLICY "Admins can view donation settings"
  ON donation_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email LIKE '%admin%' OR auth.users.email LIKE '%retrouvafrik%')
    )
  );

CREATE POLICY "Admins can update donation settings"
  ON donation_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email LIKE '%admin%' OR auth.users.email LIKE '%retrouvafrik%')
    )
  );

-- Anyone can view active donation settings (for public display)
CREATE POLICY "Anyone can view active donation settings"
  ON donation_settings FOR SELECT
  USING (is_active = TRUE);

-- Create trigger to update updated_at
CREATE TRIGGER update_donation_settings_updated_at BEFORE UPDATE ON donation_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

