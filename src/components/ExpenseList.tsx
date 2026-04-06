'use client';

import { Expense } from '@/types/expense';
import { BankCard } from '@/types/bankCard';
import ExpenseRow from './ExpenseRow';
import { Inbox } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  cards?: BankCard[];
}

export default function ExpenseList({ expenses, onEdit, onDelete, cards = [] }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-gray-100 rounded-2xl mb-4">
          <Inbox size={32} className="text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">No expenses found</p>
        <p className="text-gray-400 text-sm mt-1">
          Add your first expense or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/60">
        <div className="hidden sm:block w-28 shrink-0">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</span>
        </div>
        <div className="flex-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Description</span>
        </div>
        <div className="hidden md:block shrink-0 w-28">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Category</span>
        </div>
        <div className="shrink-0 w-20 text-right">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</span>
        </div>
        <div className="shrink-0 w-16" />
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {expenses.map((expense) => (
          <ExpenseRow
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
            cards={cards}
          />
        ))}
      </div>
    </div>
  );
}
