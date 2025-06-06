import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Pica API configuration
const PICA_API_BASE = 'https://api.picaos.com/v1/passthrough';
const PICA_SECRET_KEY = import.meta.env.VITE_PICA_SECRET_KEY;
const PICA_SUPABASE_CONNECTION_KEY = import.meta.env.VITE_PICA_SUPABASE_CONNECTION_KEY;
const SUPABASE_CLIENT_ID = import.meta.env.VITE_SUPABASE_CLIENT_ID;
const SUPABASE_CLIENT_SECRET = import.meta.env.VITE_SUPABASE_CLIENT_SECRET;

// Action IDs for Pica API
const OAUTH_AUTHORIZE_ACTION_ID = 'conn_mod_def::GC40UNCCy40::InD2wblFRaiRdaOCBwbVZQ';
const OAUTH_TOKEN_ACTION_ID = 'conn_mod_def::GC40UNZVgcY::cBtwTQijQYKWPIG3WYAg';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: string;
}

export class AuthService {
  // Email/Password signup using Supabase client
  static async signUpWithEmail(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'admin', // Default role
        },
      },
    });

    if (error) throw error;
    return data;
  }

  // Email/Password signin using Supabase client
  static async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  // Google OAuth - Step 1: Get authorization URL
  static async getGoogleAuthUrl(redirectUri: string, state?: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: SUPABASE_CLIENT_ID,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: 'openid email profile',
      ...(state && { state }),
    });

    const url = `${PICA_API_BASE}/oauth/authorize?${params.toString()}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-pica-secret': PICA_SECRET_KEY,
          'x-pica-connection-key': PICA_SUPABASE_CONNECTION_KEY,
          'x-pica-action-id': OAUTH_AUTHORIZE_ACTION_ID,
        },
        redirect: 'manual', // Don't follow redirects automatically
      });

      if (response.status === 303 || response.status === 302) {
        const location = response.headers.get('location');
        if (location) {
          return location;
        }
      }

      throw new Error('Failed to get OAuth authorization URL');
    } catch (error) {
      console.error('Error getting Google auth URL:', error);
      throw error;
    }
  }

  // Google OAuth - Step 2: Exchange code for tokens
  static async exchangeCodeForTokens(code: string, redirectUri: string) {
    const data = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: SUPABASE_CLIENT_ID,
      client_secret: SUPABASE_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    });

    try {
      const response = await fetch(`${PICA_API_BASE}/v1/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-pica-secret': PICA_SECRET_KEY,
          'x-pica-connection-key': PICA_SUPABASE_CONNECTION_KEY,
          'x-pica-action-id': OAUTH_TOKEN_ACTION_ID,
        },
        body: data,
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      const tokens = await response.json();
      return tokens;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw error;
    }
  }

  // Sign out
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Get current session
  static async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthUser | null> {
    const session = await this.getCurrentSession();
    if (!session?.user) return null;

    return {
      id: session.user.id,
      email: session.user.email!,
      name: session.user.user_metadata?.name || session.user.user_metadata?.full_name,
      avatar: session.user.user_metadata?.avatar_url,
      role: session.user.user_metadata?.role || 'admin',
    };
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}