import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Mon",
    inbound: 120,
    outbound: 75,
    abandoned: 15,
  },
  {
    name: "Tue",
    inbound: 170,
    outbound: 90,
    abandoned: 20,
  },
  {
    name: "Wed",
    inbound: 140,
    outbound: 85,
    abandoned: 12,
  },
  {
    name: "Thu",
    inbound: 180,
    outbound: 100,
    abandoned: 18,
  },
  {
    name: "Fri",
    inbound: 160,
    outbound: 110,
    abandoned: 15,
  },
  {
    name: "Sat",
    inbound: 90,
    outbound: 55,
    abandoned: 8,
  },
  {
    name: "Sun",
    inbound: 75,
    outbound: 40,
    abandoned: 5,
  },
];

export function CallVolumeChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
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
          <linearGradient id="colorAbandoned" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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
        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }} />
        <Legend />
        <Area
          type="monotone"
          dataKey="inbound"
          stroke="hsl(var(--chart-1))"
          fillOpacity={1}
          fill="url(#colorInbound)"
          name="Inbound"
        />
        <Area
          type="monotone"
          dataKey="outbound"
          stroke="hsl(var(--chart-2))"
          fillOpacity={1}
          fill="url(#colorOutbound)"
          name="Outbound"
        />
        <Area
          type="monotone"
          dataKey="abandoned"
          stroke="hsl(var(--destructive))"
          fillOpacity={1}
          fill="url(#colorAbandoned)"
          name="Abandoned"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}