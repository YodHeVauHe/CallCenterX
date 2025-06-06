import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Organization } from '@/types/user';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  createOrganization: (name: string, type: string, size?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for stored session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('callcenterx_user');
    const storedToken = localStorage.getItem('callcenterx_token');
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('callcenterx_user');
        localStorage.removeItem('callcenterx_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      
      if (data.user && data.session) {
        // Store session data
        localStorage.setItem('callcenterx_user', JSON.stringify(data.user));
        localStorage.setItem('callcenterx_token', data.session.access_token);
        
        setUser(data.user);
        
        // Redirect based on organization status
        if (data.user.organizations.length === 0) {
          navigate('/setup-organization');
        } else {
          navigate('/dashboard');
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
      // Call logout endpoint if available
      const token = localStorage.getItem('callcenterx_token');
      if (token) {
        try {
          await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error('Logout endpoint error:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('callcenterx_user');
      localStorage.removeItem('callcenterx_token');
      setUser(null);
      navigate('/login');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const data = await response.json();
      
      if (data.user && data.session) {
        // Store session data
        localStorage.setItem('callcenterx_user', JSON.stringify(data.user));
        localStorage.setItem('callcenterx_token', data.session.access_token);
        
        setUser(data.user);
        navigate('/setup-organization');
      } else if (data.user && !data.session) {
        // Email confirmation required
        throw new Error('Please check your email for a verification link before signing in.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('callcenterx_token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('callcenterx_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const createOrganization = async (name: string, type: string, size?: string) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      setLoading(true);
      const token = localStorage.getItem('callcenterx_token');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-organization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim(), type, size }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create organization');
      }

      // Refresh user data to get the new organization
      await refreshUser();

    } catch (error) {
      console.error('Create organization error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      register, 
      refreshUser, 
      createOrganization 
    }}>
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