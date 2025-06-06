import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { email, password } = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Authenticate user
    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return new Response(
        JSON.stringify({ error: authError.message }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!authData.user || !authData.session) {
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user profile' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user organizations
    const { data: userOrgs, error: orgsError } = await supabaseClient
      .from('user_organizations')
      .select(`
        organization_id,
        organizations (
          id,
          name,
          slug,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', authData.user.id)

    if (orgsError) {
      console.error('Error fetching organizations:', orgsError)
    }

    const organizations = userOrgs?.map(uo => ({
      id: uo.organizations.id,
      name: uo.organizations.name,
      slug: uo.organizations.slug,
      createdAt: uo.organizations.created_at,
      updatedAt: uo.organizations.updated_at,
    })) || []

    const userData = {
      id: profile.id,
      name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
      email: profile.email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${profile.email}`,
      organizations,
    }

    return new Response(
      JSON.stringify({
        user: userData,
        session: authData.session,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Login error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})