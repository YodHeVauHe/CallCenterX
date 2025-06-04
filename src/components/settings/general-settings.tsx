import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Building, Check, HelpCircle } from "lucide-react";

export function GeneralSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Configure basic settings for your call center
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Company Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" defaultValue="Acme Corporation" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-domain">Company Domain</Label>
              <Input id="company-domain" defaultValue="acme.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" defaultValue="Technology" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-size">Company Size</Label>
              <Input id="company-size" defaultValue="51-200 employees" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-description">Company Description</Label>
            <Textarea
              id="company-description"
              className="min-h-[100px]"
              defaultValue="Acme Corporation is a leading provider of technology solutions for businesses of all sizes."
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Business Hours</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weekday-hours">Weekday Hours</Label>
              <Input id="weekday-hours" defaultValue="9:00 AM - 6:00 PM" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weekend-hours">Weekend Hours</Label>
              <Input id="weekend-hours" defaultValue="Closed" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="Eastern Time (ET)" />
            </div>
          </div>
          <div className="rounded-md border border-border bg-muted/40 p-4">
            <div className="flex items-start space-x-4">
              <HelpCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">After-hours handling</p>
                <p className="text-sm text-muted-foreground">
                  Configure how calls are handled outside of business hours in the Call Routing settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Branding</h3>
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Building className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Company Logo</p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Change
                </Button>
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="primary-color">Primary Color</Label>
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-blue-600"></div>
              <Input id="primary-color" defaultValue="#1E40AF" className="w-[180px]" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for important events
                </p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-assign">Auto-assign Calls</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically assign incoming calls to available agents
                </p>
              </div>
              <Switch id="auto-assign" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="call-recording">Call Recording</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically record all calls
                </p>
              </div>
              <Switch id="call-recording" defaultChecked />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>
          <Check className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}