import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AppRoutes } from '@/routes';
import { AuthProvider } from '@/contexts/auth-context';
import { SocketProvider } from '@/contexts/socket-context';

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="callcenterx-theme">
        <AuthProvider>
          <SocketProvider>
            <AppRoutes />
            <Toaster />
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
