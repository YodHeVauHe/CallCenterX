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

// Component to redirect authenticated users away from auth pages
const AuthPageWrapper = ({ children }: { children: React.ReactNode }) => {
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

  // If user is authenticated, redirect based on organization status
  if (user) {
    if (user.organizations.length === 0) {
      return <Navigate to="/setup-organization" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
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
      <Route 
        path="/login" 
        element={
          <AuthPageWrapper>
            <Login />
          </AuthPageWrapper>
        } 
      />
      <Route 
        path="/register" 
        element={
          <AuthPageWrapper>
            <Register />
          </AuthPageWrapper>
        } 
      />
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