import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  BarChart2,
  FileText,
  Home,
  Layers,
  Phone,
  Settings,
  Users,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface SidebarProps {
  open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  const { pathname } = useLocation();
  const { user } = useAuth();

  // Only show relevant nav items based on user role
  const isAdmin = user?.role === 'admin';

  const navItems = [
    ...(isAdmin
      ? [
          {
            name: 'Dashboard',
            href: '/dashboard',
            icon: Home,
          },
        ]
      : [
          {
            name: 'Agent Dashboard',
            href: '/agent-dashboard',
            icon: Home,
          },
        ]),
    {
      name: 'Calls',
      href: '/calls',
      icon: Phone,
    },
    {
      name: 'Knowledge Base',
      href: '/knowledge-base',
      icon: FileText,
    },
    ...(isAdmin
      ? [
          {
            name: 'Analytics',
            href: '/analytics',
            icon: BarChart2,
          },
          {
            name: 'Settings',
            href: '/settings',
            icon: Settings,
          },
        ]
      : []),
  ];

  if (!open) {
    return (
      <div className="hidden md:block w-16 shrink-0 border-r bg-background">
        <ScrollArea className="h-full py-4">
          <div className="flex flex-col items-center gap-4 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'group flex h-10 w-10 items-center justify-center rounded-md',
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent'
                )}
                title={item.name}
              >
                <item.icon className="h-5 w-5" />
                <span className="sr-only">{item.name}</span>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-20 w-64 shrink-0 transform border-r bg-background transition-transform duration-200 ease-in-out md:relative md:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex h-16 items-center justify-center border-b px-4">
        <h1 className="text-xl font-semibold">
          <span className="text-primary">Call</span>
          <span className="text-blue-600">Center</span>
          <span className="text-primary">X</span>
        </h1>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)] px-3 py-4">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? 'default' : 'ghost'}
              className={cn(
                'justify-start',
                pathname === item.href
                  ? ''
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
              asChild
            >
              <Link to={item.href}>
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </Link>
            </Button>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-4 pt-4">
          <div className="px-3 py-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Recent calls
            </h3>
            <div className="mt-2 space-y-2">
              <Button variant="ghost" className="w-full justify-start text-xs">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Jane Smith - 5m ago
              </Button>
              <Button variant="ghost" className="w-full justify-start text-xs">
                <span className="h-2 w-2 rounded-full bg-gray-500 mr-2"></span>
                Bob Johnson - 15m ago
              </Button>
              <Button variant="ghost" className="w-full justify-start text-xs">
                <span className="h-2 w-2 rounded-full bg-gray-500 mr-2"></span>
                Alice Brown - 45m ago
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="mt-auto">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-muted-foreground">
                System status: Online
              </span>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}