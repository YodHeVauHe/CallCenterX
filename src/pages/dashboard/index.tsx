import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, ArrowUpRight, Clock, Phone, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker';
import { Overview } from '@/components/dashboard/overview-chart';
import { RecentCalls } from '@/components/dashboard/recent-calls';
import { Button } from '@/components/ui/button';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { TopAgents } from '@/components/dashboard/top-agents';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: React.ElementType;
  progress: number;
  progressColor: string;
}

function StatCard({ label, value, delta, positive, icon: Icon, progress, progressColor }: StatCardProps) {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between pb-2 pt-4 px-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="flex h-7 w-7 items-center justify-center rounded bg-secondary">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="text-2xl font-semibold text-foreground tracking-tight">{value}</div>
        <div className={cn('flex items-center gap-1 mt-0.5 text-xs', positive ? 'text-terminal-green' : 'text-terminal-red')}>
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{delta}</span>
        </div>
        <div className="mt-3 h-px w-full bg-border overflow-hidden">
          <div
            className="h-px transition-all duration-700"
            style={{ width: `${progress}%`, background: progressColor }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
          <span>0%</span>
          <span>{progress}%</span>
          <span>100%</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const stats: StatCardProps[] = [
    {
      label: 'Total Calls',
      value: '1,329',
      delta: '+12.2% vs last month',
      positive: true,
      icon: Phone,
      progress: 75,
      progressColor: 'hsl(142 71% 45%)',
    },
    {
      label: 'Avg. Wait Time',
      value: '2m 42s',
      delta: '-18% vs last month',
      positive: true,
      icon: Clock,
      progress: 45,
      progressColor: 'hsl(199 89% 48%)',
    },
    {
      label: 'Active Agents',
      value: '18',
      delta: '+2 since yesterday',
      positive: true,
      icon: Users,
      progress: 80,
      progressColor: 'hsl(262 83% 58%)',
    },
    {
      label: 'Resolution Rate',
      value: '89.2%',
      delta: '+5.1% vs last month',
      positive: true,
      icon: Activity,
      progress: 89,
      progressColor: 'hsl(142 71% 45%)',
    },
  ];

  return (
    <div className="flex flex-col gap-5 fade-in">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your call center performance.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <TabsList className="h-8 bg-secondary border border-border gap-0 p-0.5">
            <TabsTrigger value="overview" className="h-7 text-xs px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="h-7 text-xs px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="h-7 text-xs px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
              Reports
            </TabsTrigger>
          </TabsList>
          <CalendarDateRangePicker />
        </div>

        <TabsContent value="overview" className="space-y-4 pt-4">
          {/* Stat cards */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-card border-border">
              <CardHeader className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Call Volume</p>
                    <CardTitle className="text-sm font-medium text-foreground">
                      Daily volume for the selected period
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                <Overview />
              </CardContent>
            </Card>

            <Card className="col-span-3 bg-card border-border">
              <CardHeader className="px-4 pt-4 pb-2">
                <p className="text-xs text-muted-foreground mb-0.5">Recent Calls</p>
                <CardTitle className="text-sm font-medium text-foreground">
                  Last 24 hours
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <RecentCalls />
              </CardContent>
            </Card>
          </div>

          {/* Agents + Activity row */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3 bg-card border-border">
              <CardHeader className="px-4 pt-4 pb-2">
                <p className="text-xs text-muted-foreground mb-0.5">Top Agents</p>
                <CardTitle className="text-sm font-medium text-foreground">
                  By resolution &amp; satisfaction score
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <TopAgents />
              </CardContent>
            </Card>

            <Card className="col-span-4 bg-card border-border">
              <CardHeader className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Activity Feed</p>
                    <CardTitle className="text-sm font-medium text-foreground">
                      System events &amp; notifications
                    </CardTitle>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-border bg-transparent hover:bg-secondary">
                    View all
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ActivityFeed />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="pt-4">
          <Card className="bg-card border-border">
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center border border-dashed border-border rounded">
                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground">Under development</p>
                  <p className="text-xs text-muted-foreground/60">Navigate to Analytics for the full view</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="pt-4">
          <Card className="bg-card border-border">
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center border border-dashed border-border rounded">
                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground">Under development</p>
                  <p className="text-xs text-muted-foreground/60">Report generation coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
