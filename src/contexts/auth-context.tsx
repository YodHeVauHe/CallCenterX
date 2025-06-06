import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { User, Organization } from '@/types/user';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserWithOrganizations = async (userId: string): Promise<User | null> => {
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      if (!profile) {
        console.log('No profile found for user:', userId);
        return null;
      }

      // Fetch user's organizations through the junction table
      const { data: userOrganizations, error: userOrgsError } = await supabase
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
        .eq('user_id', userId);

      if (userOrgsError) {
        console.error('Error fetching user organizations:', userOrgsError);
        // Don't fail completely if organizations can't be fetched
      }

      const organizations: Organization[] = userOrganizations
        ? userOrganizations
            .filter(uo => uo.organizations) // Filter out null organizations
            .map(uo => ({
              id: uo.organizations.id,
              name: uo.organizations.name,
              slug: uo.organizations.slug,
              createdAt: uo.organizations.created_at,
              updatedAt: uo.organizations.updated_at,
            }))
        : [];

      return {
        id: profile.id,
        email: profile.email,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
        avatar: undefined, // Will be set from auth user metadata if available
        organizations,
      };
    } catch (error) {
      console.error('Error fetching user with organizations:', error);
      return null;
    }
  };

  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userData = await fetchUserWithOrganizations(session.user.id);
        if (userData) {
          userData.avatar = session.user.user_metadata?.avatar_url;
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userData = await fetchUserWithOrganizations(session.user.id);
          if (userData) {
            userData.avatar = session.user.user_metadata?.avatar_url;
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setLoading(false);
        } else if (event === 'SIGNED_IN' && session?.user) {
          try {
            const userData = await fetchUserWithOrganizations(session.user.id);
            if (userData) {
              userData.avatar = session.user.user_metadata?.avatar_url;
              setUser(userData);
            }
          } catch (error) {
            console.error('Error fetching user data on sign in:', error);
          } finally {
            setLoading(false);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Fetch user data with organizations
      const userData = await fetchUserWithOrganizations(data.user.id);
      if (userData) {
        userData.avatar = data.user.user_metadata?.avatar_url;
        setUser(userData);

        // Redirect based on whether user has organizations
        if (userData.organizations.length > 0) {
          navigate('/dashboard');
        } else {
          navigate('/setup-organization');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Split name into first and last name
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) {
        throw error;
      }

      // If email confirmation is required, show message
      if (!data.session) {
        throw new Error('Please check your email to confirm your account before signing in.');
      }

      // If user is immediately signed in, redirect to organization setup
      navigate('/setup-organization');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
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