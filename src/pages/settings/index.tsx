import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Building, Check, HelpCircle, Users } from 'lucide-react';
import { GeneralSettings } from '@/components/settings/general-settings';
import { IntegrationSettings } from '@/components/settings/integration-settings';
import { TeamSettings } from '@/components/settings/team-settings';
import { BillingSettings } from '@/components/settings/billing-settings';

export function Settings() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 pt-4">
          <GeneralSettings />
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4 pt-4">
          <TeamSettings />
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-4 pt-4">
          <IntegrationSettings />
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-4 pt-4">
          <BillingSettings />
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced settings for your call center.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Management</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-delete">Auto-delete call recordings</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically delete call recordings after 90 days
                      </p>
                    </div>
                    <Switch id="auto-delete" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-export">Weekly data export</Label>
                      <p className="text-sm text-muted-foreground">
                        Send an automated weekly export of all call data
                      </p>
                    </div>
                    <Switch id="data-export" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="2fa">Two-factor authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require two-factor authentication for all admin users
                      </p>
                    </div>
                    <Switch id="2fa" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ip-restrict">IP restrictions</Label>
                      <p className="text-sm text-muted-foreground">
                        Restrict access to specific IP addresses
                      </p>
                    </div>
                    <Switch id="ip-restrict" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Danger Zone</h3>
                <div className="rounded-md border border-destructive/20 p-4">
                  <div className="flex items-center space-x-4">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}