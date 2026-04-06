'use client';

import { CATEGORY_BG, CATEGORY_COLORS, Category } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';

interface CategoryRankCardProps {
  rank: number;
  category: Category;
  total: number;
  count: number;
  percentage: number;
  maxTotal: number;
}

export default function CategoryRankCard({
  rank,
  category,
  total,
  count,
  percentage,
  maxTotal,
}: CategoryRankCardProps) {
  const color = CATEGORY_COLORS[category];
  const barWidth = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-gray-600">{rank}</span>
        </div>

        {/* Category info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_BG[category]}`}>
              {category}
            </span>
            <span className="text-xs text-gray-400 shrink-0">{percentage.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-base font-bold text-gray-900">{formatCurrency(total)}</span>
            <span className="text-xs text-gray-400">{count} transaction{count !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${barWidth}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
