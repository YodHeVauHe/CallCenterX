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

        // Get initial session with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 10000)
        );

        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;

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
      
      if (session?.user && mounted) {
        await loadUserProfile(session.user);
      } else if (mounted) {
        setUser(null);
        setLoading(false);
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

      // Get user profile with timeout
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile load timeout')), 15000)
      );

      const { data: profile, error: profileError } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]) as any;

      if (profileError) {
        console.error('Error loading profile:', profileError);
        
        // If profile doesn't exist, create a basic user object
        const userData: User = {
          id: supabaseUser.id,
          name: supabaseUser.email?.split('@')[0] || 'User',
          email: supabaseUser.email || '',
          avatar: `https://i.pravatar.cc/150?u=${supabaseUser.email}`,
          organizations: [],
        };
        
        setUser(userData);
        setLoading(false);
        return;
      }

      console.log('Profile loaded:', profile);

      // Get user organizations with timeout
      const orgsPromise = supabase
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

      const { data: userOrgs, error: orgsError } = await Promise.race([
        orgsPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Organizations load timeout')), 15000)
        )
      ]) as any;

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
        name: supabaseUser.email?.split('@')[0] || 'User',
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
        console.error('Login error:', error);
        throw error;
      }

      console.log('Login successful');

      if (data.user) {
        await loadUserProfile(data.user);
        
        // Navigate based on whether user has organizations
        const { data: userOrgs } = await supabase
          .from('user_organizations')
          .select('organization_id')
          .eq('user_id', data.user.id);

        if (userOrgs && userOrgs.length > 0) {
          navigate('/dashboard');
        } else {
          navigate('/setup-organization');
        }
      }
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
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        console.error('Registration error:', error);
        throw error;
      }

      console.log('Registration successful');

      if (data.user) {
        // User will be automatically logged in after email confirmation
        // For now, redirect to setup organization
        navigate('/setup-organization');
      }
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