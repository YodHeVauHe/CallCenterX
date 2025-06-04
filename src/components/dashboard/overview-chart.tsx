import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Mon",
    total: 180,
    inbound: 130,
    outbound: 50,
  },
  {
    name: "Tue",
    total: 240,
    inbound: 170,
    outbound: 70,
  },
  {
    name: "Wed",
    total: 320,
    inbound: 200,
    outbound: 120,
  },
  {
    name: "Thu",
    total: 280,
    inbound: 190,
    outbound: 90,
  },
  {
    name: "Fri",
    total: 260,
    inbound: 170,
    outbound: 90,
  },
  {
    name: "Sat",
    total: 120,
    inbound: 80,
    outbound: 40,
  },
  {
    name: "Sun",
    total: 90,
    inbound: 60,
    outbound: 30,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }} />
        <Area
          type="monotone"
          dataKey="inbound"
          stroke="hsl(var(--chart-1))"
          fillOpacity={1}
          fill="url(#colorInbound)"
          stackId="1"
          name="Inbound"
        />
        <Area
          type="monotone"
          dataKey="outbound"
          stroke="hsl(var(--chart-2))"
          fillOpacity={1}
          fill="url(#colorOutbound)"
          stackId="1"
          name="Outbound"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}