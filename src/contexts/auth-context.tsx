import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Organization } from '@/types/user';
import { api, getToken, setToken, clearToken } from '@/lib/api';

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

  const loadUserFromApi = async () => {
    try {
      const profile = await api.auth.me();
      const organizations: Organization[] = profile.organizations.map((o) => ({
        id: o.id,
        name: o.name,
        slug: o.slug,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      }));

      const userData: User = {
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`.trim() || profile.email,
        email: profile.email,
        avatar: `https://i.pravatar.cc/150?u=${profile.email}`,
        organizations,
      };

      setUser(userData);
      return userData;
    } catch {
      clearToken();
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    loadUserFromApi()
      .then((userData) => {
        const path = window.location.pathname;
        if (userData && (path === '/login' || path === '/register')) {
          if (userData.organizations.length === 0) {
            navigate('/setup-organization', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token } = await api.auth.login(email, password);
      setToken(token);
      const userData = await loadUserFromApi();
      if (userData) {
        if (userData.organizations.length === 0) {
          navigate('/setup-organization', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
    navigate('/login');
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { token } = await api.auth.register(email, password, name);
      setToken(token);
      await loadUserFromApi();
      navigate('/setup-organization', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await loadUserFromApi();
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
