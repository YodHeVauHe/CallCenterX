import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AppRoutes } from '@/routes';
import { AuthProvider } from '@/contexts/auth-context';
import { SocketProvider } from '@/contexts/socket-context';
import { EnvironmentCheck } from '@/components/environment-check';

function App() {
  // Check if Supabase is configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const isSupabaseConfigured = !!(
    supabaseUrl && 
    supabaseKey &&
    supabaseUrl !== 'https://your-project-ref.supabase.co' &&
    supabaseKey !== 'your-anon-key-here' &&
    supabaseUrl.includes('supabase.co')
  );

  if (!isSupabaseConfigured) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="callcenterx-theme">
        <EnvironmentCheck />
      </ThemeProvider>
    );
  }

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

export default App