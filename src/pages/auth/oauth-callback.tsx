import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // The actual OAuth handling is done in the AuthProvider
    // This component just shows a loading state
    const timer = setTimeout(() => {
      // Fallback navigation if something goes wrong
      navigate('/login');
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <h2 className="text-xl font-semibold">Completing sign in...</h2>
        <p className="text-muted-foreground">
          Please wait while we complete your authentication.
        </p>
      </div>
    </div>
  );
}