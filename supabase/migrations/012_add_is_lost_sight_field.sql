-- Add is_lost_sight field to distinguish "perdu de vue" from regular missing persons
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS is_lost_sight BOOLEAN DEFAULT FALSE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_announcements_is_lost_sight ON announcements(is_lost_sight) WHERE is_lost_sight = TRUE;

-- Update existing "perdu de vue" announcements based on title pattern
UPDATE announcements 
SET is_lost_sight = TRUE 
WHERE type = 'person' 
  AND title LIKE 'Recherche de%'
  AND description LIKE 'Lien avec cette personne :%';

