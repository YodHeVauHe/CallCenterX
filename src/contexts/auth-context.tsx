import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService, AuthUser } from '@/lib/auth';
import { UserRole } from '@/types/user';

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize auth state and listen for changes
    const initializeAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      
      if (code && window.location.pathname === '/oauth/callback') {
        try {
          setLoading(true);
          const redirectUri = `${window.location.origin}/oauth/callback`;
          const tokens = await AuthService.exchangeCodeForTokens(code, redirectUri);
          
          // The tokens should automatically trigger the auth state change
          // Navigate to dashboard after successful OAuth
          navigate('/dashboard');
        } catch (error) {
          console.error('OAuth callback error:', error);
          navigate('/login?error=oauth_failed');
        } finally {
          setLoading(false);
        }
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await AuthService.signInWithEmail(email, password);
      // User state will be updated via onAuthStateChange
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const redirectUri = `${window.location.origin}/oauth/callback`;
      const authUrl = await AuthService.getGoogleAuthUrl(redirectUri);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.signOut();
    navigate('/login');
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => {
    try {
      setLoading(true);
      await AuthService.signUpWithEmail(email, password, name);
      // User state will be updated via onAuthStateChange
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout, register }}>
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