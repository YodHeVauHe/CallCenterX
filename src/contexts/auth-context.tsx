import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { User, UserRole } from '@/types/user';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => Promise<void>;
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

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user profile from database
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            const userData: User = {
              id: session.user.id,
              email: session.user.email!,
              name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
              role: profile.role,
              avatar: session.user.user_metadata?.avatar_url,
              companyId: profile.organization_id,
            };
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
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Fetch user profile from database
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            const userData: User = {
              id: session.user.id,
              email: session.user.email!,
              name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
              role: profile.role,
              avatar: session.user.user_metadata?.avatar_url,
              companyId: profile.organization_id,
            };
            setUser(userData);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Call the login Edge Function
      const response = await fetch(`${supabaseUrl}/functions/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Set the session in the client
      const { error } = await supabase.auth.setSession(data.session);
      
      if (error) {
        throw error;
      }

      // Set user data
      setUser(data.user);
      
      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/dashboard');
      } else if (data.user.role === 'agent') {
        navigate('/agent-dashboard');
      } else {
        navigate('/customer');
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

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => {
    try {
      setLoading(true);
      
      // Call the register Edge Function
      const response = await fetch(`${supabaseUrl}/functions/v1/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ email, password, name, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Set the session in the client if one was returned
      if (data.session) {
        const { error } = await supabase.auth.setSession(data.session);
        
        if (error) {
          throw error;
        }

        // Set user data
        setUser(data.user);
        
        // Redirect based on role
        if (data.user.role === 'admin') {
          navigate('/dashboard');
        } else if (data.user.role === 'agent') {
          navigate('/agent-dashboard');
        } else {
          navigate('/customer');
        }
      } else {
        // If no session (email confirmation required), redirect to login
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
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