import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function EnvironmentCheck() {
  const hasSupabaseUrl = !!import.meta.env.VITE_SUPABASE_URL;
  const hasSupabaseKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isConfigured = hasSupabaseUrl && hasSupabaseKey;

  if (isConfigured) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            Supabase Configuration Required
          </CardTitle>
          <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
            To use CallCenterX, you need to set up your Supabase project
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Missing Environment Variables</AlertTitle>
            <AlertDescription>
              The following environment variables are required:
              <ul className="mt-2 list-disc list-inside space-y-1">
                {!hasSupabaseUrl && <li><code>VITE_SUPABASE_URL</code></li>}
                {!hasSupabaseKey && <li><code>VITE_SUPABASE_ANON_KEY</code></li>}
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Quick Setup Guide:
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                  1
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Create a Supabase Project</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a> and create a new project
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                  2
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Get Your API Keys</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    In your Supabase Dashboard → Settings → API, copy your Project URL and anon public key
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                  3
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Create .env File</p>
                  <div className="mt-2 rounded-md bg-slate-100 dark:bg-slate-800 p-3 font-mono text-xs">
                    <div>VITE_SUPABASE_URL=https://your-project-ref.supabase.co</div>
                    <div>VITE_SUPABASE_ANON_KEY=your-anon-key-here</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                  4
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Restart the Development Server</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Stop the server (Ctrl+C) and run <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">npm run dev</code> again
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                Open Supabase Dashboard
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}