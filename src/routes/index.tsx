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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiresOrganization && user.organizations.length === 0) {
    return <Navigate to="/setup-organization\" replace />;
  }

  return <>{children}</>;
};

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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
        <Route index element={<Navigate to="/dashboard\" replace />} />
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