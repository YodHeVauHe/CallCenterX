import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Organization } from '@/types/user';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Check if Supabase is properly configured
        if (!supabase) {
          console.error('Supabase client not initialized');
          if (mounted) setLoading(false);
          return;
        }

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          if (mounted) setLoading(false);
          return;
        }

        console.log('Session check complete:', !!session);

        if (session?.user && mounted) {
          console.log('User found, loading profile...');
          await loadUserProfile(session.user);
        } else if (mounted) {
          console.log('No session found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session);
      
      if (event === 'SIGNED_OUT' || !session) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      if (session?.user && mounted) {
        await loadUserProfile(session.user);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Loading user profile for:', supabaseUser.id);

      // First, try to get or create the profile
      let profile;
      
      // Try to get existing profile
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Profile not found, creating new profile...');
        
        const [firstName, ...lastNameParts] = (supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User').split(' ');
        const lastName = lastNameParts.join(' ');

        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            first_name: firstName,
            last_name: lastName,
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          throw createError;
        }

        profile = newProfile;
      } else if (profileError) {
        console.error('Error loading profile:', profileError);
        throw profileError;
      } else {
        profile = existingProfile;
      }

      console.log('Profile loaded:', profile);

      // Get user organizations
      const { data: userOrgs, error: orgsError } = await supabase
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
        .eq('user_id', supabaseUser.id);

      if (orgsError) {
        console.error('Error loading organizations:', orgsError);
      }

      const organizations: Organization[] = userOrgs?.map((uo: any) => uo.organizations).filter(Boolean) || [];

      console.log('Organizations loaded:', organizations);

      const userData: User = {
        id: profile.id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
        email: profile.email,
        avatar: `https://i.pravatar.cc/150?u=${profile.email}`,
        organizations,
      };

      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
      
      // Fallback: create basic user object
      const userData: User = {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        avatar: `https://i.pravatar.cc/150?u=${supabaseUser.email}`,
        organizations: [],
      };
      
      setUser(userData);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Provide more specific error messages
        if (error.message === 'Invalid login credentials') {
          throw new Error('The email or password you entered is incorrect. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a few minutes before trying again.');
        } else {
          throw new Error(error.message || 'An error occurred during login. Please try again.');
        }
      }
      
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      console.log('Attempting registration for:', email);
      
      const [firstName, ...lastNameParts] = name.trim().split(' ');
      const lastName = lastNameParts.join(' ');

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/setup-organization`,
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: name,
          },
        },
      });

      if (error) {
        console.error('Registration error:', error);
        throw error;
      }

      console.log('Registration successful');

      // The auth state change listener will handle the rest
    } catch (error) {
      console.error('Registration error:', error);
      setLoading(false);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      console.log('Refreshing user...');
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (supabaseUser) {
        await loadUserProfile(supabaseUser);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}