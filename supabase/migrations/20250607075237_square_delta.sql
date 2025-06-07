/*
  # Fix RLS Policies for Organizations and User Organizations

  1. Security Updates
    - Update RLS policies for organizations table to allow authenticated users to create organizations
    - Update RLS policies for user_organizations table to allow users to link themselves to organizations
    - Ensure proper access control for all operations

  2. Policy Changes
    - Allow authenticated users to insert organizations
    - Allow users to insert themselves into user_organizations
    - Maintain existing security for other operations
*/

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Allow authenticated users to create organizations" ON organizations;
DROP POLICY IF EXISTS "Allow users to link themselves to organizations" ON user_organizations;

-- Create updated policy for organizations table
CREATE POLICY "Allow authenticated users to create organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Ensure user_organizations table has proper RLS policies
CREATE POLICY "Allow users to link themselves to organizations"
  ON user_organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Update existing policies to be more permissive for organization creation
DROP POLICY IF EXISTS "Users can update organizations they belong to" ON organizations;
CREATE POLICY "Users can update organizations they belong to"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (user_has_access_to_organization(id))
  WITH CHECK (user_has_access_to_organization(id));

-- Ensure the user_has_access_to_organization function exists and works correctly
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