-- Create ticket_messages table for ticket replies
CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX idx_ticket_messages_user_id ON ticket_messages(user_id);
CREATE INDEX idx_ticket_messages_created_at ON ticket_messages(created_at DESC);

-- Create trigger to update updated_at
CREATE TRIGGER update_ticket_messages_updated_at BEFORE UPDATE ON ticket_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ticket_messages
-- Users can view messages for their own tickets
CREATE POLICY "Users can view messages for their tickets"
  ON ticket_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM support_tickets
      WHERE support_tickets.id = ticket_messages.ticket_id
      AND support_tickets.user_id = auth.uid()
    )
  );

-- Users can create messages for their own tickets
CREATE POLICY "Users can create messages for their tickets"
  ON ticket_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM support_tickets
      WHERE support_tickets.id = ticket_messages.ticket_id
      AND support_tickets.user_id = auth.uid()
    )
    AND auth.uid() = user_id
    AND is_admin = FALSE
  );

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
  ON ticket_messages FOR SELECT
  USING (is_admin());

-- Admins can create messages for any ticket
CREATE POLICY "Admins can create messages"
  ON ticket_messages FOR INSERT
  WITH CHECK (is_admin());

-- Users can update their own messages (only if not admin)
CREATE POLICY "Users can update their own messages"
  ON ticket_messages FOR UPDATE
  USING (auth.uid() = user_id AND is_admin = FALSE)
  WITH CHECK (auth.uid() = user_id AND is_admin = FALSE);

-- Admins can update all messages
CREATE POLICY "Admins can update all messages"
  ON ticket_messages FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

