-- Fonction RPC pour récupérer le nom d'affichage d'un utilisateur
-- Retourne le prénom, nom complet, ou email selon ce qui est disponible

CREATE OR REPLACE FUNCTION get_user_display_name(user_id_param UUID)
RETURNS TEXT AS $$
DECLARE
  user_metadata JSONB;
  first_name TEXT;
  full_name TEXT;
  user_email TEXT;
BEGIN
  -- Récupérer les métadonnées et l'email depuis auth.users
  SELECT 
    raw_user_meta_data,
    email
  INTO 
    user_metadata,
    user_email
  FROM auth.users
  WHERE id = user_id_param;

  -- Si l'utilisateur n'existe pas
  IF user_metadata IS NULL THEN
    RETURN 'Utilisateur';
  END IF;

  -- Essayer d'obtenir le prénom
  first_name := user_metadata->>'first_name';
  IF first_name IS NOT NULL AND first_name != '' THEN
    RETURN first_name;
  END IF;

  -- Essayer d'obtenir le nom complet et extraire le prénom
  full_name := user_metadata->>'full_name';
  IF full_name IS NOT NULL AND full_name != '' THEN
    -- Extraire le premier mot comme prénom
    first_name := split_part(trim(full_name), ' ', 1);
    IF first_name != '' THEN
      RETURN first_name;
    END IF;
    RETURN full_name;
  END IF;

  -- Fallback: utiliser la première partie de l'email
  IF user_email IS NOT NULL THEN
    RETURN split_part(user_email, '@', 1);
  END IF;

  RETURN 'Utilisateur';
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Accorder les permissions
GRANT EXECUTE ON FUNCTION get_user_display_name(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_display_name(UUID) TO anon;

