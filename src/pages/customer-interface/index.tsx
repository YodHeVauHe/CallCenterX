import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeadphonesIcon, Mic, MicOff, Phone, PhoneOff, Send, Video, VideoOff } from 'lucide-react';

export function CustomerInterface() {
  const [activeCall, setActiveCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = [
    {
      id: 1,
      sender: 'system',
      content: 'Welcome to CallCenterX! How can we help you today?',
      time: '10:30 AM',
    },
    {
      id: 2,
      sender: 'user',
      content: 'I have a question about my recent order.',
      time: '10:31 AM',
    },
    {
      id: 3,
      sender: 'agent',
      name: 'Sarah Wilson',
      avatar: 'https://i.pravatar.cc/150?img=25',
      content: 'Hi there! I\'d be happy to help with your order. Could you please provide your order number?',
      time: '10:32 AM',
    },
    {
      id: 4,
      sender: 'user',
      content: 'Sure, it\'s ORD-7829.',
      time: '10:33 AM',
    },
    {
      id: 5,
      sender: 'agent',
      name: 'Sarah Wilson',
      avatar: 'https://i.pravatar.cc/150?img=25',
      content: 'Thank you! I can see your order was shipped yesterday. According to the tracking information, there\'s a slight delay due to weather conditions in the distribution area. It should be delivered by tomorrow. Would you like me to send you the detailed tracking information?',
      time: '10:35 AM',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <HeadphonesIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">
            <span className="text-primary">Call</span>
            <span className="text-blue-600">Center</span>
            <span className="text-primary">X</span>
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            Help Center
          </Button>
          <Button size="sm">Sign In</Button>
        </div>
      </header>

      <main className="grid flex-1 items-start md:grid-cols-[1fr_300px]">
        <div className="flex flex-col">
          <div className="bg-gradient-to-b from-muted/50 to-background p-6 md:p-8">
            <div className="mx-auto max-w-4xl space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">Customer Support</h1>
              <p className="text-muted-foreground">
                Connect with our support team instantly via chat or voice call.
              </p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-4xl p-4 md:p-6">
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="call">Voice Call</TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="mt-4 space-y-4">
                <div className="rounded-lg border bg-card shadow-sm">
                  <div className="flex items-center justify-between border-b p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="https://i.pravatar.cc/150?img=25" alt="Sarah Wilson" />
                        <AvatarFallback>SW</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Sarah Wilson</div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">Customer Support</Badge>
                          <div className="flex items-center space-x-1">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-xs text-muted-foreground">Online</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </Button>
                    </div>
                  </div>
                  <div className="h-[400px] overflow-y-auto p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {msg.sender === 'agent' && (
                            <Avatar className="mr-2 h-8 w-8">
                              <AvatarImage src={msg.avatar} alt={msg.name} />
                              <AvatarFallback>{msg.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          {msg.sender === 'system' && (
                            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <HeadphonesIcon className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              msg.sender === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : msg.sender === 'system'
                                ? 'bg-secondary text-secondary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            {msg.sender === 'agent' && (
                              <div className="mb-1 text-xs font-medium">{msg.name}</div>
                            )}
                            <p className="text-sm">{msg.content}</p>
                            <div className="mt-1 text-right text-xs opacity-70">
                              {msg.time}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                  <Separator />
                  <form onSubmit={handleSendMessage} className="p-4">
                    <div className="flex space-x-2">
                      <Textarea
                        className="min-h-[80px] flex-1 resize-none"
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <Button type="submit" size="icon" className="h-10 w-10 shrink-0">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>
              <TabsContent value="call" className="mt-4 space-y-4">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  {activeCall ? (
                    <div className="flex flex-col items-center space-y-6">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src="https://i.pravatar.cc/150?img=25\" alt="Sarah Wilson" />
                          <AvatarFallback>SW</AvatarFallback>
                        </Avatar>
                        <div className="absolute -right-1 -top-1 h-6 w-6 rounded-full border-4 border-background bg-green-500"></div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-medium">Sarah Wilson</div>
                        <div className="text-sm text-muted-foreground">Customer Support</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="animate-pulse bg-green-500 text-white">
                          Call in Progress
                        </Badge>
                        <div className="text-sm">12:45</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <Button
                          variant={muted ? "default" : "outline"}
                          size="icon"
                          className={`h-12 w-12 rounded-full ${muted ? "bg-red-500 hover:bg-red-600" : ""}`}
                          onClick={() => setMuted(!muted)}
                        >
                          {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-12 w-12 rounded-full"
                          onClick={() => setActiveCall(false)}
                        >
                          <PhoneOff className="h-5 w-5" />
                        </Button>
                        <Button
                          variant={videoEnabled ? "default" : "outline"}
                          size="icon"
                          className={`h-12 w-12 rounded-full ${videoEnabled ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                          onClick={() => setVideoEnabled(!videoEnabled)}
                        >
                          {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-6">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                        <Phone className="h-12 w-12 text-primary" />
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-medium">Start a Voice Call</div>
                        <div className="text-sm text-muted-foreground">
                          Connect with our support team instantly
                        </div>
                      </div>
                      <Button
                        size="lg"
                        className="px-8"
                        onClick={() => setActiveCall(true)}
                      >
                        <Phone className="mr-2 h-5 w-5" />
                        Start Call
                      </Button>
                      <div className="text-center text-sm text-muted-foreground">
                        <p>Our support team is available 24/7</p>
                        <p>Average wait time: &lt; 2 minutes</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="hidden border-l md:block">
          <div className="p-6">
            <h3 className="font-semibold">Frequently Asked Questions</h3>
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border p-3 transition-colors hover:bg-accent">
                <h4 className="font-medium">How do I track my order?</h4>
                <p className="text-sm text-muted-foreground">
                  You can track your order in your account dashboard or using the tracking link in your shipping confirmation email.
                </p>
              </div>
              <div className="rounded-lg border p-3 transition-colors hover:bg-accent">
                <h4 className="font-medium">What is your return policy?</h4>
                <p className="text-sm text-muted-foreground">
                  We offer a 30-day return policy for most items. Please check our Returns page for detailed information.
                </p>
              </div>
              <div className="rounded-lg border p-3 transition-colors hover:bg-accent">
                <h4 className="font-medium">How do I change my password?</h4>
                <p className="text-sm text-muted-foreground">
                  You can change your password in your account settings. If you've forgotten your password, use the "Forgot Password" link.
                </p>
              </div>
              <div className="rounded-lg border p-3 transition-colors hover:bg-accent">
                <h4 className="font-medium">When will I be charged?</h4>
                <p className="text-sm text-muted-foreground">
                  Your card will be charged immediately after you place your order.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full">
                View All FAQs
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>© 2025 CallCenterX. All rights reserved.</p>
        <p className="flex items-center justify-center gap-1 pt-1">
          <span>Built with</span>
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            Bolt.new
          </a>
        </p>
      </footer>
    </div>
  );
}