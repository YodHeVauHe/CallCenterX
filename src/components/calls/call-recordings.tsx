import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Clock, Download, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";

interface Recording {
  id: string;
  title: string;
  date: string;
  duration: string;
  agent: {
    name: string;
    avatar?: string;
  };
  customer: {
    name: string;
    avatar?: string;
  };
  tags: string[];
  notes?: string;
  audioUrl: string;
}

const recordings: Recording[] = [
  {
    id: "rec-1",
    title: "Customer Service Call - Technical Support",
    date: "June 15, 2023 - 10:30 AM",
    duration: "8:45",
    agent: {
      name: "Sarah Wilson",
      avatar: "https://i.pravatar.cc/150?img=25",
    },
    customer: {
      name: "Robert Garcia",
      avatar: "https://i.pravatar.cc/150?img=33",
    },
    tags: ["technical", "resolved", "follow-up"],
    notes: "Customer reported issues with the mobile app. Walked through troubleshooting steps and resolved the login problem. Recommended updating to the latest version.",
    audioUrl: "#",
  },
  {
    id: "rec-2",
    title: "Product Inquiry - Pricing Plans",
    date: "June 14, 2023 - 2:15 PM",
    duration: "5:20",
    agent: {
      name: "David Chen",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    customer: {
      name: "Emma Brown",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    tags: ["sales", "pricing", "enterprise"],
    notes: "Potential client interested in enterprise pricing plans. Explained the different tiers and scheduled a follow-up demo with the sales team.",
    audioUrl: "#",
  },
  {
    id: "rec-3",
    title: "Billing Dispute Resolution",
    date: "June 14, 2023 - 11:45 AM",
    duration: "10:15",
    agent: {
      name: "Jessica Taylor",
      avatar: "https://i.pravatar.cc/150?img=20",
    },
    customer: {
      name: "James Smith",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    tags: ["billing", "dispute", "resolved"],
    notes: "Customer was overcharged on their monthly subscription. Verified the account, processed a refund, and applied a 10% discount for the inconvenience.",
    audioUrl: "#",
  },
  {
    id: "rec-4",
    title: "Account Cancellation Request",
    date: "June 13, 2023 - 3:30 PM",
    duration: "7:50",
    agent: {
      name: "Michael Lee",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
    customer: {
      name: "Maria Rodriguez",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    tags: ["cancellation", "retention", "discount"],
    notes: "Customer wanted to cancel due to cost. Offered a 25% discount for 3 months and explained premium features. Customer decided to stay.",
    audioUrl: "#",
  },
];

export function CallRecordings() {
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(recordings[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-4">
        <div className="rounded-md border">
          <div className="p-4 bg-muted/40">
            <h3 className="font-medium">Recent Recordings</h3>
          </div>
          <div className="divide-y">
            {recordings.map((recording) => (
              <div
                key={recording.id}
                className={`p-3 hover:bg-accent cursor-pointer transition-colors ${
                  selectedRecording?.id === recording.id ? "bg-accent" : ""
                }`}
                onClick={() => setSelectedRecording(recording)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div>
                      <Play className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-sm line-clamp-1">
                        {recording.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {recording.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {recording.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        {selectedRecording ? (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>{selectedRecording.title}</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedRecording.date}
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={selectedRecording.agent.avatar}
                        alt={selectedRecording.agent.name}
                      />
                      <AvatarFallback>
                        {selectedRecording.agent.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {selectedRecording.agent.name}
                      </div>
                      <div className="text-xs text-muted-foreground">Agent</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium">
                        {selectedRecording.customer.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Customer
                      </div>
                    </div>
                    <Avatar>
                      <AvatarImage
                        src={selectedRecording.customer.avatar}
                        alt={selectedRecording.customer.name}
                      />
                      <AvatarFallback>
                        {selectedRecording.customer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedRecording.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedRecording.notes || "No notes available for this recording."}
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {formatTime(currentTime)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedRecording.duration}
                    </div>
                  </div>
                  <Slider
                    value={[currentTime]}
                    max={parseInt(selectedRecording.duration.split(":")[0]) * 60 + parseInt(selectedRecording.duration.split(":")[1])}
                    step={1}
                    onValueChange={(value) => setCurrentTime(value[0])}
                    className="cursor-pointer"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Slider
                        value={[volume]}
                        max={100}
                        step={1}
                        onValueChange={(value) => setVolume(value[0])}
                        className="w-24"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon">
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={togglePlayback}
                        variant="default"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5 ml-0.5" />
                        )}
                      </Button>
                      <Button variant="outline" size="icon">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="w-28"></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/40 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Recording ID: {selectedRecording.id}
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Play className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-medium">No Recording Selected</h3>
              <p className="text-sm text-muted-foreground">
                Select a recording from the list to view details and play it.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}