-- Add videos field to announcements table
-- Videos will be stored as an array of YouTube/Vimeo URLs
ALTER TABLE announcements
ADD COLUMN videos TEXT[] DEFAULT '{}';

-- Add comment
COMMENT ON COLUMN announcements.videos IS 'Array of YouTube or Vimeo video URLs';

