import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "1 Star",
    count: 15,
  },
  {
    name: "2 Stars",
    count: 30,
  },
  {
    name: "3 Stars",
    count: 120,
  },
  {
    name: "4 Stars",
    count: 240,
  },
  {
    name: "5 Stars",
    count: 350,
  },
];

export function SatisfactionChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
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
        />
        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => {
            let color;
            switch (index) {
              case 0:
                color = "hsl(var(--destructive))";
                break;
              case 1:
                color = "hsl(var(--destructive)/0.7)";
                break;
              case 2:
                color = "hsl(var(--amber-500))";
                break;
              case 3:
                color = "hsl(var(--chart-2))";
                break;
              case 4:
                color = "hsl(var(--chart-1))";
                break;
              default:
                color = "hsl(var(--chart-1))";
            }
            return <Cell key={`cell-${index}`} fill={color} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}