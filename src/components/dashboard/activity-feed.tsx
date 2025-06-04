import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ActivityItem {
  id: string;
  type: "call" | "status" | "system" | "message";
  user?: {
    name: string;
    avatar?: string;
  };
  content: string;
  time: string;
  meta?: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "call",
    user: {
      name: "Sarah Wilson",
      avatar: "https://i.pravatar.cc/150?img=25",
    },
    content: "Completed a call with Alex Johnson",
    time: "2 minutes ago",
    meta: "5m 23s",
  },
  {
    id: "2",
    type: "system",
    content: "System maintenance scheduled for tonight at 2 AM EST",
    time: "15 minutes ago",
  },
  {
    id: "3",
    type: "status",
    user: {
      name: "David Chen",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    content: "Changed status to Available",
    time: "32 minutes ago",
  },
  {
    id: "4",
    type: "message",
    user: {
      name: "Jessica Taylor",
      avatar: "https://i.pravatar.cc/150?img=20",
    },
    content: "Added a new response template for product inquiries",
    time: "1 hour ago",
  },
  {
    id: "5",
    type: "call",
    user: {
      name: "Michael Lee",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
    content: "Missed a call from Emma Brown",
    time: "2 hours ago",
  },
];

export function ActivityFeed() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start space-x-3 rounded-md border-l-2 border-l-transparent p-2 transition-all hover:bg-accent hover:border-l-primary"
        >
          {activity.user ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-primary"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {activity.user ? activity.user.name : "System"}
              </p>
              <div className="flex items-center space-x-2">
                {activity.meta && (
                  <Badge variant="outline\" className="text-[10px]">
                    {activity.meta}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{activity.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}