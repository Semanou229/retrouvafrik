-- Create contact_settings table for admin to manage contact information
CREATE TABLE contact_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL DEFAULT 'contact@retrouvafrik.com',
  phone VARCHAR(50),
  address TEXT,
  hours VARCHAR(255) DEFAULT 'Lundi - Vendredi, 9h - 18h',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default contact setting
INSERT INTO contact_settings (email, phone, address, hours, is_active)
VALUES (
  'contact@retrouvafrik.com',
  '+229 XX XX XX XX',
  'Cotonou, Bénin',
  'Lundi - Vendredi, 9h - 18h',
  TRUE
);

-- Enable RLS
ALTER TABLE contact_settings ENABLE ROW LEVEL SECURITY;

-- Policies: Only admins can view and update
CREATE POLICY "Admins can view contact settings"
  ON contact_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email LIKE '%admin%' OR auth.users.email LIKE '%retrouvafrik%')
    )
  );

CREATE POLICY "Admins can update contact settings"
  ON contact_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email LIKE '%admin%' OR auth.users.email LIKE '%retrouvafrik%')
    )
  );

-- Anyone can view active contact settings (for public display)
CREATE POLICY "Anyone can view active contact settings"
  ON contact_settings FOR SELECT
  USING (is_active = TRUE);

-- Create trigger to update updated_at
CREATE TRIGGER update_contact_settings_updated_at BEFORE UPDATE ON contact_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

