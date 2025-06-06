import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Layout } from '@/components/layout';
import { Dashboard } from '@/pages/dashboard';
import { Login } from '@/pages/auth/login';
import { Register } from '@/pages/auth/register';
import { KnowledgeBase } from '@/pages/knowledge-base';
import { AgentDashboard } from '@/pages/agent-dashboard';
import { CallsPage } from '@/pages/calls';
import { Settings } from '@/pages/settings';
import { NotFound } from '@/pages/not-found';
import { Analytics } from '@/pages/analytics';
import { CustomerInterface } from '@/pages/customer-interface';
import { OAuthCallback } from '@/pages/auth/oauth-callback';

const ProtectedRoute = ({
  children,
  roles = [],
}: {
  children: React.ReactNode;
  roles?: string[];
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    if (user.role === 'admin') {
      return <Navigate to="/dashboard\" replace />;
    } else if (user.role === 'agent') {
      return <Navigate to="/agent-dashboard\" replace />;
    } else {
      return <Navigate to="/customer\" replace />;
    }
  }

  return <>{children}</>;
};

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/customer" element={<CustomerInterface />} />

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
        <Route
          path="dashboard"
          element={
            <ProtectedRoute roles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="agent-dashboard"
          element={
            <ProtectedRoute roles={['agent']}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="knowledge-base"
          element={
            <ProtectedRoute roles={['admin', 'agent']}>
              <KnowledgeBase />
            </ProtectedRoute>
          }
        />
        <Route
          path="calls"
          element={
            <ProtectedRoute roles={['admin', 'agent']}>
              <CallsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <ProtectedRoute roles={['admin']}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute roles={['admin']}>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}