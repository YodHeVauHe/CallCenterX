import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, ArrowUpRight, Clock, Phone, Users } from 'lucide-react';
import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker';
import { Overview } from '@/components/dashboard/overview-chart';
import { RecentCalls } from '@/components/dashboard/recent-calls';
import { Button } from '@/components/ui/button';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { TopAgents } from '@/components/dashboard/top-agents';

export function Dashboard() {
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your call center performance.
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <CalendarDateRangePicker />
          </div>
          
          <TabsContent value="overview" className="space-y-6 pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Calls
                  </CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,329</div>
                  <p className="text-xs text-muted-foreground">
                    +12.2% from last month
                  </p>
                  <div className="mt-4 h-1 w-full rounded-full bg-muted">
                    <div className="h-1 w-[75%] rounded-full bg-primary"></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg. Wait Time
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2m 42s</div>
                  <p className="text-xs text-muted-foreground">
                    -18% from last month
                  </p>
                  <div className="mt-4 h-1 w-full rounded-full bg-muted">
                    <div className="h-1 w-[45%] rounded-full bg-green-500"></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Agents
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">
                    +2 since yesterday
                  </p>
                  <div className="mt-4 h-1 w-full rounded-full bg-muted">
                    <div className="h-1 w-[80%] rounded-full bg-blue-500"></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Resolution Rate
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89.2%</div>
                  <p className="text-xs text-muted-foreground">
                    +5.1% from last month
                  </p>
                  <div className="mt-4 h-1 w-full rounded-full bg-muted">
                    <div className="h-1 w-[89%] rounded-full bg-green-500"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Call Volume Overview</CardTitle>
                  <CardDescription>
                    Daily call volume for the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Calls</CardTitle>
                  <CardDescription>
                    Last 24 hours of call activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentCalls />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Performing Agents</CardTitle>
                  <CardDescription>
                    Based on call resolution and customer satisfaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopAgents />
                </CardContent>
              </Card>
              
              <Card className="col-span-4">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Activity Feed</CardTitle>
                    <CardDescription>
                      Recent system activity and notifications
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View all
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <ActivityFeed />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Detailed analytics view coming soon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Analytics Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed analytics view is under development.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  Detailed reports view coming soon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Reports Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed reports view is under development.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}