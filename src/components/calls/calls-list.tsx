import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Download,
  MessageSquare,
  MoreHorizontal,
  Phone,
  PhoneIncoming,
  PhoneMissed,
  PhoneOutgoing,
  Play,
} from "lucide-react";

interface Call {
  id: string;
  type: "incoming" | "outgoing" | "missed";
  customer: {
    name: string;
    avatar?: string;
    phoneNumber: string;
  };
  agent?: {
    name: string;
    avatar?: string;
  };
  startTime: string;
  duration?: string;
  status: "completed" | "missed" | "abandoned" | "transferred";
  recording: boolean;
}

const calls: Call[] = [
  {
    id: "call-1",
    type: "incoming",
    customer: {
      name: "Alice Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      phoneNumber: "+1 (555) 123-4567",
    },
    agent: {
      name: "Sarah Wilson",
      avatar: "https://i.pravatar.cc/150?img=25",
    },
    startTime: "Today, 10:30 AM",
    duration: "5m 23s",
    status: "completed",
    recording: true,
  },
  {
    id: "call-2",
    type: "outgoing",
    customer: {
      name: "Robert Garcia",
      avatar: "https://i.pravatar.cc/150?img=33",
      phoneNumber: "+1 (555) 234-5678",
    },
    agent: {
      name: "David Chen",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    startTime: "Today, 11:15 AM",
    duration: "3m 42s",
    status: "completed",
    recording: true,
  },
  {
    id: "call-3",
    type: "incoming",
    customer: {
      name: "Maria Rodriguez",
      avatar: "https://i.pravatar.cc/150?img=5",
      phoneNumber: "+1 (555) 345-6789",
    },
    agent: {
      name: "Jessica Taylor",
      avatar: "https://i.pravatar.cc/150?img=20",
    },
    startTime: "Today, 12:05 PM",
    duration: "8m 17s",
    status: "transferred",
    recording: true,
  },
  {
    id: "call-4",
    type: "missed",
    customer: {
      name: "James Smith",
      avatar: "https://i.pravatar.cc/150?img=3",
      phoneNumber: "+1 (555) 456-7890",
    },
    startTime: "Today, 1:30 PM",
    status: "missed",
    recording: false,
  },
  {
    id: "call-5",
    type: "incoming",
    customer: {
      name: "Emma Brown",
      avatar: "https://i.pravatar.cc/150?img=4",
      phoneNumber: "+1 (555) 567-8901",
    },
    startTime: "Today, 2:45 PM",
    status: "abandoned",
    recording: false,
  },
  {
    id: "call-6",
    type: "outgoing",
    customer: {
      name: "Daniel Martinez",
      avatar: "https://i.pravatar.cc/150?img=55",
      phoneNumber: "+1 (555) 678-9012",
    },
    agent: {
      name: "Michael Lee",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
    startTime: "Yesterday, 9:15 AM",
    duration: "4m 30s",
    status: "completed",
    recording: true,
  },
  {
    id: "call-7",
    type: "incoming",
    customer: {
      name: "Sophia Lee",
      avatar: "https://i.pravatar.cc/150?img=47",
      phoneNumber: "+1 (555) 789-0123",
    },
    agent: {
      name: "Sarah Wilson",
      avatar: "https://i.pravatar.cc/150?img=25",
    },
    startTime: "Yesterday, 10:30 AM",
    duration: "6m 12s",
    status: "completed",
    recording: true,
  },
  {
    id: "call-8",
    type: "missed",
    customer: {
      name: "William Davis",
      avatar: "https://i.pravatar.cc/150?img=8",
      phoneNumber: "+1 (555) 890-1234",
    },
    startTime: "Yesterday, 2:20 PM",
    status: "missed",
    recording: false,
  },
];

export function CallsList() {
  const CallTypeIcon = ({
    type,
    className,
  }: {
    type: "incoming" | "outgoing" | "missed";
    className?: string;
  }) => {
    switch (type) {
      case "incoming":
        return <PhoneIncoming className={className} />;
      case "outgoing":
        return <PhoneOutgoing className={className} />;
      case "missed":
        return <PhoneMissed className={className} />;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Type</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => (
            <TableRow key={call.id}>
              <TableCell>
                <CallTypeIcon
                  type={call.type}
                  className={`h-4 w-4 ${
                    call.type === "missed" ? "text-destructive" : ""
                  }`}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={call.customer.avatar}
                      alt={call.customer.name}
                    />
                    <AvatarFallback>
                      {call.customer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{call.customer.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {call.customer.phoneNumber}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {call.agent ? (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={call.agent.avatar}
                        alt={call.agent.name}
                      />
                      <AvatarFallback>
                        {call.agent.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{call.agent.name}</div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>{call.startTime}</TableCell>
              <TableCell>
                {call.duration || (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    call.status === "completed"
                      ? "outline"
                      : call.status === "transferred"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {call.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  {call.recording && (
                    <Button variant="ghost\" size="icon\" className="h-8 w-8">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Add Note</span>
                      </DropdownMenuItem>
                      {call.recording && (
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download Recording</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="text-sm text-muted-foreground">
          Showing <strong>8</strong> of <strong>48</strong> calls
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}