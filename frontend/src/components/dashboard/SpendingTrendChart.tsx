import { useState } from "react";
import { useGetSpendingTrendQuery } from "../../store/api/expenseApi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SpendingTrendChart = () => {
  const [days, setDays] = useState(30);

  const { trend = [], isLoading } = useGetSpendingTrendQuery(
    { days },
    {
      selectFromResult: ({ data, isLoading }) => ({
        trend: (data?.trend ?? []).map((item: any) => ({
          ...item,
          label: new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        })),
        isLoading,
      }),
    },
  );

  if (isLoading)
    return <div className="h-[300px] animate-pulse bg-muted/10 rounded-2xl" />;

  return (
    <div className="lg:col-span-2 bg-surface border border-app rounded-3xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black">Spending Trend</h3>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="bg-app border border-app rounded-lg px-3 py-1.5 text-xs font-bold outline-none"
        >
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 3 Months</option>
        </select>
      </div>

      {trend.length === 0 ? (
        <div className="h-[300px] flex flex-col items-center justify-center text-center">
          <span className="text-4xl mb-3">📈</span>
          <p className="font-bold text-sm">No spending data available</p>
          <p className="text-muted-app text-xs font-medium mt-1">
            Log some expenses to see your spending trend.
          </p>
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(125, 133, 144, 0.1)"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted)", fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted)", fontSize: 12, fontWeight: 500 }}
                tickFormatter={(val: number) => `$${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid rgba(125, 133, 144, 0.2)",
                  borderRadius: "12px",
                }}
                itemStyle={{ color: "var(--text)", fontWeight: "bold" }}
                formatter={(val: number) => [`$${val}`, "Spent"]}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--primary)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorAmt)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SpendingTrendChart;
