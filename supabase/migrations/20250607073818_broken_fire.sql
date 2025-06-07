/*
  # Fix profiles table and policies for multi-organization support

  1. Changes Made
    - Remove role column from profiles table if it exists
    - Update user creation function to remove role logic
    - Drop and recreate RLS policies to avoid conflicts
    - Add organization-based access policies

  2. Security
    - Users can view and update their own profile
    - Users can view profiles of others in their organization
    - Proper RLS policies for multi-organization support
*/

-- Update profiles table structure
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

-- Drop all existing policies on profiles table to avoid conflicts
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_organization" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in shared organizations" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;

-- Create new policies with unique names
CREATE POLICY "profiles_own_select"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_own_update"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Note: Organization-based policy will be added when we implement the organization_id column
-- For now, we'll keep the existing shared organization policy structure
CREATE POLICY "profiles_shared_org_select"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT uo.user_id
      FROM user_organizations uo
      WHERE uo.organization_id IN (
        SELECT user_organizations.organization_id
        FROM user_organizations
        WHERE user_organizations.user_id = auth.uid()
      )
    )
  );