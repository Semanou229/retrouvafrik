-- Fix: Corriger l'ambiguïté de la colonne user_id dans les RLS policies et fonctions
-- Cette migration corrige l'erreur "column reference 'user_id' is ambiguous"

-- Recréer les policies avec qualification explicite de la table
DROP POLICY IF EXISTS "Users can create announcements" ON announcements;
CREATE POLICY "Users can create announcements"
  ON announcements FOR INSERT
  WITH CHECK (auth.uid() = announcements.user_id);

DROP POLICY IF EXISTS "Users can update their own announcements" ON announcements;
CREATE POLICY "Users can update their own announcements"
  ON announcements FOR UPDATE
  USING (auth.uid() = announcements.user_id);

DROP POLICY IF EXISTS "Users can delete their own announcements" ON announcements;
CREATE POLICY "Users can delete their own announcements"
  ON announcements FOR DELETE
  USING (auth.uid() = announcements.user_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = comments.user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;
CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (auth.uid() = comments.user_id);

DROP POLICY IF EXISTS "Users can view their own reports" ON reports;
CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  USING (auth.uid() = reports.user_id OR auth.uid() IN (
    SELECT a.user_id FROM announcements a WHERE a.id = reports.announcement_id
  ));

-- Corriger la fonction find_users_to_notify pour qualifier user_id
CREATE OR REPLACE FUNCTION find_users_to_notify(
  p_announcement_id UUID,
  p_country VARCHAR(100),
  p_city VARCHAR(100)
)
RETURNS TABLE(user_id UUID, email VARCHAR(255), country VARCHAR(100), city VARCHAR(100)) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    unp.user_id,
    u.email::VARCHAR(255),
    unp.country,
    unp.city
  FROM user_notification_preferences unp
  INNER JOIN auth.users u ON u.id = unp.user_id
  WHERE unp.notify_on_new_announcement = TRUE
    AND unp.country = p_country
    AND (
      (unp.notify_on_same_city = TRUE AND unp.city = p_city)
      OR
      (unp.notify_on_same_country = TRUE AND unp.city IS NULL)
    )
    -- Exclure l'auteur de l'annonce (qualifier explicitement)
    AND unp.user_id != (SELECT a.user_id FROM announcements a WHERE a.id = p_announcement_id)
    -- Exclure les utilisateurs qui ont déjà reçu une notification pour cette annonce
    AND NOT EXISTS (
      SELECT 1 FROM announcement_notifications an
      WHERE an.announcement_id = p_announcement_id
        AND an.user_id = unp.user_id
    )
    -- S'assurer que l'utilisateur a un email confirmé
    AND u.email_confirmed_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

