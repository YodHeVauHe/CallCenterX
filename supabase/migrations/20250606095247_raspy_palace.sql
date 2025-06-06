/*
  # Multiple Organizations Support

  1. Schema Changes
    - Remove role column from profiles table
    - Remove organization_id column from profiles table
    - Create user_organizations junction table for many-to-many relationship
    - Update RLS policies for new structure

  2. Security
    - Enable RLS on user_organizations table
    - Create helper function for organization access checks
    - Update all table policies to use new organization membership model

  3. Functions
    - Update handle_new_user function to remove role/organization logic
    - Create user_has_access_to_organization helper function
*/

-- First, drop all existing policies that depend on role or organization_id columns
DROP POLICY IF EXISTS "Organizations can only be updated by admin members" ON organizations;
DROP POLICY IF EXISTS "Organizations can only be viewed by their members" ON organizations;
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
DROP POLICY IF EXISTS "Users can update their organization" ON organizations;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_organization" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;

-- Drop policies on other tables that depend on profiles.organization_id
DROP POLICY IF EXISTS "Users can create knowledge bases in their organization" ON knowledge_bases;
DROP POLICY IF EXISTS "Users can delete knowledge bases in their organization" ON knowledge_bases;
DROP POLICY IF EXISTS "Users can update knowledge bases in their organization" ON knowledge_bases;
DROP POLICY IF EXISTS "Users can view knowledge bases in their organization" ON knowledge_bases;
DROP POLICY IF EXISTS "System can create call events" ON call_events;
DROP POLICY IF EXISTS "Users can view call events in their organization" ON call_events;
DROP POLICY IF EXISTS "Users can view document embeddings in their organization" ON document_embeddings;
DROP POLICY IF EXISTS "Users can create calls in their organization" ON calls;
DROP POLICY IF EXISTS "Users can update calls in their organization" ON calls;
DROP POLICY IF EXISTS "Users can view calls in their organization" ON calls;
DROP POLICY IF EXISTS "Users can create agent-knowledge base mappings in their organiz" ON agent_knowledge_bases;
DROP POLICY IF EXISTS "Users can delete agent-knowledge base mappings in their organiz" ON agent_knowledge_bases;
DROP POLICY IF EXISTS "Users can view agent-knowledge base mappings in their organizat" ON agent_knowledge_bases;
DROP POLICY IF EXISTS "Users can create agents in their organization" ON agents;
DROP POLICY IF EXISTS "Users can delete agents in their organization" ON agents;
DROP POLICY IF EXISTS "Users can update agents in their organization" ON agents;
DROP POLICY IF EXISTS "Users can view agents in their organization" ON agents;
DROP POLICY IF EXISTS "Users can create documents in their organization" ON documents;
DROP POLICY IF EXISTS "Users can delete documents in their organization" ON documents;
DROP POLICY IF EXISTS "Users can update documents in their organization" ON documents;
DROP POLICY IF EXISTS "Users can view documents in their organization" ON documents;

-- Now safely remove columns from profiles table
ALTER TABLE profiles DROP COLUMN IF EXISTS role;
ALTER TABLE profiles DROP COLUMN IF EXISTS organization_id;

-- Create user_organizations junction table
CREATE TABLE IF NOT EXISTS user_organizations (
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, organization_id)
);

-- Enable RLS on user_organizations
ALTER TABLE user_organizations ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_organizations_user ON user_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_organizations_org ON user_organizations(organization_id);

-- Update the user creation function to remove role/organization logic
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

-- Create helper function to check organization access
CREATE OR REPLACE FUNCTION user_has_access_to_organization(org_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_organizations 
    WHERE user_id = auth.uid() AND organization_id = org_id
  );
END;
$$;

-- RLS policies for user_organizations table
CREATE POLICY "Users can view their own organization memberships"
  ON user_organizations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own organization memberships"
  ON user_organizations
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- RLS policies for profiles table
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

