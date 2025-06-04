import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Phone } from "lucide-react";

interface Interaction {
  id: string;
  type: "call" | "chat";
  customer: {
    name: string;
    avatar?: string;
  };
  time: string;
  duration?: string;
  status: "resolved" | "unresolved" | "follow-up";
  summary: string;
}

const interactions: Interaction[] = [
  {
    id: "1",
    type: "call",
    customer: {
      name: "Robert Garcia",
      avatar: "https://i.pravatar.cc/150?img=33",
    },
    time: "Today, 09:45 AM",
    duration: "8m 12s",
    status: "resolved",
    summary: "Customer inquired about upgrading their subscription plan. Provided details on premium features and helped process the upgrade.",
  },
  {
    id: "2",
    type: "chat",
    customer: {
      name: "Emma Wilson",
      avatar: "https://i.pravatar.cc/150?img=24",
    },
    time: "Today, 11:20 AM",
    status: "follow-up",
    summary: "Customer reported issues with logging into their account. Reset password but they're still experiencing problems. Escalated to technical team.",
  },
  {
    id: "3",
    type: "call",
    customer: {
      name: "Michael Brown",
      avatar: "https://i.pravatar.cc/150?img=60",
    },
    time: "Yesterday, 3:15 PM",
    duration: "4m 30s",
    status: "resolved",
    summary: "Customer called about a billing discrepancy. Reviewed their account and issued a refund for the overcharged amount.",
  },
  {
    id: "4",
    type: "chat",
    customer: {
      name: "Sophia Lee",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    time: "Yesterday, 5:30 PM",
    status: "unresolved",
    summary: "Customer was experiencing shipping delays with their order #ORD-7123. Couldn't locate tracking information in the system.",
  },
  {
    id: "5",
    type: "call",
    customer: {
      name: "Daniel Martinez",
      avatar: "https://i.pravatar.cc/150?img=55",
    },
    time: "Jun 15, 2023",
    duration: "12m 45s",
    status: "follow-up",
    summary: "Customer interested in enterprise solution. Provided initial information and scheduled a follow-up demo with sales team for next week.",
  },
];

export function RecentInteractions() {
  return (
    <div>
      <Tabs defaultValue="all" className="mb-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="calls">Calls</TabsTrigger>
          <TabsTrigger value="chats">Chats</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {interactions.map((interaction) => (
          <Card key={interaction.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={interaction.customer.avatar} alt={interaction.customer.name} />
                    <AvatarFallback>{interaction.customer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{interaction.customer.name}</h4>
                      <Badge
                        variant={
                          interaction.status === "resolved"
                            ? "outline"
                            : interaction.status === "follow-up"
                            ? "secondary"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {interaction.status}
                      </Badge>
                      {interaction.type === "call" ? (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Phone className="mr-1 h-3 w-3" />
                          {interaction.duration}
                        </div>
                      ) : (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MessageCircle className="mr-1 h-3 w-3" />
                          Chat
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{interaction.time}</p>
                    <p className="mt-2 text-sm">{interaction.summary}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}