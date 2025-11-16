-- Migration pour créer un trigger qui envoie un email à l'admin lors de la création d'une annonce
-- L'annonce est créée avec approved = false par défaut

-- Fonction pour envoyer une notification email à l'admin
CREATE OR REPLACE FUNCTION notify_admin_new_announcement()
RETURNS TRIGGER AS $$
DECLARE
  admin_email TEXT;
  announcement_url TEXT;
BEGIN
  -- Récupérer l'email de l'admin (premier utilisateur avec role admin ou email contenant 'admin')
  SELECT email INTO admin_email
  FROM auth.users
  WHERE raw_user_meta_data->>'role' = 'admin'
     OR email LIKE '%admin%'
  LIMIT 1;

  -- Si aucun admin trouvé, utiliser l'email par défaut
  IF admin_email IS NULL THEN
    admin_email := 'admin@retrouvafrik.com';
  END IF;

  -- Construire l'URL de l'annonce
  announcement_url := 'https://retrouvafrik.vercel.app/admin/annonces?announcement=' || NEW.id;

  -- Envoyer l'email via Supabase Edge Function ou API
  -- Note: Cette fonction sera appelée depuis l'application Next.js
  -- car Supabase ne peut pas envoyer d'emails directement depuis PostgreSQL
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger qui se déclenche après l'insertion d'une annonce
CREATE TRIGGER on_new_announcement_created
AFTER INSERT ON announcements
FOR EACH ROW
WHEN (NEW.approved IS FALSE OR NEW.approved IS NULL)
EXECUTE FUNCTION notify_admin_new_announcement();

-- Index pour améliorer les performances des requêtes d'approbation
CREATE INDEX IF NOT EXISTS idx_announcements_approved ON announcements(approved) WHERE approved IS FALSE;

