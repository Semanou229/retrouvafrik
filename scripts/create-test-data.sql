-- Script SQL pour créer des données de test dans RetrouvAfrik
-- À exécuter dans Supabase SQL Editor

-- Note: Les utilisateurs doivent être créés via l'interface d'inscription
-- Ce script crée uniquement des annonces de test

-- Insérer des annonces de démonstration
-- Remplacez les user_id par les IDs réels de vos utilisateurs de test

INSERT INTO announcements (
  type,
  title,
  description,
  disappearance_date,
  last_location,
  urgency,
  status,
  photos,
  contact_email,
  contact_phone,
  contact_visibility,
  user_id,
  views_count
) VALUES
(
  'person',
  'Recherche de mon frère Koffi, disparu depuis 3 semaines',
  'Mon frère Koffi, 28 ans, a disparu le 15 janvier dernier à Abidjan. Il mesure environ 1m75, porte des lunettes et avait une cicatrice sur le bras gauche. Il était vêtu d''un t-shirt blanc et d''un jean bleu. Si vous avez des informations, merci de nous contacter. Sa famille est très inquiète.',
  '2024-01-15',
  '{"country": "Côte d''Ivoire", "city": "Abidjan", "address": "Quartier Yopougon"}'::jsonb,
  'urgent',
  'active',
  ARRAY[]::text[],
  'famille.koffi@example.com',
  '+225 07 12 34 56 78',
  'members_only',
  NULL, -- Remplacer par un user_id réel si disponible
  0
),
(
  'animal',
  'Chien perdu - Max, berger allemand à Cocody',
  'Max, notre berger allemand de 3 ans, s''est échappé hier soir. Il est très gentil, porte un collier rouge avec une médaille. Il répond au nom de Max. Récompense offerte pour son retour.',
  '2024-01-20',
  '{"country": "Côte d''Ivoire", "city": "Abidjan", "address": "Cocody, Riviera"}'::jsonb,
  'normal',
  'active',
  ARRAY[]::text[],
  'proprietaire.max@example.com',
  '+225 05 98 76 54 32',
  'members_only',
  NULL,
  0
),
(
  'object',
  'Portefeuille perdu avec documents importants',
  'J''ai perdu mon portefeuille noir en cuir contenant ma carte d''identité, mon permis de conduire et des photos de famille. Perdu dans le quartier de Treichville près du marché. Très important pour moi.',
  '2024-01-18',
  '{"country": "Côte d''Ivoire", "city": "Abidjan", "address": "Treichville, marché central"}'::jsonb,
  'normal',
  'active',
  ARRAY[]::text[],
  'proprietaire.portefeuille@example.com',
  NULL,
  'members_only',
  NULL,
  0
),
(
  'person',
  'À la recherche de mon ami d''enfance Amadou',
  'Je recherche Amadou Diallo, mon ami d''enfance avec qui j''ai grandi à Bouaké. Nous avons perdu contact il y a 10 ans après qu''il ait déménagé. Il aurait environ 32 ans maintenant. Si quelqu''un le connaît, merci de me contacter.',
  '2014-01-01',
  '{"country": "Côte d''Ivoire", "city": "Bouaké"}'::jsonb,
  'normal',
  'active',
  ARRAY[]::text[],
  'recherche.amadou@example.com',
  NULL,
  'public',
  NULL,
  0
),
(
  'animal',
  'Chat perdu - Minou, chat tigré à Marcory',
  'Minou, notre chat tigré de 2 ans, a disparu depuis hier. Il est très craintif mais très gentil. Il a une tache blanche sur le ventre. Merci de nous aider à le retrouver.',
  '2024-01-21',
  '{"country": "Côte d''Ivoire", "city": "Abidjan", "address": "Marcory"}'::jsonb,
  'normal',
  'active',
  ARRAY[]::text[],
  'proprietaire.minou@example.com',
  NULL,
  'members_only',
  NULL,
  0
);

-- Note: Pour obtenir les user_id réels, exécutez cette requête après avoir créé les comptes :
-- SELECT id, email FROM auth.users;

