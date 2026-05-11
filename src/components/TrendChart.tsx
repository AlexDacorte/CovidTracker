import { GlassCard } from "./GlassCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { HistoricalData } from "@/services/covidApi";

interface TrendChartProps {
  data?: HistoricalData;
  isLoading?: boolean;
  title: string;
}

function transformData(data: HistoricalData) {
  const dates = Object.keys(data.cases);
  return dates.map((date) => ({
    date,
    cases: data.cases[date],
    deaths: data.deaths[date],
    recovered: data.recovered[date] || 0,
  }));
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-strong p-3 text-xs space-y-1">
      <p className="font-semibold text-foreground">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {Number(entry.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export function TrendChart({ data, isLoading, title }: TrendChartProps) {
  const chartData = data ? transformData(data) : [];

  return (
    <GlassCard hover={false} className="col-span-full">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {isLoading ? (
        <Skeleton className="h-72 w-full bg-muted" />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(200, 60%, 50%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(200, 60%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDeaths" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(145, 65%, 42%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(145, 65%, 42%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(230, 15%, 30%, 0.3)" />
            <XAxis
              dataKey="date"
              stroke="hsl(215, 20%, 55%)"
              tick={{ fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(215, 20%, 55%)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              tickFormatter={(v) => (v >= 1e6 ? `${(v / 1e6).toFixed(0)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="cases" stroke="hsl(200, 60%, 50%)" fill="url(#colorCases)" name="Cases" />
            <Area type="monotone" dataKey="deaths" stroke="hsl(0, 72%, 55%)" fill="url(#colorDeaths)" name="Deaths" />
            <Area type="monotone" dataKey="recovered" stroke="hsl(145, 65%, 42%)" fill="url(#colorRecovered)" name="Recovered" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </GlassCard>
  );
}
