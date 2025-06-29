/*
  # Fix organization insert policy

  1. Security Updates
    - Drop existing INSERT policy that may be causing issues
    - Create new INSERT policy that allows authenticated users to create organizations
    - Ensure the policy is properly configured for user organization creation

  2. Changes
    - Remove problematic INSERT policy
    - Add new INSERT policy with proper permissions for authenticated users
*/

-- Drop the existing INSERT policy if it exists
DROP POLICY IF EXISTS "authenticated_users_can_create_organizations" ON organizations;

-- Create a new INSERT policy that allows authenticated users to create organizations
CREATE POLICY "authenticated_users_can_create_organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Ensure RLS is enabled on the organizations table
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;