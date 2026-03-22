import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import type { ScenarioResult } from '../types/models';
import { formatDollarsCompact } from '../engine/formatters';
import { COLORS } from '../utils/constants';

interface ReserveTrajectoryChartProps {
  scenarios: ScenarioResult[];
  operatingExpense: number;
}

export default function ReserveTrajectoryChart({
  scenarios,
  operatingExpense,
}: ReserveTrajectoryChartProps) {
  // Merge all scenario projections into a single data array
  const years = scenarios[0]?.yearlyProjections.length || 0;
  const data = Array.from({ length: years }, (_, i) => {
    const entry: Record<string, string | number> = {
      label: scenarios[0]?.yearlyProjections[i]?.label || `Year ${i}`,
    };
    scenarios.forEach((s) => {
      entry[s.name] = s.yearlyProjections[i]?.reserves || 0;
    });
    return entry;
  });

  // Healthy reserve target line (6 months of opex)
  const healthyTarget = operatingExpense * 0.5;

  return (
    <div>
      <h3 className="text-lg font-semibold text-navy mb-1">
        Reserve Trajectory
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Projected reserve balance over 10 years under each scenario
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="gradStabilize" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.stabilize} stopOpacity={0.15} />
              <stop offset="95%" stopColor={COLORS.stabilize} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradCatchUp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.catchUp} stopOpacity={0.15} />
              <stop offset="95%" stopColor={COLORS.catchUp} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradFullyFund" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.fullyFund} stopOpacity={0.15} />
              <stop offset="95%" stopColor={COLORS.fullyFund} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#6b7280' }}
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
            formatter={(value, name) => [
              formatDollarsCompact(Number(value)),
              String(name),
            ]}
            contentStyle={{
              borderRadius: 12,
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Legend />
          <ReferenceLine
            y={healthyTarget}
            stroke="#9ca3af"
            strokeDasharray="6 4"
            label={{
              value: 'Healthy Target',
              position: 'insideTopRight',
              fill: '#9ca3af',
              fontSize: 11,
            }}
          />
          <Area
            type="monotone"
            dataKey="Stabilize"
            stroke={COLORS.stabilize}
            fill="url(#gradStabilize)"
            strokeWidth={2.5}
          />
          <Area
            type="monotone"
            dataKey="Catch Up"
            stroke={COLORS.catchUp}
            fill="url(#gradCatchUp)"
            strokeWidth={2.5}
          />
          <Area
            type="monotone"
            dataKey="Fully Fund"
            stroke={COLORS.fullyFund}
            fill="url(#gradFullyFund)"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
