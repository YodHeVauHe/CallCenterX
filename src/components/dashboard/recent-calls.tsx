import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RecentCall {
  id: string;
  customer: {
    name: string;
    avatar?: string;
  };
  duration: string;
  time: string;
  status: "completed" | "missed" | "ongoing";
  agentName?: string;
}

const recentCalls: RecentCall[] = [
  {
    id: "1",
    customer: {
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    duration: "5m 23s",
    time: "10:30 AM",
    status: "completed",
    agentName: "Sarah Wilson",
  },
  {
    id: "2",
    customer: {
      name: "Maria Garcia",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    duration: "2m 15s",
    time: "10:42 AM",
    status: "completed",
    agentName: "David Chen",
  },
  {
    id: "3",
    customer: {
      name: "James Smith",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    duration: "0m 0s",
    time: "11:05 AM",
    status: "missed",
  },
  {
    id: "4",
    customer: {
      name: "Emma Brown",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    duration: "8m 45s",
    time: "11:32 AM",
    status: "ongoing",
    agentName: "Michael Lee",
  },
  {
    id: "5",
    customer: {
      name: "Robert Miller",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    duration: "3m 12s",
    time: "12:15 PM",
    status: "completed",
    agentName: "Jessica Taylor",
  },
];

export function RecentCalls() {
  return (
    <div className="space-y-4">
      {recentCalls.map((call) => (
        <div
          key={call.id}
          className="flex items-center justify-between space-x-4 rounded-md border p-3 transition-all hover:bg-accent"
        >
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={call.customer.avatar} alt={call.customer.name} />
              <AvatarFallback>{call.customer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{call.customer.name}</p>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-muted-foreground">{call.time}</p>
                <Badge
                  variant={
                    call.status === "completed"
                      ? "outline"
                      : call.status === "ongoing"
                      ? "default"
                      : "destructive"
                  }
                  className="text-[10px]"
                >
                  {call.status}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-xs font-medium">{call.duration}</p>
              {call.agentName && (
                <p className="text-xs text-muted-foreground">{call.agentName}</p>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
                <path d="M10 8l6 4-6 4V8z" />
              </svg>
              <span className="sr-only">Play recording</span>
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full">
        View All Calls
      </Button>
    </div>
  );
}