import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Mic, MicOff, PhoneOff } from "lucide-react";

interface LiveCall {
  id: string;
  agent: {
    name: string;
    avatar?: string;
    status: "available" | "busy" | "away";
  };
  customer: {
    name: string;
    avatar?: string;
    phoneNumber: string;
  };
  startTime: string;
  duration: string;
  sentiment: number;
  isMuted: boolean;
}

const liveCalls: LiveCall[] = [
  {
    id: "live-1",
    agent: {
      name: "Sarah Wilson",
      avatar: "https://i.pravatar.cc/150?img=25",
      status: "busy",
    },
    customer: {
      name: "Robert Garcia",
      avatar: "https://i.pravatar.cc/150?img=33",
      phoneNumber: "+1 (555) 234-5678",
    },
    startTime: "12:45",
    duration: "5m 23s",
    sentiment: 85,
    isMuted: false,
  },
  {
    id: "live-2",
    agent: {
      name: "David Chen",
      avatar: "https://i.pravatar.cc/150?img=12",
      status: "busy",
    },
    customer: {
      name: "Emma Brown",
      avatar: "https://i.pravatar.cc/150?img=4",
      phoneNumber: "+1 (555) 567-8901",
    },
    startTime: "12:30",
    duration: "20m 15s",
    sentiment: 45,
    isMuted: true,
  },
  {
    id: "live-3",
    agent: {
      name: "Jessica Taylor",
      avatar: "https://i.pravatar.cc/150?img=20",
      status: "busy",
    },
    customer: {
      name: "Daniel Martinez",
      avatar: "https://i.pravatar.cc/150?img=55",
      phoneNumber: "+1 (555) 678-9012",
    },
    startTime: "12:52",
    duration: "3m 10s",
    sentiment: 75,
    isMuted: false,
  },
];

export function LiveCalls() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Out of 18 agents
            </p>
            <div className="mt-4 h-1 w-full rounded-full bg-muted">
              <div className="h-1 w-[17%] rounded-full bg-primary"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Call Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9m 36s</div>
            <p className="text-xs text-muted-foreground">
              +2m from average
            </p>
            <div className="mt-4 h-1 w-full rounded-full bg-muted">
              <div className="h-1 w-[65%] rounded-full bg-amber-500"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Agents Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              67% of total agents
            </p>
            <div className="mt-4 h-1 w-full rounded-full bg-muted">
              <div className="h-1 w-[67%] rounded-full bg-green-500"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Queue Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Avg. wait: 2m 15s
            </p>
            <div className="mt-4 h-1 w-full rounded-full bg-muted">
              <div className="h-1 w-[40%] rounded-full bg-yellow-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <div className="p-4 bg-muted/40">
          <h3 className="font-medium">Active Calls</h3>
        </div>
        <div className="divide-y">
          {liveCalls.map((call) => (
            <div key={call.id} className="p-4">
              <div className="grid gap-4 md:grid-cols-5">
                <div className="flex items-center space-x-4 md:col-span-2">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={call.agent.avatar} alt={call.agent.name} />
                      <AvatarFallback>{call.agent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-background bg-green-500"></div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <div className="font-medium">{call.agent.name}</div>
                      <div className="ml-2">
                        {call.isMuted ? (
                          <MicOff className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <Mic className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">Agent</div>
                  </div>
                  <div className="text-muted-foreground mx-2">→</div>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={call.customer.avatar} alt={call.customer.name} />
                      <AvatarFallback>{call.customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{call.customer.name}</div>
                      <div className="text-xs text-muted-foreground">{call.customer.phoneNumber}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center md:border-l md:border-r md:px-4">
                  <div className="text-sm text-muted-foreground mb-1">Duration</div>
                  <div className="font-medium">{call.duration}</div>
                  <div className="text-xs text-muted-foreground">Started at {call.startTime}</div>
                </div>

                <div className="flex flex-col justify-center md:border-r md:px-4">
                  <div className="text-sm text-muted-foreground mb-1">Customer Sentiment</div>
                  <div className="flex items-center space-x-2">
                    <Progress 
                      value={call.sentiment} 
                      className="h-2"
                      indicatorClassName={
                        call.sentiment > 70 
                          ? "bg-green-500" 
                          : call.sentiment > 40 
                          ? "bg-yellow-500" 
                          : "bg-red-500"
                      }
                    />
                    <span className="text-sm font-medium">{call.sentiment}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {call.sentiment > 70 
                      ? "Positive" 
                      : call.sentiment > 40 
                      ? "Neutral" 
                      : "Negative"}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm">
                    Listen
                  </Button>
                  <Button variant="destructive" size="sm">
                    <PhoneOff className="mr-2 h-4 w-4" />
                    End
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}