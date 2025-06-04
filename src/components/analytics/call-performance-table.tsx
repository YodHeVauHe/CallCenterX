import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AgentPerformance {
  id: string;
  name: string;
  avatar?: string;
  calls: number;
  avgHandleTime: string;
  fcr: number;
  satisfaction: number;
  status: "online" | "busy" | "offline";
}

const agentPerformance: AgentPerformance[] = [
  {
    id: "1",
    name: "Sarah Wilson",
    avatar: "https://i.pravatar.cc/150?img=25",
    calls: 78,
    avgHandleTime: "4m 12s",
    fcr: 82,
    satisfaction: 4.8,
    status: "online",
  },
  {
    id: "2",
    name: "David Chen",
    avatar: "https://i.pravatar.cc/150?img=12",
    calls: 65,
    avgHandleTime: "5m 23s",
    fcr: 75,
    satisfaction: 4.5,
    status: "busy",
  },
  {
    id: "3",
    name: "Jessica Taylor",
    avatar: "https://i.pravatar.cc/150?img=20",
    calls: 59,
    avgHandleTime: "3m 58s",
    fcr: 80,
    satisfaction: 4.7,
    status: "online",
  },
  {
    id: "4",
    name: "Michael Lee",
    avatar: "https://i.pravatar.cc/150?img=15",
    calls: 48,
    avgHandleTime: "6m 10s",
    fcr: 68,
    satisfaction: 4.2,
    status: "offline",
  },
  {
    id: "5",
    name: "Emma Brown",
    avatar: "https://i.pravatar.cc/150?img=4",
    calls: 41,
    avgHandleTime: "4m 45s",
    fcr: 72,
    satisfaction: 4.4,
    status: "online",
  },
];

export function CallPerformanceTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Agent</TableHead>
          <TableHead>Calls</TableHead>
          <TableHead>Avg. Handle Time</TableHead>
          <TableHead>First Call Resolution</TableHead>
          <TableHead>Satisfaction</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {agentPerformance.map((agent) => (
          <TableRow key={agent.id}>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={agent.avatar} alt={agent.name} />
                  <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="font-medium">{agent.name}</div>
              </div>
            </TableCell>
            <TableCell>{agent.calls}</TableCell>
            <TableCell>{agent.avgHandleTime}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Progress value={agent.fcr} className="h-2 w-24" />
                <span className="text-sm">{agent.fcr}%</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <div className="font-medium">{agent.satisfaction}</div>
                <div className="ml-2 text-muted-foreground">/5</div>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  agent.status === "online"
                    ? "default"
                    : agent.status === "busy"
                    ? "secondary"
                    : "outline"
                }
              >
                {agent.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}