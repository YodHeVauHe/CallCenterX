import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { GeneralSettings } from '@/components/settings/general-settings';
import { IntegrationSettings } from '@/components/settings/integration-settings';
import { TeamSettings } from '@/components/settings/team-settings';
import { BillingSettings } from '@/components/settings/billing-settings';

export function Settings() {
  return (
    <div className="flex flex-col gap-5 fade-in">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="h-8 bg-secondary border border-border gap-0 p-0.5 flex-wrap">
          <TabsTrigger value="general" className="h-7 text-xs px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
            General
          </TabsTrigger>
          <TabsTrigger value="team" className="h-7 text-xs px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
            Team
          </TabsTrigger>
          <TabsTrigger value="integrations" className="h-7 text-xs px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
            Integrations
          </TabsTrigger>
          <TabsTrigger value="billing" className="h-7 text-xs px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
            Billing
          </TabsTrigger>
          <TabsTrigger value="advanced" className="h-7 text-xs px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:text-primary">
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="pt-4">
          <GeneralSettings />
        </TabsContent>
        <TabsContent value="team" className="pt-4">
          <TeamSettings />
        </TabsContent>
        <TabsContent value="integrations" className="pt-4">
          <IntegrationSettings />
        </TabsContent>
        <TabsContent value="billing" className="pt-4">
          <BillingSettings />
        </TabsContent>

        <TabsContent value="advanced" className="pt-4 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="px-4 pt-4 pb-2">
              <p className="text-xs text-muted-foreground mb-0.5">Data Management</p>
              <CardTitle className="text-sm font-medium text-foreground">Storage &amp; retention</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-delete" className="text-sm text-foreground">
                    Auto-delete recordings
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Delete call recordings after 90 days
                  </p>
                </div>
                <Switch id="auto-delete" />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-export" className="text-sm text-foreground">
                    Weekly data export
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Send an automated weekly export of all call data
                  </p>
                </div>
                <Switch id="data-export" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="px-4 pt-4 pb-2">
              <p className="text-xs text-muted-foreground mb-0.5">Security</p>
              <CardTitle className="text-sm font-medium text-foreground">Access &amp; authentication</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="2fa" className="text-sm text-foreground">
                    Two-factor authentication
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Require 2FA for all admin users
                  </p>
                </div>
                <Switch id="2fa" />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ip-restrict" className="text-sm text-foreground">
                    IP restrictions
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Restrict access to specific IP addresses
                  </p>
                </div>
                <Switch id="ip-restrict" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-destructive/30">
            <CardHeader className="px-4 pt-4 pb-2">
              <p className="text-xs text-destructive/70 mb-0.5">Danger Zone</p>
              <CardTitle className="text-sm font-medium text-destructive">Irreversible actions</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-center gap-3 rounded border border-destructive/20 bg-destructive/5 p-3">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-medium text-foreground">Delete Account</p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete your account and all associated data. This cannot be undone.
                  </p>
                </div>
                <Button variant="destructive" size="sm" className="h-7 text-xs shrink-0">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
