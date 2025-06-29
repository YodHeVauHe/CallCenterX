/*
  # Fix Organization Creation RLS Policy

  1. Security Updates
    - Drop and recreate the INSERT policy for organizations table
    - Ensure authenticated users can create organizations
    - Fix any policy conflicts

  2. Changes
    - Allow any authenticated user to insert into organizations table
    - Ensure proper RLS policy structure
*/

-- Drop existing INSERT policy for organizations
DROP POLICY IF EXISTS "Allow authenticated users to create organizations" ON organizations;
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;

-- Create a simple INSERT policy that allows any authenticated user to create an organization
CREATE POLICY "authenticated_users_can_create_organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Ensure RLS is enabled on organizations table
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Also ensure the user_organizations table allows linking
DROP POLICY IF EXISTS "Allow users to link themselves to organizations" ON user_organizations;
DROP POLICY IF EXISTS "Users can manage their own organization memberships" ON user_organizations;

CREATE POLICY "users_can_link_to_organizations"
  ON user_organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled on user_organizations table
ALTER TABLE user_organizations ENABLE ROW LEVEL SECURITY;