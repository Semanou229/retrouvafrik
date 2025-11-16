-- Add 'other' type to support_tickets CHECK constraint
ALTER TABLE support_tickets 
DROP CONSTRAINT IF EXISTS support_tickets_type_check;

ALTER TABLE support_tickets 
ADD CONSTRAINT support_tickets_type_check 
CHECK (type IN ('technical', 'announcement_review', 'modification_request', 'fraud', 'other'));

