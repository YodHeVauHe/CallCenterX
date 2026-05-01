import { useState } from 'react';
import {
  Card,
  CardContent,
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
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import { CallVolumeChart } from '@/components/analytics/call-volume-chart';
import { CallPerformanceTable } from '@/components/analytics/call-performance-table';
import { SatisfactionChart } from '@/components/analytics/satisfaction-chart';
import { CallCategoryChart } from '@/components/analytics/call-category-chart';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}

function KpiCard({ label, value, delta, positive }: KpiCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="px-4 pt-4 pb-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="text-xl font-semibold text-foreground">{value}</div>
        <div className={cn('flex items-center gap-1 mt-0.5 text-xs', positive ? 'text-terminal-green' : 'text-terminal-red')}>
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{delta}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function Analytics() {
  const [timeframe, setTimeframe] = useState('7d');

  const kpis: KpiCardProps[] = [
    { label: 'Total Calls', value: '1,346', delta: '+12.3% vs previous period', positive: true },
    { label: 'Avg. Handle Time', value: '4m 32s', delta: '-8.5% vs previous period', positive: true },
    { label: 'First Call Resolution', value: '76.2%', delta: '+3.1% vs previous period', positive: true },
    { label: 'Customer Satisfaction', value: '4.6 / 5', delta: '+0.2 vs previous period', positive: true },
  ];

  return (
    <div className="flex flex-col gap-5 fade-in">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Comprehensive insights into your call center performance.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <TabsList className="h-8 bg-secondary border border-border gap-0 p-0.5">
            <TabsTrigger value="overview" className="h-7 text-xs px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
              Overview
            </TabsTrigger>
            <TabsTrigger value="agents" className="h-7 text-xs px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
              Agents
            </TabsTrigger>
            <TabsTrigger value="calls" className="h-7 text-xs px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
              Calls
            </TabsTrigger>
            <TabsTrigger value="customers" className="h-7 text-xs px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
              Customers
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select defaultValue={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-36 h-8 text-xs bg-background border-border">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="24h" className="text-xs">Last 24 hours</SelectItem>
                <SelectItem value="7d" className="text-xs">Last 7 days</SelectItem>
                <SelectItem value="30d" className="text-xs">Last 30 days</SelectItem>
                <SelectItem value="90d" className="text-xs">Last 90 days</SelectItem>
                <SelectItem value="custom" className="text-xs">Custom range</SelectItem>
              </SelectContent>
            </Select>
            {timeframe === 'custom' && <CalendarDateRangePicker />}
            <Button variant="outline" size="sm" className="h-8 text-xs border-border bg-transparent hover:bg-secondary gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4 pt-4">
          {/* KPI row */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map((k) => (
              <KpiCard key={k.label} {...k} />
            ))}
          </div>

          {/* Charts row 1 */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-card border-border">
              <CardHeader className="px-4 pt-4 pb-2">
                <p className="text-xs text-muted-foreground mb-0.5">Call Volume</p>
                <CardTitle className="text-sm font-medium text-foreground">Volume trends over time</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <CallVolumeChart />
              </CardContent>
            </Card>
            <Card className="col-span-3 bg-card border-border">
              <CardHeader className="px-4 pt-4 pb-2">
                <p className="text-xs text-muted-foreground mb-0.5">Categories</p>
                <CardTitle className="text-sm font-medium text-foreground">Distribution by type</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <CallCategoryChart />
              </CardContent>
            </Card>
          </div>

          {/* Charts row 2 */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3 bg-card border-border">
              <CardHeader className="px-4 pt-4 pb-2">
                <p className="text-xs text-muted-foreground mb-0.5">Customer Satisfaction</p>
                <CardTitle className="text-sm font-medium text-foreground">Satisfaction scores over time</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <SatisfactionChart />
              </CardContent>
            </Card>
            <Card className="col-span-4 bg-card border-border">
              <CardHeader className="px-4 pt-4 pb-2">
                <p className="text-xs text-muted-foreground mb-0.5">Agent Performance</p>
                <CardTitle className="text-sm font-medium text-foreground">Key metrics by agent</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <CallPerformanceTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {[
          { value: 'agents', label: 'Agent Analytics', desc: 'Detailed agent performance coming soon' },
          { value: 'calls', label: 'Call Analytics', desc: 'Detailed call analytics coming soon' },
          { value: 'customers', label: 'Customer Analytics', desc: 'Customer behavior insights coming soon' },
        ].map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="pt-4">
            <Card className="bg-card border-border">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">{tab.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-[300px] items-center justify-center border border-dashed border-border rounded">
                  <div className="text-center space-y-1">
                    <p className="text-sm text-muted-foreground">Under development</p>
                    <p className="text-xs text-muted-foreground/60">{tab.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
