import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Frown, Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 text-center p-4">
      <div className="space-y-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 mx-auto">
          <Frown className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">404 - Page Not Found</h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Go to Homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}