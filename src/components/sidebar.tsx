import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart2,
  FileText,
  Home,
  Headset,
  Phone,
  Settings,
  Circle,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, label: 'dash' },
  { name: 'Calls', href: '/calls', icon: Phone, label: 'calls' },
  { name: 'Knowledge', href: '/knowledge-base', icon: FileText, label: 'kb' },
  { name: 'Analytics', href: '/analytics', icon: BarChart2, label: 'analytics' },
  { name: 'Settings', href: '/settings', icon: Settings, label: 'cfg' },
];

export function Sidebar({ open }: SidebarProps) {
  const { pathname } = useLocation();

  if (!open) {
    return (
      <div className="hidden md:flex w-14 shrink-0 flex-col border-r border-border bg-card">
        {/* Logo mark */}
        <div className="flex h-12 items-center justify-center border-b border-border">
          <Headset className="h-4 w-4 text-primary" />
        </div>
        <ScrollArea className="flex-1 py-3">
          <div className="flex flex-col items-center gap-1 px-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  title={item.name}
                  className={cn(
                    'group relative flex h-9 w-9 items-center justify-center rounded transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r" />
                  )}
                  <item.icon className="h-4 w-4" />
                  <span className="sr-only">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
        {/* Status dot */}
        <div className="flex h-10 items-center justify-center border-t border-border">
          <span className="h-2 w-2 rounded-full status-online" title="System online" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-20 flex w-56 shrink-0 flex-col border-r border-border bg-card transition-transform duration-200 ease-in-out md:relative md:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <ScrollArea className="flex-1 py-3">
        {/* Nav label */}
        <div className="mb-2 px-4">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            Navigation
          </span>
        </div>

        <div className="flex flex-col gap-0.5 px-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r" />
                )}
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
                {active && (
                  <span className="ml-auto text-xs text-primary opacity-50">
                    ●
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Recent calls section */}
        <div className="mt-6 px-4">
          <div className="mb-2">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Recent Calls
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            {[
              { name: 'Jane Smith', time: '5m', live: true },
              { name: 'Bob Johnson', time: '15m', live: false },
              { name: 'Alice Brown', time: '45m', live: false },
            ].map((call) => (
              <button
                key={call.name}
                className="flex items-center gap-2 rounded px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors text-left"
              >
                <Circle
                  className={cn(
                    'h-2 w-2 shrink-0',
                    call.live ? 'fill-primary text-primary' : 'fill-muted-foreground text-muted-foreground'
                  )}
                />
                <span className="truncate">{call.name}</span>
                <span className="ml-auto opacity-50">{call.time}</span>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* System status */}
      <div className="flex items-center gap-2 border-t border-border px-4 py-2.5">
        <span className="h-2 w-2 rounded-full status-online shrink-0" />
        <span className="text-xs text-muted-foreground">System Online</span>
        <span className="ml-auto text-xs text-muted-foreground opacity-50">v2.0</span>
      </div>
    </div>
  );
}
