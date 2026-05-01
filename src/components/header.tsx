import { Bell, Menu, X, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/calls': 'Calls',
  '/knowledge-base': 'Knowledge Base',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const routeLabel = routeLabels[pathname] ?? pathname.replace('/', '');
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-card px-4 gap-4">
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden h-8 w-8"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Brand — always visible, left-anchored */}
      <div className="flex items-center gap-2 shrink-0">
        <Terminal className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold tracking-tight">
          <span className="text-primary">Call</span>
          <span className="text-foreground">Center</span>
          <span className="text-primary">X</span>
        </span>
      </div>

      {/* Divider */}
      <div className="hidden md:block h-5 w-px bg-border" />

      {/* Current page title */}
      <span className="hidden md:block text-sm font-medium text-foreground">
        {routeLabel}
      </span>

      <div className="flex-1" />

      {/* Right controls */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 gap-2 px-2 text-sm text-muted-foreground hover:text-foreground"
              aria-label="User menu"
            >
              <Avatar className="h-6 w-6 rounded">
                <AvatarFallback className="rounded text-[10px] bg-primary/20 text-primary font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm">{user?.name ?? 'User'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">{user?.name}</span>
                <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
                {user?.organizations && user.organizations.length > 0 && (
                  <span className="text-xs text-primary">
                    {user.organizations.length} organization{user.organizations.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={logout}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
