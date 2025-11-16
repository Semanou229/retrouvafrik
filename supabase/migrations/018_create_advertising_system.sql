-- Migration pour créer le système de publicité
-- Tables pour les demandes de pub, campagnes, statistiques et emplacements

-- Table pour les demandes de publicité
CREATE TABLE ad_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  website VARCHAR(255),
  description TEXT NOT NULL,
  budget_range VARCHAR(50),
  target_audience TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'contacted')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les campagnes publicitaires
CREATE TABLE ad_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_request_id UUID REFERENCES ad_requests(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  advertiser_name VARCHAR(255) NOT NULL,
  advertiser_email VARCHAR(255) NOT NULL,
  ad_url TEXT NOT NULL,
  image_url TEXT,
  placement VARCHAR(50) NOT NULL CHECK (placement IN ('header', 'sidebar', 'footer', 'between_posts', 'popup')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_impressions INTEGER,
  max_clicks INTEGER,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'expired')),
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les statistiques de campagnes
CREATE TABLE ad_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, date)
);

-- Table pour les emplacements publicitaires
CREATE TABLE ad_placements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  width INTEGER,
  height INTEGER,
  max_campaigns INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer les emplacements par défaut
INSERT INTO ad_placements (name, description, width, height, max_campaigns) VALUES
('header', 'Bannière en haut de page', 728, 90, 1),
('sidebar', 'Publicité dans la barre latérale', 300, 250, 2),
('footer', 'Bannière en bas de page', 728, 90, 1),
('between_posts', 'Entre les annonces', 728, 90, 1),
('popup', 'Popup (non intrusif)', 400, 300, 1);

-- Index pour améliorer les performances
CREATE INDEX idx_ad_campaigns_status ON ad_campaigns(status);
CREATE INDEX idx_ad_campaigns_dates ON ad_campaigns(start_date, end_date);
CREATE INDEX idx_ad_campaigns_placement ON ad_campaigns(placement);
CREATE INDEX idx_ad_stats_campaign_date ON ad_stats(campaign_id, date);
CREATE INDEX idx_ad_requests_status ON ad_requests(status);

-- RLS Policies
ALTER TABLE ad_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_placements ENABLE ROW LEVEL SECURITY;

-- Policies pour ad_requests (lecture publique pour création, admin pour gestion)
CREATE POLICY "Anyone can create ad requests" ON ad_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all ad requests" ON ad_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin' OR auth.users.email LIKE '%admin%')
    )
  );

CREATE POLICY "Admins can update ad requests" ON ad_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin' OR auth.users.email LIKE '%admin%')
    )
  );

-- Policies pour ad_campaigns (lecture publique pour affichage, admin pour gestion)
CREATE POLICY "Anyone can view active campaigns" ON ad_campaigns
  FOR SELECT USING (status = 'active' AND start_date <= NOW() AND end_date >= NOW());

CREATE POLICY "Admins can manage all campaigns" ON ad_campaigns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin' OR auth.users.email LIKE '%admin%')
    )
  );

-- Policies pour ad_stats (lecture publique pour statistiques, admin pour gestion)
CREATE POLICY "Anyone can view ad stats" ON ad_stats
  FOR SELECT USING (true);

CREATE POLICY "System can insert ad stats" ON ad_stats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update ad stats" ON ad_stats
  FOR UPDATE USING (true);

-- Policies pour ad_placements (lecture publique)
CREATE POLICY "Anyone can view ad placements" ON ad_placements
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage ad placements" ON ad_placements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin' OR auth.users.email LIKE '%admin%')
    )
  );

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ad_requests_updated_at BEFORE UPDATE ON ad_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ad_campaigns_updated_at BEFORE UPDATE ON ad_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