CREATE POLICY "Users can view profiles in shared organizations"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT uo.user_id
      FROM user_organizations uo
      WHERE uo.organization_id IN (
        SELECT organization_id
        FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- RLS policies for organizations table
CREATE POLICY "Users can view organizations they belong to"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (user_has_access_to_organization(id));

CREATE POLICY "Users can update organizations they belong to"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (user_has_access_to_organization(id));

CREATE POLICY "Users can create organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS policies for knowledge_bases table
CREATE POLICY "Users can create knowledge bases in their organizations"
  ON knowledge_bases
  FOR INSERT
  TO authenticated
  WITH CHECK (user_has_access_to_organization(organization_id));

CREATE POLICY "Users can view knowledge bases in their organizations"
  ON knowledge_bases
  FOR SELECT
  TO authenticated
  USING (user_has_access_to_organization(organization_id));

CREATE POLICY "Users can update knowledge bases in their organizations"
  ON knowledge_bases
  FOR UPDATE
  TO authenticated
  USING (user_has_access_to_organization(organization_id));

CREATE POLICY "Users can delete knowledge bases in their organizations"
  ON knowledge_bases
  FOR DELETE
  TO authenticated
  USING (user_has_access_to_organization(organization_id));

-- RLS policies for agents table
CREATE POLICY "Users can create agents in their organizations"
  ON agents
  FOR INSERT
  TO authenticated
  WITH CHECK (user_has_access_to_organization(organization_id));

CREATE POLICY "Users can view agents in their organizations"
  ON agents
  FOR SELECT
  TO authenticated
  USING (user_has_access_to_organization(organization_id));

CREATE POLICY "Users can update agents in their organizations"
  ON agents
  FOR UPDATE
  TO authenticated
  USING (user_has_access_to_organization(organization_id));

CREATE POLICY "Users can delete agents in their organizations"
  ON agents
  FOR DELETE
  TO authenticated
  USING (user_has_access_to_organization(organization_id));

-- RLS policies for calls table
CREATE POLICY "Users can create calls in their organizations"
  ON calls
  FOR INSERT
  TO authenticated
  WITH CHECK (user_has_access_to_organization(organization_id));

CREATE POLICY "Users can view calls in their organizations"
  ON calls
  FOR SELECT
  TO authenticated
  USING (user_has_access_to_organization(organization_id));

CREATE POLICY "Users can update calls in their organizations"
  ON calls
  FOR UPDATE
  TO authenticated
  USING (user_has_access_to_organization(organization_id));

-- RLS policies for documents table
CREATE POLICY "Users can create documents in their organizations"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    knowledge_base_id IN (
      SELECT id FROM knowledge_bases 
      WHERE user_has_access_to_organization(organization_id)
    )
  );

CREATE POLICY "Users can view documents in their organizations"
  ON documents
  FOR SELECT
  TO authenticated
  USING (
    knowledge_base_id IN (
      SELECT id FROM knowledge_bases 
      WHERE user_has_access_to_organization(organization_id)
    )
  );

CREATE POLICY "Users can update documents in their organizations"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (
    knowledge_base_id IN (
      SELECT id FROM knowledge_bases 
      WHERE user_has_access_to_organization(organization_id)
    )
  );

CREATE POLICY "Users can delete documents in their organizations"
  ON documents
  FOR DELETE
  TO authenticated
  USING (
    knowledge_base_id IN (
      SELECT id FROM knowledge_bases 
      WHERE user_has_access_to_organization(organization_id)
    )
  );

-- RLS policies for document_embeddings table
CREATE POLICY "Users can view document embeddings in their organizations"
  ON document_embeddings
  FOR SELECT
  TO authenticated
  USING (
    document_id IN (
      SELECT d.id FROM documents d
      JOIN knowledge_bases kb ON d.knowledge_base_id = kb.id
      WHERE user_has_access_to_organization(kb.organization_id)
    )
  );

-- RLS policies for call_events table
CREATE POLICY "System can create call events"
  ON call_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view call events in their organizations"
  ON call_events
  FOR SELECT
  TO authenticated
  USING (
    call_id IN (
      SELECT id FROM calls 
      WHERE user_has_access_to_organization(organization_id)
    )
  );

-- RLS policies for agent_knowledge_bases table
CREATE POLICY "Users can create agent-knowledge base mappings in their organizations"
  ON agent_knowledge_bases
  FOR INSERT
  TO authenticated
  WITH CHECK (
    agent_id IN (
      SELECT id FROM agents 
      WHERE user_has_access_to_organization(organization_id)
    ) AND
    knowledge_base_id IN (
      SELECT id FROM knowledge_bases 
      WHERE user_has_access_to_organization(organization_id)
    )
  );

CREATE POLICY "Users can view agent-knowledge base mappings in their organizations"
  ON agent_knowledge_bases
  FOR SELECT
  TO authenticated
  USING (
    agent_id IN (
      SELECT id FROM agents 
      WHERE user_has_access_to_organization(organization_id)
    )
  );

CREATE POLICY "Users can delete agent-knowledge base mappings in their organizations"
  ON agent_knowledge_bases
  FOR DELETE
  TO authenticated
  USING (
    agent_id IN (
      SELECT id FROM agents 
      WHERE user_has_access_to_organization(organization_id)
    )
  );