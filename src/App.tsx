import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AppRoutes } from '@/routes';
import { AuthProvider } from '@/contexts/auth-context';
import { SocketProvider } from '@/contexts/socket-context';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="callcenterx-theme">
      <AuthProvider>
        <SocketProvider>
          <Router>
            <AppRoutes />
            <Toaster />
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;