import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Layout } from '@/components/layout';
import { Dashboard } from '@/pages/dashboard';
import { Login } from '@/pages/auth/login';
import { Register } from '@/pages/auth/register';
import { SetupOrganization } from '@/pages/setup-organization';
import { KnowledgeBase } from '@/pages/knowledge-base';
import { CallsPage } from '@/pages/calls';
import { Settings } from '@/pages/settings';
import { NotFound } from '@/pages/not-found';
import { Analytics } from '@/pages/analytics';
import { CustomerInterface } from '@/pages/customer-interface';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      console.log('User authenticated, redirecting...', user);
      
      // If user has organizations, go to dashboard
      if (user.organizations.length > 0) {
        navigate('/dashboard', { replace: true });
      } else {
        // If no organizations, go to setup
        navigate('/setup-organization', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium">Loading CallCenterX...</p>
            <p className="text-sm text-muted-foreground">Connecting to your workspace</p>
          </div>
        </div>
      </div>
    );
  }

  // If we get here and user is null, redirect to login
  if (!user) {
    navigate('/login', { replace: true });
  }

  return null;
};

const ProtectedRoute = ({
  children,
  requiresOrganization = true,
}: {
  children: React.ReactNode;
  requiresOrganization?: boolean;
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium">Loading CallCenterX...</p>
            <p className="text-sm text-muted-foreground">Connecting to your workspace</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiresOrganization && user.organizations.length === 0) {
    return <Navigate to="/setup-organization" replace />;
  }

  return <>{children}</>;
};

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginWithRedirect />} />
      <Route path="/register" element={<RegisterWithRedirect />} />
      <Route path="/customer" element={<CustomerInterface />} />
      
      <Route
        path="/setup-organization"
        element={
          <ProtectedRoute requiresOrganization={false}>
            <SetupOrganization />
          </ProtectedRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="calls" element={<CallsPage />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Wrapper components that handle authentication redirects
function LoginWithRedirect() {
  const { user, loading } = useAuth();
  
  if (!loading && user) {
    return <AuthRedirect />;
  }
  
  return <Login />;
}

function RegisterWithRedirect() {
  const { user, loading } = useAuth();
  
  if (!loading && user) {
    return <AuthRedirect />;
  }
  
  return <Register />;
}