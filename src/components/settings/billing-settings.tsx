import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreditCard, Download, HelpCircle, Info, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InvoiceItem {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "failed";
}

const invoices: InvoiceItem[] = [
  {
    id: "INV-001",
    date: "Jun 1, 2023",
    amount: "$599.00",
    status: "paid",
  },
  {
    id: "INV-002",
    date: "May 1, 2023",
    amount: "$599.00",
    status: "paid",
  },
  {
    id: "INV-003",
    date: "Apr 1, 2023",
    amount: "$499.00",
    status: "paid",
  },
  {
    id: "INV-004",
    date: "Mar 1, 2023",
    amount: "$499.00",
    status: "paid",
  },
];

export function BillingSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Billing & Subscription</CardTitle>
          <CardDescription>
            Manage your subscription plan and billing details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">Professional Plan</h3>
                  <Badge>Current Plan</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  $599 per month, billed monthly
                </p>
              </div>
              <Button>Upgrade Plan</Button>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>Call Minutes: 18,245 / 25,000</span>
                  <span className="text-muted-foreground">73% used</span>
                </div>
                <Progress value={73} className="h-2 mt-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>Agent Seats: 15 / 20</span>
                  <span className="text-muted-foreground">75% used</span>
                </div>
                <Progress value={75} className="h-2 mt-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>Storage: 45 GB / 100 GB</span>
                  <span className="text-muted-foreground">45% used</span>
                </div>
                <Progress value={45} className="h-2 mt-2" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">View Usage Details</Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Payment Method</h3>
            <div className="rounded-lg border p-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">Visa ending in 4242</p>
                    <Badge variant="outline">Default</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Expires 04/2025
                  </p>
                </div>
                <Button variant="outline">Update</Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Billing History</h3>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download All
              </Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            invoice.status === "paid"
                              ? "default"
                              : invoice.status === "pending"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>Next Billing Cycle</AlertTitle>
            <AlertDescription>
              Your next billing date is July 1, 2023. You will be charged $599.00.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="border-t bg-muted/40 flex justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <HelpCircle className="mr-2 h-4 w-4" />
            Need help with billing? Contact our <a href="#" className="underline ml-1">support team</a>
          </div>
          <Button variant="outline">
            <AlertCircle className="mr-2 h-4 w-4" />
            Cancel Subscription
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}