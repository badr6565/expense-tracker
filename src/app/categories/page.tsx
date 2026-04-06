'use client';

import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart2, TrendingUp, Tag } from 'lucide-react';
import { getExpenses } from '@/lib/storage';
import { CATEGORIES, CATEGORY_COLORS, Category } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';
import CategoryRankCard from '@/components/CategoryRankCard';
import { subMonths, isAfter, parseISO } from 'date-fns';

type Range = 'month' | '3months' | '6months' | 'all';

const RANGE_LABELS: Record<Range, string> = {
  month: 'This Month',
  '3months': 'Last 3 Months',
  '6months': 'Last 6 Months',
  all: 'All Time',
};

function getCutoff(range: Range): Date | null {
  const now = new Date();
  if (range === 'month') return subMonths(now, 1);
  if (range === '3months') return subMonths(now, 3);
  if (range === '6months') return subMonths(now, 6);
  return null;
}

export default function CategoriesPage() {
  const [range, setRange] = useState<Range>('all');

  const expenses = useMemo(() => {
    const all = getExpenses();
    const cutoff = getCutoff(range);
    if (!cutoff) return all;
    return all.filter((e) => isAfter(parseISO(e.date), cutoff));
  }, [range]);

  const stats = useMemo(() => {
    const totals: Record<Category, { total: number; count: number }> = {} as never;
    for (const cat of CATEGORIES) totals[cat] = { total: 0, count: 0 };

    let grandTotal = 0;
    for (const e of expenses) {
      totals[e.category].total += e.amount;
      totals[e.category].count += 1;
      grandTotal += e.amount;
    }

    const ranked = CATEGORIES
      .map((cat) => ({ category: cat, ...totals[cat] }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.total - a.total);

    return { ranked, grandTotal };
  }, [expenses]);

  const pieData = stats.ranked.map((c) => ({
    name: c.category,
    value: c.total,
  }));

  const maxTotal = stats.ranked[0]?.total ?? 0;
  const usedCategories = stats.ranked.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tag size={22} className="text-indigo-600" />
            Top Expense Categories
          </h1>
          <p className="text-sm text-gray-500 mt-1">Understand where your money goes</p>
        </div>

        {/* Date range filter */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1 w-fit">
          {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                range === r
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
              <TrendingUp size={14} className="text-indigo-500" />
              Total Spending
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.grandTotal)}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
              <BarChart2 size={14} className="text-indigo-500" />
              Most Spent
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.ranked[0] ? stats.ranked[0].category : '—'}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
              <Tag size={14} className="text-indigo-500" />
              Categories Used
            </div>
            <p className="text-2xl font-bold text-gray-900">{usedCategories}</p>
          </div>
        </div>

        {stats.ranked.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <Tag size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No expenses found for this period</p>
            <p className="text-sm text-gray-400 mt-1">Try a different date range or add some expenses</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Spending Breakdown</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={CATEGORY_COLORS[entry.name as Category]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(Number(value)), 'Spent']}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-xs text-gray-600">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Ranked list */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-700">Ranked by Spending</h2>
              {stats.ranked.map((c, i) => (
                <CategoryRankCard
                  key={c.category}
                  rank={i + 1}
                  category={c.category}
                  total={c.total}
                  count={c.count}
                  percentage={stats.grandTotal > 0 ? (c.total / stats.grandTotal) * 100 : 0}
                  maxTotal={maxTotal}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
