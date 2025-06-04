import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker';
import { Download } from 'lucide-react';
import { CallVolumeChart } from '@/components/analytics/call-volume-chart';
import { CallPerformanceTable } from '@/components/analytics/call-performance-table';
import { SatisfactionChart } from '@/components/analytics/satisfaction-chart';
import { CallCategoryChart } from '@/components/analytics/call-category-chart';

export function Analytics() {
  const [timeframe, setTimeframe] = useState('7d');

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive analytics and insights about your call center performance.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="calls">Calls</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Select
                defaultValue={timeframe}
                onValueChange={setTimeframe}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
              {timeframe === 'custom' && <CalendarDateRangePicker />}
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6 pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Calls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,346</div>
                  <p className="text-xs text-muted-foreground">
                    +12.3% from previous period
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg. Handle Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4m 32s</div>
                  <p className="text-xs text-muted-foreground">
                    -8.5% from previous period
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    First Call Resolution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">76.2%</div>
                  <p className="text-xs text-muted-foreground">
                    +3.1% from previous period
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Customer Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.6/5</div>
                  <p className="text-xs text-muted-foreground">
                    +0.2 from previous period
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Call Volume</CardTitle>
                  <CardDescription>
                    Call volume trends over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CallVolumeChart />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Call Categories</CardTitle>
                  <CardDescription>
                    Distribution of calls by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CallCategoryChart />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Customer Satisfaction</CardTitle>
                  <CardDescription>
                    Satisfaction scores over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SatisfactionChart />
                </CardContent>
              </Card>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Agent Performance</CardTitle>
                  <CardDescription>
                    Key performance metrics by agent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CallPerformanceTable />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Agent Analytics</CardTitle>
                <CardDescription>
                  Detailed analytics on agent performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Agent Analytics Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed agent analytics view is under development.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Call Analytics</CardTitle>
                <CardDescription>
                  Detailed analytics on call metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Call Analytics Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed call analytics view is under development.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Analytics</CardTitle>
                <CardDescription>
                  Detailed analytics on customer behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Customer Analytics Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed customer analytics view is under development.
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