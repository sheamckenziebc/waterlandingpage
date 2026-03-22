import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { formatDollarsCompact } from '../engine/formatters';
import { COLORS } from '../utils/constants';

interface FundingGapChartProps {
  revenue: number;
  operatingExpense: number;
  debtService: number;
  capitalNeed: number;
}

export default function FundingGapChart({
  revenue,
  operatingExpense,
  debtService,
  capitalNeed,
}: FundingGapChartProps) {
  const totalObligations = operatingExpense + debtService + capitalNeed;
  const gap = revenue - totalObligations;

  const data = [
    { name: 'Revenue', value: revenue, color: COLORS.teal },
    { name: 'Operating', value: -operatingExpense, color: COLORS.danger },
    { name: 'Debt', value: -debtService, color: COLORS.amber },
    { name: 'Capital Need', value: -capitalNeed, color: COLORS.navy },
    {
      name: gap >= 0 ? 'Surplus' : 'Gap',
      value: gap,
      color: gap >= 0 ? COLORS.teal : COLORS.danger,
    },
  ].filter((d) => d.value !== 0);

  return (
    <div>
      <h3 className="text-lg font-semibold text-navy mb-1">
        Funding Overview
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        How your revenue stacks up against your obligations
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
            formatter={(value) => [
              formatDollarsCompact(Math.abs(Number(value))),
              '',
            ]}
            contentStyle={{
              borderRadius: 12,
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <ReferenceLine y={0} stroke="#9ca3af" />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
