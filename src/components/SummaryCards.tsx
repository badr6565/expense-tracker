'use client';

import { Expense } from '@/types/expense';
import {
  formatCurrency,
  getTotalSpending,
  getMonthlySpending,
  getTopCategory,
} from '@/lib/utils';
import { TrendingUp, Calendar, Tag, Receipt } from 'lucide-react';

interface SummaryCardsProps {
  expenses: Expense[];
}

export default function SummaryCards({ expenses }: SummaryCardsProps) {
  const total = getTotalSpending(expenses);
  const monthly = getMonthlySpending(expenses);
  const top = getTopCategory(expenses);
  const count = expenses.length;

  const cards = [
    {
      label: 'Total Spending',
      value: formatCurrency(total),
      sub: `${count} expense${count !== 1 ? 's' : ''}`,
      icon: Receipt,
      color: 'bg-indigo-50 text-indigo-600',
      border: 'border-indigo-100',
    },
    {
      label: 'This Month',
      value: formatCurrency(monthly),
      sub: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      icon: Calendar,
      color: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
    },
    {
      label: 'Top Category',
      value: top ? top.category : '—',
      sub: top ? formatCurrency(top.amount) : 'No data yet',
      icon: Tag,
      color: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
    },
    {
      label: 'Avg per Expense',
      value: count > 0 ? formatCurrency(total / count) : '—',
      sub: 'All time average',
      icon: TrendingUp,
      color: 'bg-rose-50 text-rose-600',
      border: 'border-rose-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`bg-white rounded-2xl border ${card.border} p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className={`p-3 rounded-xl ${card.color} shrink-0`}>
              <Icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5 truncate">{card.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
