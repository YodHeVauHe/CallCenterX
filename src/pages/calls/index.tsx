import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  ChevronDown,
  Clock,
  Download,
  Filter,
  Phone,
  Search,
  User,
  MoreHorizontal,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { CallsList } from '@/components/calls/calls-list';
import { CallRecordings } from '@/components/calls/call-recordings';
import { LiveCalls } from '@/components/calls/live-calls';

export function CallsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Calls</h2>
        <p className="text-muted-foreground">
          View, search, and manage all call activity.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search calls..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                Date Range
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Agent
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Clock className="mr-2 h-4 w-4" />
                Duration
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <PhoneIncoming className="mr-2 h-4 w-4" />
                Inbound Calls
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PhoneOutgoing className="mr-2 h-4 w-4" />
                Outbound Calls
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PhoneMissed className="mr-2 h-4 w-4" />
                Missed Calls
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
        <div>
          <Button>
            <Phone className="mr-2 h-4 w-4" />
            New Call
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all-calls" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all-calls">All Calls</TabsTrigger>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
          <TabsTrigger value="live-calls">Live Calls</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-calls" className="space-y-4 pt-4">
          <CallsList />
        </TabsContent>
        
        <TabsContent value="recordings" className="space-y-4 pt-4">
          <CallRecordings />
        </TabsContent>
        
        <TabsContent value="live-calls" className="space-y-4 pt-4">
          <LiveCalls />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Call Analytics</CardTitle>
              <CardDescription>
                View detailed call statistics and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <h3 className="text-lg font-medium">Call Analytics Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed analytics view is under development.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}