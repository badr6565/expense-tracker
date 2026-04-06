'use client';

import { CATEGORY_BG, Category } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';

interface VendorRankCardProps {
  rank: number;
  name: string;
  topCategory: Category;
  total: number;
  count: number;
  average: number;
  maxTotal: number;
}

const MEDAL_COLORS = ['#f59e0b', '#9ca3af', '#b45309'];

export default function VendorRankCard({
  rank,
  name,
  topCategory,
  total,
  count,
  average,
  maxTotal,
}: VendorRankCardProps) {
  const barWidth = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
  const medalColor = rank <= 3 ? MEDAL_COLORS[rank - 1] : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start gap-4">
        {/* Rank badge */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
          style={
            medalColor
              ? { backgroundColor: `${medalColor}20`, color: medalColor }
              : { backgroundColor: '#f3f4f6', color: '#4b5563' }
          }
        >
          {rank}
        </div>

        {/* Vendor info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-gray-900 truncate">{name}</span>
            <span className="text-base font-bold text-gray-900 shrink-0">{formatCurrency(total)}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_BG[topCategory]}`}>
              {topCategory}
            </span>
            <div className="flex items-center gap-3 text-xs text-gray-400 shrink-0">
              <span>{count} visit{count !== 1 ? 's' : ''}</span>
              <span>avg {formatCurrency(average)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${barWidth}%`,
                backgroundColor: medalColor ?? '#6366f1',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
