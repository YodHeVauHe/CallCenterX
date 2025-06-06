import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthService } from '@/lib/auth';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');

        if (error) {
          setError(`OAuth error: ${error}`);
          setLoading(false);
          return;
        }

        if (!code) {
          setError('No authorization code received');
          setLoading(false);
          return;
        }

        // Exchange code for tokens
        const { user: authUser, error: authError } = await AuthService.exchangeCodeForTokens(code);

        if (authError) {
          setError(authError);
          setLoading(false);
          return;
        }

        if (authUser) {
          // Redirect based on role
          if (authUser.role === 'admin') {
            navigate('/dashboard');
          } else if (authUser.role === 'agent') {
            navigate('/agent-dashboard');
          } else {
            navigate('/dashboard');
          }
        } else {
          setError('Failed to authenticate user');
          setLoading(false);
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('An unexpected error occurred during authentication');
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  // If user is already authenticated, redirect them
  useEffect(() => {
    if (user && !loading) {
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else if (user.role === 'agent') {
        navigate('/agent-dashboard');
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-muted flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Authenticating...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Please wait while we complete your Google sign-in.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-muted flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Authentication Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Back to Login
              </Button>
              <Button onClick={() => navigate('/register')}>
                Sign Up Instead
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}