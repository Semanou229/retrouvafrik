-- Add read status to ticket_messages
ALTER TABLE ticket_messages
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_ticket_messages_is_read ON ticket_messages(ticket_id, is_read) WHERE is_read = FALSE;

-- Add function to check if ticket has unread messages for a user
CREATE OR REPLACE FUNCTION ticket_has_unread_messages(ticket_id_param UUID, user_id_param UUID, is_admin_param BOOLEAN)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  IF is_admin_param THEN
    -- Admin sees unread messages from users
    SELECT COUNT(*) INTO unread_count
    FROM ticket_messages
    WHERE ticket_messages.ticket_id = ticket_id_param
    AND ticket_messages.is_admin = FALSE
    AND ticket_messages.is_read = FALSE;
  ELSE
    -- User sees unread messages from admins
    SELECT COUNT(*) INTO unread_count
    FROM ticket_messages
    WHERE ticket_messages.ticket_id = ticket_id_param
    AND ticket_messages.is_admin = TRUE
    AND ticket_messages.is_read = FALSE;
  END IF;
  
  RETURN unread_count > 0;
END;
$$;

