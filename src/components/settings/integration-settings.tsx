import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, ExternalLink, HelpCircle, Link, PlugZap, Settings } from "lucide-react";

interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "connected" | "disconnected";
  category: "crm" | "communication" | "ai" | "other";
}

const integrations: IntegrationItem[] = [
  {
    id: "1",
    name: "Salesforce",
    description: "Connect your Salesforce CRM to sync customer data",
    icon: "https://cdn.worldvectorlogo.com/logos/salesforce-2.svg",
    status: "connected",
    category: "crm",
  },
  {
    id: "2",
    name: "HubSpot",
    description: "Integrate with HubSpot to manage customer relationships",
    icon: "https://cdn.worldvectorlogo.com/logos/hubspot-1.svg",
    status: "disconnected",
    category: "crm",
  },
  {
    id: "3",
    name: "Twilio",
    description: "Connect Twilio for phone calls and SMS messaging",
    icon: "https://cdn.worldvectorlogo.com/logos/twilio.svg",
    status: "connected",
    category: "communication",
  },
  {
    id: "4",
    name: "Slack",
    description: "Receive notifications and updates in your Slack channels",
    icon: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg",
    status: "connected",
    category: "communication",
  },
  {
    id: "5",
    name: "ElevenLabs",
    description: "AI voice synthesis for automated responses",
    icon: "https://app.elevenlabs.io/favicon.png",
    status: "connected",
    category: "ai",
  },
  {
    id: "6",
    name: "OpenAI",
    description: "Use ChatGPT for automated customer responses",
    icon: "https://cdn.worldvectorlogo.com/logos/openai-2.svg",
    status: "connected",
    category: "ai",
  },
  {
    id: "7",
    name: "Zapier",
    description: "Connect with thousands of apps through Zapier",
    icon: "https://cdn.worldvectorlogo.com/logos/zapier-1.svg",
    status: "disconnected",
    category: "other",
  },
  {
    id: "8",
    name: "Google Calendar",
    description: "Sync call schedules with Google Calendar",
    icon: "https://cdn.worldvectorlogo.com/logos/google-calendar-2020.svg",
    status: "connected",
    category: "other",
  },
];

export function IntegrationSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Connect with your favorite tools and services
              </CardDescription>
            </div>
            <Button variant="outline">
              <PlugZap className="mr-2 h-4 w-4" />
              Add Integration
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4 rounded-lg border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
              <Link className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Connected Integrations</h3>
              <p className="text-sm text-muted-foreground">
                You have 5 active integrations. Manage their settings below.
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Manage API Keys
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">CRM Integrations</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {integrations
                .filter((integration) => integration.category === "crm")
                .map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-start space-x-4 rounded-lg border p-4"
                  >
                    <img
                      src={integration.icon}
                      alt={integration.name}
                      className="h-10 w-10"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{integration.name}</h4>
                        <Badge
                          variant={
                            integration.status === "connected"
                              ? "default"
                              : "outline"
                          }
                        >
                          {integration.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {integration.status === "connected" ? (
                            <Button variant="outline\" size="sm">
                              Configure
                            </Button>
                          ) : (
                            <Button size="sm">Connect</Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                        {integration.status === "connected" && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              Enabled
                            </span>
                            <Switch defaultChecked />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Communication Tools</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {integrations
                .filter((integration) => integration.category === "communication")
                .map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-start space-x-4 rounded-lg border p-4"
                  >
                    <img
                      src={integration.icon}
                      alt={integration.name}
                      className="h-10 w-10"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{integration.name}</h4>
                        <Badge
                          variant={
                            integration.status === "connected"
                              ? "default"
                              : "outline"
                          }
                        >
                          {integration.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {integration.status === "connected" ? (
                            <Button variant="outline\" size="sm">
                              Configure
                            </Button>
                          ) : (
                            <Button size="sm">Connect</Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                        {integration.status === "connected" && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              Enabled
                            </span>
                            <Switch defaultChecked />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">AI & Automation</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {integrations
                .filter((integration) => integration.category === "ai")
                .map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-start space-x-4 rounded-lg border p-4"
                  >
                    <img
                      src={integration.icon}
                      alt={integration.name}
                      className="h-10 w-10"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{integration.name}</h4>
                        <Badge
                          variant={
                            integration.status === "connected"
                              ? "default"
                              : "outline"
                          }
                        >
                          {integration.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {integration.status === "connected" ? (
                            <Button variant="outline\" size="sm">
                              Configure
                            </Button>
                          ) : (
                            <Button size="sm">Connect</Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                        {integration.status === "connected" && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              Enabled
                            </span>
                            <Switch defaultChecked />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Other Integrations</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {integrations
                .filter((integration) => integration.category === "other")
                .map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-start space-x-4 rounded-lg border p-4"
                  >
                    <img
                      src={integration.icon}
                      alt={integration.name}
                      className="h-10 w-10"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{integration.name}</h4>
                        <Badge
                          variant={
                            integration.status === "connected"
                              ? "default"
                              : "outline"
                          }
                        >
                          {integration.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {integration.status === "connected" ? (
                            <Button variant="outline\" size="sm">
                              Configure
                            </Button>
                          ) : (
                            <Button size="sm">Connect</Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                        {integration.status === "connected" && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              Enabled
                            </span>
                            <Switch defaultChecked />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/40 flex justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <HelpCircle className="mr-2 h-4 w-4" />
            Need help with integrations? Check our <a href="#" className="underline ml-1">documentation</a>
          </div>
          <Button variant="outline">Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}