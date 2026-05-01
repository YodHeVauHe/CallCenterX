import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  ChevronDown,
  Clock,
  Download,
  Filter,
  Phone,
  Search,
  User,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
} from 'lucide-react';
import { CallsList } from '@/components/calls/calls-list';
import { CallRecordings } from '@/components/calls/call-recordings';
import { LiveCalls } from '@/components/calls/live-calls';

export function CallsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col gap-5 fade-in">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-foreground">Calls</h1>
        <p className="text-sm text-muted-foreground">
          Search, filter and manage all call activity.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search calls..."
              className="pl-8 h-8 text-xs bg-background border-border focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs border-border bg-transparent hover:bg-secondary gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                Filter
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 text-xs">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs gap-2">
                <Calendar className="h-3.5 w-3.5" />
                Date Range
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs gap-2">
                <User className="h-3.5 w-3.5" />
                Agent
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs gap-2">
                <Clock className="h-3.5 w-3.5" />
                Duration
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs gap-2">
                <PhoneIncoming className="h-3.5 w-3.5 text-terminal-green" />
                Inbound
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs gap-2">
                <PhoneOutgoing className="h-3.5 w-3.5 text-terminal-cyan" />
                Outbound
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs gap-2">
                <PhoneMissed className="h-3.5 w-3.5 text-terminal-red" />
                Missed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="h-8 text-xs border-border bg-transparent hover:bg-secondary gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
        <Button size="sm" className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
          <Phone className="h-3.5 w-3.5" />
          New Call
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all-calls" className="w-full">
        <TabsList className="h-8 bg-secondary border border-border gap-0 p-0.5 w-auto inline-flex">
          <TabsTrigger value="all-calls" className="h-7 text-xs px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
            All Calls
          </TabsTrigger>
          <TabsTrigger value="recordings" className="h-7 text-xs px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
            Recordings
          </TabsTrigger>
          <TabsTrigger value="live-calls" className="h-7 text-xs px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
            Live Calls
          </TabsTrigger>
          <TabsTrigger value="analytics" className="h-7 text-xs px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-calls" className="pt-3">
          <CallsList />
        </TabsContent>
        <TabsContent value="recordings" className="pt-3">
          <CallRecordings />
        </TabsContent>
        <TabsContent value="live-calls" className="pt-3">
          <LiveCalls />
        </TabsContent>
        <TabsContent value="analytics" className="pt-3">
          <Card className="bg-card border-border">
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Call Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center border border-dashed border-border rounded">
                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground">Under development</p>
                  <p className="text-xs text-muted-foreground/60">Detailed call statistics coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
