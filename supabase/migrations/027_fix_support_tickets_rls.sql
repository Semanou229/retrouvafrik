-- Fix RLS policies for support_tickets table
-- Replace direct auth.users access with is_admin() function

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admins can view all tickets" ON support_tickets;
DROP POLICY IF EXISTS "Admins can update all tickets" ON support_tickets;
DROP POLICY IF EXISTS "Admins can delete tickets" ON support_tickets;

-- Recreate admin policies using is_admin() function
CREATE POLICY "Admins can view all tickets"
  ON support_tickets FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update all tickets"
  ON support_tickets FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete tickets"
  ON support_tickets FOR DELETE
  USING (is_admin());

-- Ensure the INSERT policy allows authenticated users to create tickets
-- Drop and recreate if needed
DROP POLICY IF EXISTS "Users can create tickets" ON support_tickets;
CREATE POLICY "Users can create tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

