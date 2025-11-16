-- Corriger les politiques RLS pour que les admins puissent voir TOUTES les annonces
-- Le problème est que la politique publique "Anyone can view active announcements" 
-- ne permet de voir que les annonces actives, ce qui bloque les admins

-- Supprimer la politique publique qui pourrait bloquer
-- Note: On ne peut pas supprimer complètement car elle est nécessaire pour les utilisateurs publics
-- Mais on va s'assurer que la politique admin a la priorité

-- La politique admin devrait permettre de voir toutes les annonces
-- Vérifier que la politique admin existe et fonctionne correctement
DROP POLICY IF EXISTS "Admins can view all announcements" ON announcements;

-- Recréer la politique admin pour qu'elle soit plus permissive
CREATE POLICY "Admins can view all announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (is_admin());

-- S'assurer que la politique publique permet aussi de voir les annonces actives approuvées
-- (celle-ci existe déjà dans la migration initiale, mais on la vérifie)
-- La politique "Anyone can view active announcements" existe déjà et permet de voir les annonces actives

