import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SpendingHistory = ({ data }: any) => (
  <div className="xl:col-span-2 bg-surface border border-app rounded-3xl p-8">
    <h3 className="text-xl font-black mb-8">Spending vs Budget History</h3>
    {!data?.length ? (
      <div className="h-[400px] flex items-center justify-center text-muted-app font-bold text-sm">
        No history available
      </div>
    ) : (
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(125, 133, 144, 0.1)"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--surface)",
                border: "1px solid rgba(125, 133, 144, 0.2)",
                borderRadius: "12px",
              }}
              cursor={{ fill: "rgba(125, 133, 144, 0.05)" }}
            />
            <Legend verticalAlign="top" align="right" />
            <Bar
              dataKey="spent"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
              name="Actual Spend"
            />
            <Bar
              dataKey="budget"
              fill="var(--muted)"
              fillOpacity={0.2}
              radius={[4, 4, 0, 0]}
              name="Budget Limit"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>
);

export default SpendingHistory;
