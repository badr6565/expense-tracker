'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { getExpenses } from '@/lib/storage';
import { CATEGORIES, CATEGORY_COLORS, Category } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
  subDays,
  parseISO,
  isWithinInterval,
} from 'date-fns';

const CATEGORY_EMOJI: Record<Category, string> = {
  Food: '🍔',
  Transportation: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Bills: '💡',
  Other: '📦',
};

function computeStreak(dates: string[]): number {
  const dateSet = new Set(dates);
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  // Start from today if it has an expense, else from yesterday (mid-day grace)
  let cursor = dateSet.has(todayStr) ? today : subDays(today, 1);
  if (!dateSet.has(format(cursor, 'yyyy-MM-dd'))) return 0;

  let streak = 0;
  while (dateSet.has(format(cursor, 'yyyy-MM-dd'))) {
    streak++;
    cursor = subDays(cursor, 1);
  }
  return streak;
}

export default function MonthlyInsights() {
  const router = useRouter();
  const [activeMonth, setActiveMonth] = useState(new Date());
  const [streakEnabled, setStreakEnabled] = useState(false);

  const allExpenses = useMemo(() => getExpenses(), []);

  const monthExpenses = useMemo(() => {
    const start = startOfMonth(activeMonth);
    const end = endOfMonth(activeMonth);
    return allExpenses.filter((e) => {
      try {
        return isWithinInterval(parseISO(e.date), { start, end });
      } catch {
        return false;
      }
    });
  }, [allExpenses, activeMonth]);

  const { topCategories, grandTotal } = useMemo(() => {
    const totals: Record<Category, number> = {} as Record<Category, number>;
    for (const cat of CATEGORIES) totals[cat] = 0;
    let grandTotal = 0;
    for (const e of monthExpenses) {
      totals[e.category] += e.amount;
      grandTotal += e.amount;
    }
    const topCategories = CATEGORIES
      .map((cat) => ({ category: cat, total: totals[cat] }))
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
    return { topCategories, grandTotal };
  }, [monthExpenses]);

  const pieData = useMemo(() => {
    const totals: Record<Category, number> = {} as Record<Category, number>;
    for (const cat of CATEGORIES) totals[cat] = 0;
    for (const e of monthExpenses) totals[e.category] += e.amount;
    return CATEGORIES
      .map((cat) => ({ name: cat, value: totals[cat] }))
      .filter((c) => c.value > 0);
  }, [monthExpenses]);

  const streak = useMemo(
    () => computeStreak(allExpenses.map((e) => e.date)),
    [allExpenses]
  );

  const isCurrentMonth =
    format(activeMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM');

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Lightbulb size={22} className="text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Monthly Insights</h1>
          </div>
        </div>

        {/* Month navigator */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setActiveMonth((m) => subMonths(m, 1))}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-base font-semibold text-gray-800 w-36 text-center">
            {format(activeMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setActiveMonth((m) => addMonths(m, 1))}
            disabled={isCurrentMonth}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {monthExpenses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <Lightbulb size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No expenses this month</p>
            <p className="text-sm text-gray-400 mt-1">Add some expenses to see your insights</p>
          </div>
        ) : (
          <>
            {/* Donut chart card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="relative">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={62}
                      outerRadius={96}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
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
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        fontSize: '13px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Donut center label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Spending
                    </p>
                    <p className="text-lg font-bold text-gray-900 mt-0.5">
                      {formatCurrency(grandTotal)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top 3 categories */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Top 3
              </p>
              {topCategories.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No data</p>
              ) : (
                topCategories.map((item, i) => (
                  <div key={item.category} className="flex items-center gap-3 py-2.5">
                    {/* Colored accent bar */}
                    <div
                      className="w-1 h-10 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
                    />
                    {/* Rank number */}
                    <span className="text-xs font-bold text-gray-300 w-4 text-center flex-shrink-0">
                      {i + 1}
                    </span>
                    {/* Emoji */}
                    <span className="text-xl flex-shrink-0">
                      {CATEGORY_EMOJI[item.category]}
                    </span>
                    {/* Name + amount */}
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="text-sm font-semibold text-gray-800">
                        {item.category}
                      </span>
                      <span className="text-sm font-bold text-gray-900 ml-2">
                        {formatCurrency(item.total)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Budget Streak box */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Budget Streak</p>
                  <div className="flex items-end gap-1.5">
                    <span
                      className={`text-5xl font-extrabold leading-none transition-colors ${
                        streakEnabled ? 'text-emerald-500' : 'text-gray-300'
                      }`}
                    >
                      {streak}
                    </span>
                    <span
                      className={`text-base font-semibold mb-1 transition-colors ${
                        streakEnabled ? 'text-emerald-500' : 'text-gray-300'
                      }`}
                    >
                      days!
                    </span>
                  </div>
                  {streakEnabled && streak > 0 && (
                    <p className="text-xs text-gray-400 mt-2">
                      {streak === 1
                        ? 'You logged an expense today — keep it up!'
                        : `${streak} consecutive days tracked`}
                    </p>
                  )}
                </div>

                {/* Toggle */}
                <button
                  onClick={() => setStreakEnabled((v) => !v)}
                  aria-label="Toggle streak tracking"
                  className={`relative w-14 h-7 rounded-full transition-colors duration-200 flex-shrink-0 ${
                    streakEnabled ? 'bg-emerald-500' : 'bg-transparent'
                  }`}
                  style={
                    streakEnabled
                      ? {}
                      : {
                          background: `repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 4px,
                            rgba(0,0,0,0.08) 4px,
                            rgba(0,0,0,0.08) 8px
                          )`,
                          border: '2px solid #d1d5db',
                        }
                  }
                >
                  <span
                    className={`absolute top-0.5 w-6 h-6 rounded-full shadow transition-all duration-200 ${
                      streakEnabled
                        ? 'left-7 bg-white'
                        : 'left-0.5 bg-gray-300'
                    }`}
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
