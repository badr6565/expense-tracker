'use client';

import { useMemo, useState } from 'react';
import { Store, TrendingUp, Users, Search } from 'lucide-react';
import { getExpenses } from '@/lib/storage';
import { Category } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';
import VendorRankCard from '@/components/VendorRankCard';
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

interface VendorStat {
  name: string;
  displayName: string;
  topCategory: Category;
  total: number;
  count: number;
  average: number;
}

export default function VendorsPage() {
  const [range, setRange] = useState<Range>('all');
  const [search, setSearch] = useState('');

  const allVendors = useMemo((): VendorStat[] => {
    const expenses = getExpenses();
    const cutoff = getCutoff(range);
    const filtered = cutoff
      ? expenses.filter((e) => isAfter(parseISO(e.date), cutoff))
      : expenses;

    // Group by normalized description
    const map = new Map<string, { displayName: string; total: number; count: number; categories: Category[] }>();

    for (const e of filtered) {
      const key = e.description.trim().toLowerCase();
      if (!key) continue;
      const existing = map.get(key);
      if (existing) {
        existing.total += e.amount;
        existing.count += 1;
        existing.categories.push(e.category);
      } else {
        map.set(key, {
          displayName: e.description.trim(),
          total: e.amount,
          count: 1,
          categories: [e.category],
        });
      }
    }

    // Convert to array and compute top category
    return Array.from(map.entries())
      .map(([key, v]) => {
        const freq: Partial<Record<Category, number>> = {};
        for (const cat of v.categories) freq[cat] = (freq[cat] ?? 0) + 1;
        const topCategory = (Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Other') as Category;
        return {
          name: key,
          displayName: v.displayName,
          topCategory,
          total: v.total,
          count: v.count,
          average: v.total / v.count,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [range]);

  const filteredVendors = useMemo(() => {
    if (!search.trim()) return allVendors;
    const q = search.toLowerCase();
    return allVendors.filter((v) => v.name.includes(q));
  }, [allVendors, search]);

  const grandTotal = allVendors.reduce((s, v) => s + v.total, 0);
  const maxTotal = filteredVendors[0]?.total ?? 0;
  const avgPerVendor = allVendors.length > 0 ? grandTotal / allVendors.length : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Store size={22} className="text-indigo-600" />
            Top Vendors
          </h1>
          <p className="text-sm text-gray-500 mt-1">Your most frequented merchants and services</p>
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
              <Users size={14} className="text-indigo-500" />
              Total Vendors
            </div>
            <p className="text-2xl font-bold text-gray-900">{allVendors.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
              <TrendingUp size={14} className="text-indigo-500" />
              Top Vendor
            </div>
            <p className="text-xl font-bold text-gray-900 truncate">
              {allVendors[0] ? allVendors[0].displayName : '—'}
            </p>
            {allVendors[0] && (
              <p className="text-sm text-gray-400">{formatCurrency(allVendors[0].total)}</p>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
              <Store size={14} className="text-indigo-500" />
              Avg per Vendor
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgPerVendor)}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendors..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* Vendor list */}
        {filteredVendors.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <Store size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {allVendors.length === 0 ? 'No expenses found for this period' : 'No vendors match your search'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {allVendors.length === 0 ? 'Try a different date range or add some expenses' : 'Try a different search term'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 px-1">
              Showing {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''}
              {search && ` matching "${search}"`}
            </p>
            {filteredVendors.map((v, i) => (
              <VendorRankCard
                key={v.name}
                rank={i + 1}
                name={v.displayName}
                topCategory={v.topCategory}
                total={v.total}
                count={v.count}
                average={v.average}
                maxTotal={maxTotal}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
