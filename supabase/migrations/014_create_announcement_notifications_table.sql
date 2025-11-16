-- Table pour suivre les notifications envoyées (éviter les doublons)
CREATE TABLE IF NOT EXISTS announcement_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(announcement_id, user_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_announcement_notifications_announcement_id ON announcement_notifications(announcement_id);
CREATE INDEX IF NOT EXISTS idx_announcement_notifications_user_id ON announcement_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_announcement_notifications_email_sent ON announcement_notifications(email_sent);

-- RLS Policies
ALTER TABLE announcement_notifications ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres notifications
CREATE POLICY "Users can view their own notifications"
  ON announcement_notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Seul le système peut créer des notifications (via service_role)
CREATE POLICY "System can create notifications"
  ON announcement_notifications FOR INSERT
  WITH CHECK (true);

-- Seul le système peut mettre à jour les notifications
CREATE POLICY "System can update notifications"
  ON announcement_notifications FOR UPDATE
  USING (true);

