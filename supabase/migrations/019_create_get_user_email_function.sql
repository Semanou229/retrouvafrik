-- Fonction RPC pour récupérer l'email d'un utilisateur
-- Cette fonction permet de récupérer l'email d'un utilisateur depuis auth.users
-- de manière sécurisée pour les commentaires et autres fonctionnalités

CREATE OR REPLACE FUNCTION get_user_email(user_id_param UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Récupérer l'email depuis auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = user_id_param;
  
  RETURN user_email;
END;
$$;

-- Donner les permissions d'exécution à tous les utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION get_user_email(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_email(UUID) TO anon;

