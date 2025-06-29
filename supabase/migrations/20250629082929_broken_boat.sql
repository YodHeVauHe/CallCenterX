/*
  # Fix RLS policies for organization creation

  1. Security Updates
    - Add missing INSERT policy for organizations table to allow authenticated users to create organizations
    - Ensure user_organizations table has proper INSERT policy
    - Add missing function for organization access checking

  2. Changes
    - Create user_has_access_to_organization function if it doesn't exist
    - Update organizations INSERT policy to allow authenticated users
    - Ensure user_organizations INSERT policy is properly configured
*/

-- Create the user_has_access_to_organization function if it doesn't exist
CREATE OR REPLACE FUNCTION user_has_access_to_organization(org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM user_organizations 
    WHERE user_id = auth.uid() 
    AND organization_id = org_id
  );
$$;

-- Drop existing INSERT policy for organizations if it exists
DROP POLICY IF EXISTS "Allow authenticated users to create organizations" ON organizations;

-- Create new INSERT policy for organizations that allows any authenticated user to create an organization
CREATE POLICY "Allow authenticated users to create organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Ensure the user_organizations table has the correct INSERT policy
DROP POLICY IF EXISTS "Allow users to link themselves to organizations" ON user_organizations;

CREATE POLICY "Allow users to link themselves to organizations"
  ON user_organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Ensure profiles table has proper INSERT policy for new user registration
DROP POLICY IF EXISTS "Allow users to create their own profile" ON profiles;

CREATE POLICY "Allow users to create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);