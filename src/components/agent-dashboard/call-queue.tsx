import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Phone } from "lucide-react";

interface QueueItem {
  id: string;
  position: number;
  waitTime: string;
  phoneNumber: string;
  category?: string;
  priority: "low" | "medium" | "high";
}

const queueData: QueueItem[] = [
  {
    id: "1",
    position: 1,
    waitTime: "3:45",
    phoneNumber: "+1 (555) 234-5678",
    category: "Technical Support",
    priority: "high",
  },
  {
    id: "2",
    position: 2,
    waitTime: "5:20",
    phoneNumber: "+1 (555) 345-6789",
    category: "Billing",
    priority: "medium",
  },
  {
    id: "3",
    position: 3,
    waitTime: "8:10",
    phoneNumber: "+1 (555) 456-7890",
    category: "Sales",
    priority: "low",
  },
  {
    id: "4",
    position: 4,
    waitTime: "10:35",
    phoneNumber: "+1 (555) 567-8901",
    category: "Technical Support",
    priority: "medium",
  },
  {
    id: "5",
    position: 5,
    waitTime: "12:50",
    phoneNumber: "+1 (555) 678-9012",
    priority: "low",
  },
];

export function CallQueue() {
  return (
    <div className="rounded-md border">
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="font-medium">Current Call Queue</h3>
          <p className="text-sm text-muted-foreground">
            {queueData.length} callers waiting
          </p>
        </div>
        <Button>
          <Phone className="mr-2 h-4 w-4" />
          Take Next Call
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Wait Time</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queueData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.position}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${
                    item.waitTime.split(":")[0] >= "10" 
                      ? "bg-red-500" 
                      : item.waitTime.split(":")[0] >= "5" 
                      ? "bg-yellow-500" 
                      : "bg-green-500"
                  }`}></div>
                  <span>{item.waitTime}</span>
                </div>
              </TableCell>
              <TableCell>{item.phoneNumber}</TableCell>
              <TableCell>{item.category || "General"}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.priority === "high"
                      ? "destructive"
                      : item.priority === "medium"
                      ? "default"
                      : "outline"
                  }
                >
                  {item.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  Pick Up
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-4 text-center text-sm text-muted-foreground">
        Queue refreshes automatically every 30 seconds
      </div>
    </div>
  );
}