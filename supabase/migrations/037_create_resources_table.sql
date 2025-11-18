-- Création de la table resources pour les articles de blog et vidéos
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  content TEXT NOT NULL, -- Contenu de l'article ou description de la vidéo
  type VARCHAR(50) NOT NULL CHECK (type IN ('article', 'video')),
  video_url VARCHAR(500), -- URL YouTube/Vimeo pour les vidéos
  thumbnail_url VARCHAR(500), -- Image de couverture
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_published_at ON resources(published_at);
CREATE INDEX IF NOT EXISTS idx_resources_slug ON resources(slug);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_resources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_resources_updated_at();

-- RLS Policies
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs authentifiés peuvent voir les ressources publiées
CREATE POLICY "Public can view published resources"
  ON resources
  FOR SELECT
  TO authenticated, anon
  USING (status = 'published');

-- Les admins peuvent tout faire
CREATE POLICY "Admins can manage all resources"
  ON resources
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Les utilisateurs peuvent créer leurs propres ressources (pour les brouillons)
CREATE POLICY "Users can create their own resources"
  ON resources
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Les utilisateurs peuvent modifier leurs propres ressources
CREATE POLICY "Users can update their own resources"
  ON resources
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Les utilisateurs peuvent supprimer leurs propres ressources
CREATE POLICY "Users can delete their own resources"
  ON resources
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

