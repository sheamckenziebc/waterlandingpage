import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { ScenarioResult } from '../types/models';
import { COLORS } from '../utils/constants';

interface ScenarioComparisonChartProps {
  scenarios: ScenarioResult[];
}

export default function ScenarioComparisonChart({
  scenarios,
}: ScenarioComparisonChartProps) {
  const data = [
    {
      metric: 'Annual Increase',
      Stabilize: scenarios[0]?.annualRateIncrease || 0,
      'Catch Up': scenarios[1]?.annualRateIncrease || 0,
      'Fully Fund': scenarios[2]?.annualRateIncrease || 0,
    },
  ];

  // Add bill impact if available
  if (scenarios[0]?.monthlyBillIncrease > 0) {
    data.push({
      metric: 'Monthly Bill Change ($)',
      Stabilize: scenarios[0]?.monthlyBillIncrease || 0,
      'Catch Up': scenarios[1]?.monthlyBillIncrease || 0,
      'Fully Fund': scenarios[2]?.monthlyBillIncrease || 0,
    });
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-navy mb-1">
        Scenario Comparison
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Annual rate increase (%) under each planning approach
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
          <XAxis
            dataKey="metric"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Legend />
          <Bar
            dataKey="Stabilize"
            fill={COLORS.stabilize}
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="Catch Up"
            fill={COLORS.catchUp}
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="Fully Fund"
            fill={COLORS.fullyFund}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
