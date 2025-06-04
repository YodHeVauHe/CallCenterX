import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Agent {
  id: string;
  name: string;
  avatar?: string;
  callsHandled: number;
  satisfactionRate: number;
  status: "online" | "busy" | "offline";
}

const agents: Agent[] = [
  {
    id: "1",
    name: "Sarah Wilson",
    avatar: "https://i.pravatar.cc/150?img=25",
    callsHandled: 78,
    satisfactionRate: 96,
    status: "online",
  },
  {
    id: "2",
    name: "David Chen",
    avatar: "https://i.pravatar.cc/150?img=12",
    callsHandled: 65,
    satisfactionRate: 92,
    status: "busy",
  },
  {
    id: "3",
    name: "Jessica Taylor",
    avatar: "https://i.pravatar.cc/150?img=20",
    callsHandled: 59,
    satisfactionRate: 90,
    status: "online",
  },
  {
    id: "4",
    name: "Michael Lee",
    avatar: "https://i.pravatar.cc/150?img=15",
    callsHandled: 48,
    satisfactionRate: 88,
    status: "offline",
  },
];

export function TopAgents() {
  return (
    <div className="space-y-4">
      {agents.map((agent) => (
        <div
          key={agent.id}
          className="flex items-center justify-between space-x-4 rounded-md border p-3 transition-all hover:bg-accent"
        >
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={agent.avatar} alt={agent.name} />
              <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">{agent.name}</p>
                <Badge
                  variant={
                    agent.status === "online"
                      ? "default"
                      : agent.status === "busy"
                      ? "secondary"
                      : "outline"
                  }
                  className="text-[10px]"
                >
                  {agent.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {agent.callsHandled} calls handled
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Progress value={agent.satisfactionRate} className="h-2 w-20" />
            <span className="text-xs font-medium">{agent.satisfactionRate}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}