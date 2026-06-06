"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartPoint = { month: string; revenue: number };

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-neutral-400 mb-1">{label}</p>
      <p className="text-white font-bold text-sm">
        ₦{payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function RevenueChart({ data }: { data: ChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="month"
          tick={{ fill: "#737373", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
          tick={{ fill: "#737373", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#f43f5e"
          strokeWidth={2}
          fill="url(#revenueGrad)"
          dot={{ fill: "#f43f5e", r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#f43f5e" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
