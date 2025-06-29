import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Organization } from '@/types/user';
import { supabase } from '@/lib/supabase';

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
        console.log('🔄 Initializing Supabase auth...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          if (mounted) setLoading(false);
          return;
        }

        if (session?.user && mounted) {
          console.log('✅ Found existing session for user:', session.user.email);
          await loadUserProfile(session.user.id);
        } else {
          console.log('ℹ️ No existing session found');
          if (mounted) setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (mounted) setLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user && mounted) {
        await loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT' && mounted) {
        setUser(null);
        setLoading(false);
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('🔄 Loading user profile for:', userId);
      
      // Get user profile with shorter timeout and better error handling
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (profileError) {
        console.error('❌ Error loading profile:', profileError);
        
        // If profile doesn't exist, try to create one from auth user
        if (profileError.code === 'PGRST116') { // No rows returned
          console.log('🔄 Profile not found, attempting to create one...');
          
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: authUser.id,
                email: authUser.email!,
                first_name: authUser.user_metadata?.first_name || '',
                last_name: authUser.user_metadata?.last_name || '',
              })
              .select()
              .single();
            
            if (createError) {
              console.error('❌ Error creating profile:', createError);
              setLoading(false);
              return;
            }
            
            console.log('✅ Profile created successfully:', newProfile);
            // Use the newly created profile
            profile = newProfile;
          } else {
            console.error('❌ No auth user found to create profile');
            setLoading(false);
            return;
          }
        } else {
          // Other errors (timeout, permission, etc.)
          console.error('❌ Profile query failed:', profileError);
          setLoading(false);
          return;
        }
      }

      console.log('✅ Profile loaded:', profile);

      // Try to load organizations with timeout and fallback
      let organizations: Organization[] = [];
      
      try {
        console.log('🔄 Loading organizations for user:', userId);
        
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
          .eq('user_id', userId)
          ;

        if (orgsError) {
          console.error('⚠️ Error loading organizations:', orgsError);
          organizations = [];
        } else if (userOrgs && Array.isArray(userOrgs)) {
          console.log('📊 Raw organization data:', userOrgs);
          organizations = userOrgs
            .map(uo => uo.organizations)
            .filter(Boolean) as Organization[];
          console.log('✅ Processed organizations:', organizations);
        } else {
          console.log('ℹ️ No organizations found for user');
          organizations = [];
        }
      } catch (orgError) {
        console.error('❌ Failed to load organizations (using fallback):', orgError);
        organizations = [];
      }

      const userData: User = {
        id: profile.id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
        email: profile.email,
        avatar: `https://i.pravatar.cc/150?u=${profile.email}`,
        organizations,
      };

      console.log('✅ Final user data:', userData);
      setUser(userData);
      setLoading(false);

      // Handle navigation based on user state
      const currentPath = window.location.pathname;
      console.log('🧭 Current path:', currentPath);
      
      // Don't redirect if user is already on the right page
      if (currentPath === '/login' || currentPath === '/register') {
        if (userData.organizations.length === 0) {
          console.log('🔄 Redirecting to setup organization');
          navigate('/setup-organization', { replace: true });
        } else {
          console.log('🔄 Redirecting to dashboard');
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      
      // If it's a timeout or connection error, try to sign out the user
      if (error instanceof Error && (
        error.message.includes('timeout') || 
        error.message.includes('network') ||
        error.message.includes('fetch')
      )) {
        console.log('🔄 Connection issue detected, signing out user...');
        await supabase.auth.signOut();
      }
      
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔄 Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        throw error;
      }

      if (data.user) {
        console.log('✅ Login successful for:', data.user.email);
        // User profile will be loaded by the auth state change listener
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🔄 Logging out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Logout error:', error);
        throw error;
      }
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      console.log('🔄 Attempting registration for:', email);
      
      const [firstName, ...lastNameParts] = name.split(' ');
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
        console.error('❌ Registration error:', error);
        throw error;
      }

      if (data.user) {
        console.log('✅ Registration successful for:', data.user.email);
        // User profile will be loaded by the auth state change listener
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      setLoading(false);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      console.log('🔄 Refreshing user...');
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        await loadUserProfile(authUser.id);
      } else {
        console.log('ℹ️ No user to refresh');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Error refreshing user:', error);
      setLoading(false);
    }
  };

  console.log('🔍 Auth context state:', { 
    hasUser: !!user, 
    loading, 
    userEmail: user?.email,
    organizationCount: user?.organizations?.length || 0
  });

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