/*
  # Simplify Authentication System

  1. Changes
    - Remove role-based logic from profiles table
    - Update profiles table to focus on organization membership via junction table
    - Update RLS policies to use user_organizations table
    - Update trigger function to remove role assignment

  2. Security
    - Maintain RLS on profiles table
    - Update policies for organization-based access via user_organizations
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

-- Update RLS policies to be simpler and organization-based
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_organization" ON profiles;

-- Users can always view and update their own profile
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

-- Users can view other profiles in their shared organizations
CREATE POLICY "Users can view profiles in their organization"
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