import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const performanceData = [
  { day: "Mon", calls: 15, resolutionRate: 87 },
  { day: "Tue", calls: 18, resolutionRate: 92 },
  { day: "Wed", calls: 14, resolutionRate: 85 },
  { day: "Thu", calls: 16, resolutionRate: 88 },
  { day: "Fri", calls: 19, resolutionRate: 93 },
  { day: "Sat", calls: 12, resolutionRate: 90 },
  { day: "Sun", calls: 9, resolutionRate: 95 },
];

export function AgentStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="text-base">Weekly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                yAxisId="right"
                orientation="right"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="calls"
                name="Calls Handled"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="resolutionRate"
                name="Resolution Rate (%)"
                fill="hsl(var(--chart-2))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Average Handle Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4m 12s</div>
          <p className="text-xs text-muted-foreground">
            -18s from last week
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>You</span>
              <span className="text-green-500">Faster</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-muted">
              <div className="absolute inset-y-0 left-0 w-[35%] rounded-full bg-green-500"></div>
              <div className="absolute inset-y-0 left-[45%] h-4 w-0.5 -translate-y-1 bg-muted-foreground"></div>
            </div>
            <div className="flex items-center justify-end text-xs mt-1">
              <span className="text-xs text-muted-foreground">Team avg: 5m 08s</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Satisfaction Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4.7/5</div>
          <p className="text-xs text-muted-foreground">
            +0.2 from last month
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-xs">1</span>
              <span className="text-xs">5</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-2 w-[94%] rounded-full bg-primary"></div>
            </div>
            <div className="flex items-center justify-end text-xs mt-1">
              <span className="text-xs text-muted-foreground">Based on 128 ratings</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            First Call Resolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">83%</div>
          <p className="text-xs text-muted-foreground">
            +5% from last month
          </p>
          <div className="mt-4">
            <Progress value={83} className="h-2" />
            <div className="flex items-center justify-between text-xs mt-2">
              <span>Your FCR</span>
              <span className="text-muted-foreground">Team Avg: 78%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Adherence to Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">98.5%</div>
          <p className="text-xs text-muted-foreground">
            +1.2% from last month
          </p>
          <div className="mt-4">
            <Progress value={98.5} className="h-2" />
            <div className="flex items-center justify-between text-xs mt-2">
              <span>Target: 95%</span>
              <span className="text-green-500">Exceeding</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}