'use client';

import { FilterOptions, CATEGORIES } from '@/types/expense';
import { Search, X, RotateCcw } from 'lucide-react';

interface FiltersBarProps {
  filters: FilterOptions;
  onChange: (partial: Partial<FilterOptions>) => void;
  onReset: () => void;
  count: number;
  total: number;
}

export default function FiltersBar({ filters, onChange, onReset, count, total }: FiltersBarProps) {
  const hasFilters =
    filters.search || filters.category !== 'All' || filters.dateFrom || filters.dateTo;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search expenses..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value as FilterOptions['category'] })}
          className="px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white transition-colors"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Date From */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">From</span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ dateFrom: e.target.value })}
            className="px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white transition-colors"
          />
        </div>

        {/* Date To */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">To</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ dateTo: e.target.value })}
            className="px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white transition-colors"
          />
        </div>

        {/* Reset */}
        {hasFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-400">
        Showing <span className="font-semibold text-gray-600">{count}</span> of{' '}
        <span className="font-semibold text-gray-600">{total}</span> expense{total !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
