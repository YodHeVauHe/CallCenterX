import { supabase } from './supabase';
import { User, UserRole } from '@/types/user';

export interface AuthResponse {
  user: User | null;
  error?: string;
}

export class AuthService {
  // Email/Password signup using Supabase client
  static async signUpWithEmail(
    email: string,
    password: string,
    name: string,
    role: UserRole = 'agent'
  ): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        const user: User = {
          id: data.user.id,
          name: data.user.user_metadata?.name || name,
          email: data.user.email || email,
          role: data.user.user_metadata?.role || role,
          avatar: data.user.user_metadata?.avatar_url,
          companyId: '1', // Default company ID
        };

        return { user };
      }

      return { user: null, error: 'Failed to create user' };
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  // Email/Password signin using Supabase client
  static async signInWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        const user: User = {
          id: data.user.id,
          name: data.user.user_metadata?.name || 'User',
          email: data.user.email || email,
          role: data.user.user_metadata?.role || 'agent',
          avatar: data.user.user_metadata?.avatar_url,
          companyId: '1', // Default company ID
        };

        return { user };
      }

      return { user: null, error: 'Failed to sign in' };
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  // Google OAuth - Step 1: Get authorization URL
  static getGoogleAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_SUPABASE_CLIENT_ID,
      response_type: 'code',
      redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
      scope: 'openid email profile',
      state: crypto.randomUUID(), // CSRF protection
    });

    return `https://api.picaos.com/v1/passthrough/oauth/authorize?${params.toString()}`;
  }

  // Google OAuth - Step 2: Exchange code for tokens
  static async exchangeCodeForTokens(code: string): Promise<AuthResponse> {
    try {
      const data = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: import.meta.env.VITE_SUPABASE_CLIENT_ID,
        client_secret: import.meta.env.VITE_SUPABASE_CLIENT_SECRET,
        code,
        redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
      });

      const response = await fetch('https://api.picaos.com/v1/passthrough/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-pica-secret': import.meta.env.VITE_PICA_SECRET_KEY,
          'x-pica-connection-key': import.meta.env.VITE_PICA_SUPABASE_CONNECTION_KEY,
          'x-pica-action-id': 'conn_mod_def::GC40UNZVgcY::cBtwTQijQYKWPIG3WYAg',
        },
        body: data,
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for tokens');
      }

      const tokenData = await response.json();
      
      // Use the access token to get user info from Supabase
      const { data: userData, error } = await supabase.auth.setSession({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (userData.user) {
        const user: User = {
          id: userData.user.id,
          name: userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || 'User',
          email: userData.user.email || '',
          role: userData.user.user_metadata?.role || 'agent',
          avatar: userData.user.user_metadata?.avatar_url,
          companyId: '1', // Default company ID
        };

        return { user };
      }

      return { user: null, error: 'Failed to authenticate with Google' };
    } catch (error) {
      return { user: null, error: 'Failed to complete Google authentication' };
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  // Get current session
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        return {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          role: user.user_metadata?.role || 'agent',
          avatar: user.user_metadata?.avatar_url,
          companyId: '1', // Default company ID
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}