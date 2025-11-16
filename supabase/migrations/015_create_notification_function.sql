-- Fonction pour trouver les utilisateurs à notifier dans le même secteur
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
    -- Exclure l'auteur de l'annonce
    AND unp.user_id != (SELECT user_id FROM announcements WHERE id = p_announcement_id)
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

-- Fonction pour créer les notifications (appelée par le trigger)
CREATE OR REPLACE FUNCTION create_announcement_notifications()
RETURNS TRIGGER AS $$
DECLARE
  v_user_record RECORD;
BEGIN
  -- Seulement pour les nouvelles annonces actives et approuvées
  IF NEW.status = 'active' AND (NEW.approved IS NULL OR NEW.approved = TRUE) AND (NEW.hidden IS NULL OR NEW.hidden = FALSE) THEN
    -- Trouver les utilisateurs à notifier
    FOR v_user_record IN 
      SELECT * FROM find_users_to_notify(
        NEW.id,
        NEW.last_location->>'country',
        NEW.last_location->>'city'
      )
    LOOP
      -- Créer une entrée dans announcement_notifications
      INSERT INTO announcement_notifications (announcement_id, user_id, email_sent)
      VALUES (NEW.id, v_user_record.user_id, FALSE)
      ON CONFLICT (announcement_id, user_id) DO NOTHING;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger
DROP TRIGGER IF EXISTS trigger_create_announcement_notifications ON announcements;
CREATE TRIGGER trigger_create_announcement_notifications
  AFTER INSERT ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION create_announcement_notifications();

