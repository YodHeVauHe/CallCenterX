/*
  # Fix Organization Creation RLS Policy

  1. Security Updates
    - Drop all existing conflicting policies on organizations table
    - Create a simple policy that allows authenticated users to create organizations
    - Ensure user_organizations table allows users to link themselves to organizations
    - Add missing INSERT policy for profiles table

  2. Policy Changes
    - Allow any authenticated user to insert into organizations table
    - Allow users to insert themselves into user_organizations table
    - Allow users to create their own profile during registration
*/

-- First, drop ALL existing policies on organizations table to avoid conflicts
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'organizations' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON organizations';
    END LOOP;
END $$;

-- Create new policies for organizations table
CREATE POLICY "authenticated_users_can_create_organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "users_can_view_their_organizations"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (user_has_access_to_organization(id));

CREATE POLICY "users_can_update_their_organizations"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (user_has_access_to_organization(id))
  WITH CHECK (user_has_access_to_organization(id));

-- Ensure RLS is enabled on organizations table
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on user_organizations table to avoid conflicts
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_organizations' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON user_organizations';
    END LOOP;
END $$;

-- Create new policies for user_organizations table
CREATE POLICY "users_can_link_to_organizations"
  ON user_organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_view_their_memberships"
  ON user_organizations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure RLS is enabled on user_organizations table
ALTER TABLE user_organizations ENABLE ROW LEVEL SECURITY;

-- Ensure profiles table has INSERT policy for new user registration
DROP POLICY IF EXISTS "Allow users to create their own profile" ON profiles;

CREATE POLICY "users_can_create_own_profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure the user_has_access_to_organization function exists
CREATE OR REPLACE FUNCTION user_has_access_to_organization(org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM user_organizations 
    WHERE user_id = auth.uid() 
    AND organization_id = org_id
  );
$$;