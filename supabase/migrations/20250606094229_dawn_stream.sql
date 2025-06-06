/*
  # Simplify authentication system

  1. Remove role-based logic
    - Drop policies that depend on the role column
    - Remove role column from profiles table
    - Update user creation function
    - Create simplified organization-based policies

  2. Security
    - Update RLS policies to be organization-based only
    - Maintain user privacy and data isolation
*/

-- First, drop all policies that depend on the role column
DROP POLICY IF EXISTS "Organizations can only be updated by admin members" ON organizations;
DROP POLICY IF EXISTS "Organizations can only be viewed by their members" ON organizations;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_organization" ON profiles;

-- Now we can safely drop the role column
ALTER TABLE profiles DROP COLUMN IF EXISTS role;

-- Update the user creation function to remove role logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create new simplified RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Users can view other profiles in their organization
CREATE POLICY "Users can view profiles in their organization"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    organization_id IS NOT NULL AND
    organization_id IN (
      SELECT organization_id
      FROM profiles
      WHERE id = auth.uid() AND organization_id IS NOT NULL
    )
  );

-- Create new simplified RLS policies for organizations
CREATE POLICY "Users can view their organization"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id
      FROM profiles
      WHERE id = auth.uid() AND organization_id IS NOT NULL
    )
  );

CREATE POLICY "Users can update their organization"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT organization_id
      FROM profiles
      WHERE id = auth.uid() AND organization_id IS NOT NULL
    )
  );

-- Allow users to create organizations
CREATE POLICY "Users can create organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);