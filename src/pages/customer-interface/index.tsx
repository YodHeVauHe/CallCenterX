import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeadphonesIcon, Mic, MicOff, Phone, PhoneOff, Send, Terminal, Video, VideoOff } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      content: 'Welcome to CallCenterX. How can we help you today?',
      time: '10:30',
    },
    {
      id: 2,
      sender: 'user',
      content: 'I have a question about my recent order.',
      time: '10:31',
    },
    {
      id: 3,
      sender: 'agent',
      name: 'Sarah Wilson',
      avatar: 'https://i.pravatar.cc/150?img=25',
      content: "Hi there! I'd be happy to help with your order. Could you please provide your order number?",
      time: '10:32',
    },
    {
      id: 4,
      sender: 'user',
      content: "Sure, it's ORD-7829.",
      time: '10:33',
    },
    {
      id: 5,
      sender: 'agent',
      name: 'Sarah Wilson',
      avatar: 'https://i.pravatar.cc/150?img=25',
      content: "Thank you! Your order was shipped yesterday. There's a slight delay due to weather — delivery expected tomorrow. Want me to send tracking info?",
      time: '10:35',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
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
    <div className="dark flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b border-border bg-card px-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold tracking-tight">
          <span className="text-primary">Call</span>
          <span className="text-foreground">Center</span>
          <span className="text-primary">X</span>
        </span>
        <span className="text-muted-foreground text-xs">// Support Portal</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs border-border bg-transparent hover:bg-secondary">
            Help Center
          </Button>
          <Button size="sm" className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
            Sign In
          </Button>
        </div>
      </header>

      <main className="grid flex-1 items-start md:grid-cols-[1fr_280px]">
        {/* Main content */}
        <div className="flex flex-col">
          {/* Hero strip */}
          <div className="border-b border-border bg-secondary/30 px-6 py-5">
            <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-semibold text-foreground">Customer Support</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Connect with our support team instantly via chat or voice call.
          </p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-3xl p-4">
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="h-8 bg-secondary border border-border gap-0 p-0.5">
                <TabsTrigger value="chat" className="h-7 text-xs px-4 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="call" className="h-7 text-xs px-4 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
                  Voice Call
                </TabsTrigger>
              </TabsList>

              {/* Chat tab */}
              <TabsContent value="chat" className="mt-3">
                <div className="terminal-surface rounded overflow-hidden">
                  {/* Agent info bar */}
                  <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7 rounded">
                        <AvatarImage src="https://i.pravatar.cc/150?img=25" alt="Sarah Wilson" />
                        <AvatarFallback className="rounded text-[9px] bg-primary/20 text-primary">SW</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xs font-medium text-foreground">Sarah Wilson</div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[9px] h-4 px-1 border-border">Support</Badge>
                          <span className="h-1.5 w-1.5 rounded-full status-online" />
                    <span className="text-xs text-muted-foreground">online</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs border-border bg-transparent hover:bg-secondary gap-1.5">
                      <Phone className="h-3 w-3" />
                      Call
                    </Button>
                  </div>

                  {/* Messages */}
                  <div className="h-[380px] overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex gap-2',
                          msg.sender === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {msg.sender === 'agent' && (
                          <Avatar className="h-6 w-6 rounded shrink-0 mt-0.5">
                            <AvatarImage src={msg.avatar} alt={msg.name} />
                            <AvatarFallback className="rounded text-[8px] bg-primary/20 text-primary">
                              {msg.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        {msg.sender === 'system' && (
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-secondary shrink-0 mt-0.5">
                            <HeadphonesIcon className="h-3 w-3 text-primary" />
                          </div>
                        )}
                        <div
                          className={cn(
                            'max-w-[78%] rounded px-3 py-2',
                            msg.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : msg.sender === 'system'
                              ? 'bg-secondary text-secondary-foreground border border-border'
                              : 'bg-secondary border border-border'
                          )}
                        >
                          {msg.sender === 'agent' && (
                            <div className="mb-0.5 text-[10px] font-medium text-primary">{msg.name}</div>
                          )}
                          <p className="text-xs">{msg.content}</p>
                          <div className="mt-1 text-right text-[9px] opacity-50">{msg.time}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <Separator className="bg-border" />

                  {/* Message input */}
                  <form onSubmit={handleSendMessage} className="p-3">
                    <div className="flex gap-2">
                      <Textarea
                        className="min-h-[60px] flex-1 resize-none text-xs bg-background border-border focus-visible:ring-primary font-mono"
                        placeholder="type message... (Enter to send)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="h-9 w-9 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 self-end"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>

              {/* Voice call tab */}
              <TabsContent value="call" className="mt-3">
                <div className="terminal-surface rounded overflow-hidden p-8">
                  {activeCall ? (
                    <div className="flex flex-col items-center gap-5">
                      <div className="relative">
                        <Avatar className="h-20 w-20 rounded">
                          <AvatarImage src="https://i.pravatar.cc/150?img=25" alt="Sarah Wilson" />
                          <AvatarFallback className="rounded text-xl bg-primary/20 text-primary">SW</AvatarFallback>
                        </Avatar>
                        <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-background status-online" />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-foreground">Sarah Wilson</div>
                        <div className="text-xs text-muted-foreground">Customer Support</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="text-[10px] bg-primary/20 text-primary border border-primary/30 animate-pulse">
                          call in progress
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">12:45</span>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant={muted ? 'default' : 'outline'}
                          size="icon"
                          className={cn(
                            'h-11 w-11 rounded-full border-border',
                            muted ? 'bg-destructive hover:bg-destructive/90' : 'bg-transparent hover:bg-secondary'
                          )}
                          onClick={() => setMuted(!muted)}
                        >
                          {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-11 w-11 rounded-full"
                          onClick={() => setActiveCall(false)}
                        >
                          <PhoneOff className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={videoEnabled ? 'default' : 'outline'}
                          size="icon"
                          className={cn(
                            'h-11 w-11 rounded-full border-border',
                            videoEnabled ? 'bg-terminal-cyan hover:bg-terminal-cyan/90' : 'bg-transparent hover:bg-secondary'
                          )}
                          onClick={() => setVideoEnabled(!videoEnabled)}
                        >
                          {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-5">
                      <div className="flex h-20 w-20 items-center justify-center rounded bg-secondary border border-border">
                        <Phone className="h-10 w-10 text-primary" />
                      </div>
                      <div className="text-center space-y-0.5">
                        <div className="text-sm font-medium text-foreground">Start a Voice Call</div>
                        <div className="text-sm text-muted-foreground">
                          Connect with our support team instantly
                        </div>
                      </div>
                      <Button
                        size="lg"
                        className="px-8 h-9 text-sm bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                        onClick={() => setActiveCall(true)}
                      >
                        <Phone className="h-4 w-4" />
                        Start Call
                      </Button>
                      <div className="text-center space-y-0.5">
                        <p className="text-xs text-muted-foreground">Support available 24/7</p>
                        <p className="text-xs text-muted-foreground">Average wait time: &lt; 2 minutes</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* FAQ sidebar */}
        <div className="hidden border-l border-border md:block">
          <div className="p-4">
            <div className="mb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">FAQ</p>
              <h3 className="text-sm font-medium text-foreground">Frequently Asked Questions</h3>
            </div>
            <div className="flex flex-col gap-2">
              {[
                {
                  q: 'How do I track my order?',
                  a: 'Track your order in your account dashboard or use the tracking link in your shipping email.',
                },
                {
                  q: 'What is your return policy?',
                  a: 'We offer a 30-day return policy for most items.',
                },
                {
                  q: 'How do I change my password?',
                  a: "Change your password in account settings. Use 'Forgot Password' if locked out.",
                },
                {
                  q: 'When will I be charged?',
                  a: 'Your card is charged immediately when you place your order.',
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  className="rounded border border-border bg-card p-3 transition-colors hover:bg-secondary cursor-pointer"
                >
                  <h4 className="text-xs font-medium text-foreground mb-0.5">{faq.q}</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Button variant="outline" className="w-full h-7 text-xs border-border bg-transparent hover:bg-secondary">
                View All FAQs
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-3 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 CallCenterX. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
