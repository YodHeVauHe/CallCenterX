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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // For now, let's use mock authentication to get the app working
    // This simulates checking for an existing session
    const checkUser = async () => {
      try {
        // Check if user is stored in localStorage (mock session)
        const storedUser = localStorage.getItem('mock_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Mock authentication - in production this would be Supabase
      if (email && password) {
        const mockUser: User = {
          id: '1',
          name: 'Demo User',
          email,
          avatar: 'https://i.pravatar.cc/150?img=68',
          organizations: [
            {
              id: '1',
              name: 'Demo Organization',
              slug: 'demo-org',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          ],
        };
        
        setUser(mockUser);
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        
        // Redirect to dashboard since user has organizations
        navigate('/dashboard');
      } else {
        throw new Error('Invalid credentials');
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
      setUser(null);
      localStorage.removeItem('mock_user');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Mock registration - in production this would be Supabase
      if (email && password && name) {
        const mockUser: User = {
          id: '1',
          name,
          email,
          avatar: 'https://i.pravatar.cc/150?img=68',
          organizations: [], // New users start with no organizations
        };
        
        setUser(mockUser);
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        
        // Redirect to organization setup since user has no organizations
        navigate('/setup-organization');
      } else {
        throw new Error('All fields are required');
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
      // Mock refresh - in production this would fetch from Supabase
      const storedUser = localStorage.getItem('mock_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
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