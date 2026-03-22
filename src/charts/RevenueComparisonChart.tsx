import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ScenarioResult } from '../types/models';
import { formatDollarsCompact } from '../engine/formatters';
import { COLORS } from '../utils/constants';

interface RevenueComparisonChartProps {
  currentRevenue: number;
  scenarios: ScenarioResult[];
}

export default function RevenueComparisonChart({
  currentRevenue,
  scenarios,
}: RevenueComparisonChartProps) {
  const data = [
    {
      name: 'Current',
      revenue: currentRevenue,
      fill: '#9ca3af',
    },
    ...scenarios.map((s, i) => ({
      name: s.name,
      revenue: s.annualRevenueNeeded,
      fill: [COLORS.stabilize, COLORS.catchUp, COLORS.fullyFund][i],
    })),
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-navy mb-1">
        Current vs. Needed Revenue
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Annual revenue under each planning scenario
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => formatDollarsCompact(v)}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [formatDollarsCompact(Number(value)), 'Revenue']}
            contentStyle={{
              borderRadius: 12,
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <rect key={index} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
