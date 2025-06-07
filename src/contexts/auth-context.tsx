import { createContext, useContext, useEffect, useState } from 'react';
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

  useEffect(() => {
    // For now, let's use mock authentication to get the app working
    // This simulates checking for an existing session
    const checkUser = async () => {
      try {
        console.log('Checking for existing user session...');
        
        // Check if user is stored in localStorage (mock session)
        const storedUser = localStorage.getItem('mock_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('Found stored user:', userData);
          setUser(userData);
        } else {
          console.log('No stored user found');
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting login for:', email);
      
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
        
        console.log('Login successful, setting user:', mockUser);
        setUser(mockUser);
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
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
      console.log('Logging out...');
      setUser(null);
      localStorage.removeItem('mock_user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      console.log('Attempting registration for:', email);
      
      // Mock registration - in production this would be Supabase
      if (email && password && name) {
        const mockUser: User = {
          id: '1',
          name,
          email,
          avatar: 'https://i.pravatar.cc/150?img=68',
          organizations: [], // New users start with no organizations
        };
        
        console.log('Registration successful, setting user:', mockUser);
        setUser(mockUser);
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
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
      console.log('Refreshing user...');
      // Mock refresh - in production this would fetch from Supabase
      const storedUser = localStorage.getItem('mock_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('Refreshed user data:', userData);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  console.log('Auth context state:', { user: !!user, loading });

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