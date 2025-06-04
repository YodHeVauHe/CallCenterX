import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Clock, Headphones, MessageCircle, Mic, MicOff, Phone, PhoneOff, User } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentStats } from '@/components/agent-dashboard/agent-stats';
import { CallQueue } from '@/components/agent-dashboard/call-queue';
import { RecentInteractions } from '@/components/agent-dashboard/recent-interactions';

export function AgentDashboard() {
  const [activeCall, setActiveCall] = useState(true);
  const [muted, setMuted] = useState(false);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Agent Dashboard</h2>
        <p className="text-muted-foreground">
          Manage your calls and customer interactions efficiently.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-6">
        <div className="md:col-span-4 space-y-6">
          {activeCall ? (
            <Card>
              <CardHeader className="bg-green-500/10 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></div>
                    <CardTitle className="text-base">Active Call</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    12:45
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="https://i.pravatar.cc/150?img=32" alt="Customer" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">John Doe</h3>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          Premium Customer
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          3 Previous Calls
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={muted ? "default" : "outline"} 
                      size="icon" 
                      onClick={() => setMuted(!muted)}
                      className={muted ? "bg-red-500 hover:bg-red-600" : ""}
                    >
                      {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => setActiveCall(false)}
                    >
                      <PhoneOff className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Call Summary</h4>
                      <Badge variant="outline" className="text-xs">Auto-generated</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Customer is inquiring about their recent order #ORD-7829 which was supposed to be delivered yesterday. 
                      They've received a notification that it's delayed but want more information.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Suggested Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        Check Order Status
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Offer Discount
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Expedite Shipping
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="justify-between p-4">
                <div className="text-xs text-muted-foreground">
                  Call ID: CALL-3856293
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <MessageCircle className="mr-2 h-3 w-3" />
                  Add Note
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Ready for Calls</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  You're currently available to take incoming calls.
                </p>
                <div className="flex items-center gap-4">
                  <Button onClick={() => setActiveCall(true)}>
                    <Phone className="mr-2 h-4 w-4" />
                    Take Next Call
                  </Button>
                  <Button variant="outline">Go On Break</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="stats">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stats">Your Statistics</TabsTrigger>
              <TabsTrigger value="queue">Call Queue</TabsTrigger>
              <TabsTrigger value="recent">Recent Interactions</TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="pt-4">
              <AgentStats />
            </TabsContent>
            <TabsContent value="queue" className="pt-4">
              <CallQueue />
            </TabsContent>
            <TabsContent value="recent" className="pt-4">
              <RecentInteractions />
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Customer Information</CardTitle>
              <CardDescription>Details for the current caller</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {activeCall ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Contact Information</div>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <div>Email:</div>
                      <div>john.doe@example.com</div>
                      <div>Phone:</div>
                      <div>+1 (555) 123-4567</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Customer Since</div>
                    <div className="text-sm">March 15, 2021</div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Satisfaction Score</div>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="h-2 w-full" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Recent Orders</div>
                    <div className="space-y-2">
                      <div className="rounded-md border p-2 text-xs">
                        <div className="font-medium">#ORD-7829</div>
                        <div className="text-muted-foreground">$129.99 - June 12, 2023</div>
                        <Badge variant="outline" className="mt-1 text-[10px]">
                          In Transit
                        </Badge>
                      </div>
                      <div className="rounded-md border p-2 text-xs">
                        <div className="font-medium">#ORD-6547</div>
                        <div className="text-muted-foreground">$75.50 - May 28, 2023</div>
                        <Badge variant="secondary" className="mt-1 text-[10px]">
                          Delivered
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <User className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Customer information will appear here once you're on a call.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Knowledge Articles</CardTitle>
              <CardDescription>Suggested resources for this call</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {activeCall ? (
                <div className="space-y-3">
                  <div className="rounded-md border p-3 transition-colors hover:bg-accent">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Order Delivery Issues</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          How to handle delayed and missing deliveries
                        </p>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-3 transition-colors hover:bg-accent">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Compensation Policy</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Guidelines for offering discounts and refunds
                        </p>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-3 transition-colors hover:bg-accent">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Shipping Partners Contact Info</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Contact details for delivery services
                        </p>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <div className="h-8 w-8 text-muted-foreground mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Relevant knowledge articles will appear here during calls.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}