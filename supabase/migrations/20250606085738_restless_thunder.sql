/*
  # Fix User Profile Creation Migration

  1. Security
    - Enable RLS on profiles table
    - Add policies for user profile access
    - Create secure trigger function

  2. Functions
    - Create handle_new_user function with proper error handling
    - Use SECURITY DEFINER for elevated privileges

  3. Triggers
    - Create trigger on auth.users for automatic profile creation
    - Handle edge cases and conflicts gracefully
*/

-- First, ensure the profiles table exists and has proper structure
DO $$ 
BEGIN
  -- Check if profiles table exists, if not create it
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    CREATE TABLE profiles (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email text UNIQUE NOT NULL,
      first_name text,
      last_name text,
      organization_id uuid REFERENCES organizations(id),
      role text NOT NULL DEFAULT 'member',
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;

-- Create RLS policies
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view profiles in their organization"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    (organization_id IN (
      SELECT profiles_1.organization_id
      FROM profiles profiles_1
      WHERE (profiles_1.id = auth.uid())
    )) OR (id = auth.uid())
  );

-- Create or replace the user creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
  user_first_name text;
  user_last_name text;
BEGIN
  -- Extract metadata with fallbacks
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'agent');
  user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  user_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');

  -- Insert profile with conflict handling
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    user_first_name,
    user_last_name,
    user_role,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger with proper timing
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_organization ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;