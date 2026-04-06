'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Expense, Category, CATEGORY_COLORS } from '@/types/expense';
import { getMonthlyTrend, getSpendingByCategory, formatCurrency } from '@/lib/utils';

interface ChartsProps {
  expenses: Expense[];
}

interface TooltipProps { active?: boolean; payload?: { value: number; name: string; payload: { fill: string; percent: string } }[]; label?: string; }
const CustomTooltipBar = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-lg text-sm">
        <p className="font-medium text-gray-700">{label}</p>
        <p className="text-indigo-600 font-bold">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const CustomTooltipPie = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-lg text-sm">
        <p className="font-medium text-gray-700">{payload[0].name}</p>
        <p className="font-bold" style={{ color: payload[0].payload.fill }}>
          {formatCurrency(payload[0].value)}
        </p>
        <p className="text-gray-400">{payload[0].payload.percent}</p>
      </div>
    );
  }
  return null;
};

export default function Charts({ expenses }: ChartsProps) {
  const monthlyTrend = getMonthlyTrend(expenses);
  const byCategory = getSpendingByCategory(expenses);
  const total = Object.values(byCategory).reduce((a, b) => a + b, 0);

  const pieData = (Object.entries(byCategory) as [Category, number][])
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      fill: CATEGORY_COLORS[category],
      percent: total > 0 ? `${((amount / total) * 100).toFixed(1)}%` : '0%',
    }))
    .sort((a, b) => b.value - a.value);

  const hasData = expenses.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Trend */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Monthly Spending</h3>
        {hasData && monthlyTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyTrend} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${v}`}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                width={55}
              />
              <Tooltip content={<CustomTooltipBar />} />
              <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
            No data to display
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-4">By Category</h3>
        {hasData && pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltipPie />} />
              <Legend
                formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
            No data to display
          </div>
        )}
      </div>
    </div>
  );
}
