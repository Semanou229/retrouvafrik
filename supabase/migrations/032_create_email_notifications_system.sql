-- Système de notifications par email pour admin et utilisateurs

-- Fonction pour obtenir l'email admin
CREATE OR REPLACE FUNCTION get_admin_email()
RETURNS TEXT AS $$
BEGIN
  RETURN 'hello@retrouvafrik.com';
END;
$$ LANGUAGE plpgsql STABLE;

-- Fonction pour envoyer une notification admin (appelée par les triggers)
CREATE OR REPLACE FUNCTION notify_admin_on_new_announcement()
RETURNS TRIGGER AS $$
DECLARE
  admin_email TEXT;
  user_email TEXT;
BEGIN
  -- Récupérer l'email admin
  admin_email := get_admin_email();
  
  -- Récupérer l'email de l'utilisateur
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = NEW.user_id;
  
  -- Appeler l'API pour envoyer l'email (sera géré par l'API route)
  -- Cette fonction sera appelée par un trigger, et l'API route sera appelée depuis le code
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour notifier l'utilisateur quand son annonce est approuvée
CREATE OR REPLACE FUNCTION notify_user_on_announcement_approved()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Vérifier si le statut est passé à 'active' (approuvé)
  IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
    -- Récupérer l'email de l'utilisateur
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = NEW.user_id;
    
    -- L'envoi d'email sera géré par l'API route depuis le code
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour détecter les nouvelles annonces
CREATE OR REPLACE TRIGGER trigger_notify_admin_new_announcement
AFTER INSERT ON announcements
FOR EACH ROW
WHEN (NEW.status = 'pending')
EXECUTE FUNCTION notify_admin_on_new_announcement();

-- Trigger pour détecter l'approbation d'annonces
CREATE OR REPLACE TRIGGER trigger_notify_user_announcement_approved
AFTER UPDATE ON announcements
FOR EACH ROW
WHEN (NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active'))
EXECUTE FUNCTION notify_user_on_announcement_approved();

-- Fonction pour notifier l'admin d'un nouveau message
CREATE OR REPLACE FUNCTION notify_admin_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
  -- L'envoi d'email sera géré par l'API route depuis le code
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour détecter les nouveaux messages (seulement si le destinataire est admin)
CREATE OR REPLACE TRIGGER trigger_notify_admin_new_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION notify_admin_on_new_message();

-- Fonction pour notifier l'utilisateur d'un nouveau message
CREATE OR REPLACE FUNCTION notify_user_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
  -- L'envoi d'email sera géré par l'API route depuis le code
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour détecter les nouveaux messages pour les utilisateurs
CREATE OR REPLACE TRIGGER trigger_notify_user_new_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION notify_user_on_new_message();

-- Fonction pour notifier l'admin d'un nouveau ticket de support
CREATE OR REPLACE FUNCTION notify_admin_on_new_ticket()
RETURNS TRIGGER AS $$
BEGIN
  -- L'envoi d'email sera géré par l'API route depuis le code
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour détecter les nouveaux tickets de support
CREATE OR REPLACE TRIGGER trigger_notify_admin_new_ticket
AFTER INSERT ON support_tickets
FOR EACH ROW
EXECUTE FUNCTION notify_admin_on_new_ticket();

-- Fonction pour notifier l'utilisateur d'une réponse au support
CREATE OR REPLACE FUNCTION notify_user_on_ticket_reply()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier si c'est une réponse admin
  IF NEW.is_admin = TRUE THEN
    -- L'envoi d'email sera géré par l'API route depuis le code
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour détecter les réponses aux tickets
CREATE OR REPLACE TRIGGER trigger_notify_user_ticket_reply
AFTER INSERT ON ticket_messages
FOR EACH ROW
WHEN (NEW.is_admin = TRUE)
EXECUTE FUNCTION notify_user_on_ticket_reply();

