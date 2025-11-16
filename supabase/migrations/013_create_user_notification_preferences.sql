-- Table pour stocker les préférences de notification des utilisateurs
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  notify_on_new_announcement BOOLEAN DEFAULT TRUE,
  notify_on_same_city BOOLEAN DEFAULT TRUE,
  notify_on_same_country BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, country, city)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_notification_preferences_user_id ON user_notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notification_preferences_country ON user_notification_preferences(country);
CREATE INDEX IF NOT EXISTS idx_user_notification_preferences_city ON user_notification_preferences(city);
CREATE INDEX IF NOT EXISTS idx_user_notification_preferences_location ON user_notification_preferences(country, city);

-- RLS Policies
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres préférences
CREATE POLICY "Users can view their own notification preferences"
  ON user_notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs propres préférences
CREATE POLICY "Users can create their own notification preferences"
  ON user_notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leurs propres préférences
CREATE POLICY "Users can update their own notification preferences"
  ON user_notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres préférences
CREATE POLICY "Users can delete their own notification preferences"
  ON user_notification_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Fonction pour mettre à jour updated_at
CREATE TRIGGER update_user_notification_preferences_updated_at 
  BEFORE UPDATE ON user_notification_preferences
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

