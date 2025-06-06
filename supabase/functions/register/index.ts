import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get request body
    const { email, password, name, role } = await req.json()

    // Validate input
    if (!email || !password || !name || !role) {
      return new Response(
        JSON.stringify({ error: 'Email, password, name, and role are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate role
    if (!['admin', 'agent', 'customer'].includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role specified' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Split name into first and last name
    const nameParts = name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    // Attempt to sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: role,
        }
      }
    })

    if (error) {
      console.error('Registration error:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!data.user) {
      return new Response(
        JSON.stringify({ error: 'Registration failed' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // The user profile should be automatically created by the handle_new_user trigger
    // Let's wait a moment and then fetch the profile
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Get user profile from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      // If profile doesn't exist, create it manually
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          first_name: firstName,
          last_name: lastName,
          role: role,
        })

      if (insertError) {
        console.error('Profile creation error:', insertError)
        return new Response(
          JSON.stringify({ error: 'Failed to create user profile' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Fetch the newly created profile
      const { data: newProfile, error: newProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (newProfileError) {
        console.error('New profile fetch error:', newProfileError)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch user profile' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Return session data and user profile
      return new Response(
        JSON.stringify({
          session: data.session,
          user: {
            id: data.user.id,
            email: data.user.email,
            name: name,
            role: newProfile.role,
            avatar: data.user.user_metadata?.avatar_url,
            companyId: newProfile.organization_id,
          }
        }),
        { 
          status: 201, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Return session data and user profile
    return new Response(
      JSON.stringify({
        session: data.session,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
          role: profile.role,
          avatar: data.user.user_metadata?.avatar_url,
          companyId: profile.organization_id,
        }
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})