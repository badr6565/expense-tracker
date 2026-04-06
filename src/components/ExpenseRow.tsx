'use client';

import { useState } from 'react';
import { Expense } from '@/types/expense';
import { BankCard } from '@/types/bankCard';
import { formatCurrency, formatDate } from '@/lib/utils';
import CategoryBadge from './ui/CategoryBadge';
import { CreditCard, Pencil, Trash2 } from 'lucide-react';

interface ExpenseRowProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  cards?: BankCard[];
}

export default function ExpenseRow({ expense, onEdit, onDelete, cards = [] }: ExpenseRowProps) {
  const linkedCard = expense.cardId ? cards.find((c) => c.id === expense.cardId) : undefined;
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="group flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors rounded-xl">
      {/* Date */}
      <div className="hidden sm:block w-28 shrink-0">
        <p className="text-sm font-medium text-gray-700">{formatDate(expense.date)}</p>
      </div>

      {/* Description + category */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{expense.description}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="sm:hidden text-xs text-gray-400">{formatDate(expense.date)}</span>
          {linkedCard && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <CreditCard size={11} />
              {linkedCard.bankName} ••{linkedCard.lastFour}
            </span>
          )}
        </div>
      </div>

      {/* Category badge */}
      <div className="hidden md:block shrink-0">
        <CategoryBadge category={expense.category} size="sm" />
      </div>

      {/* Amount */}
      <div className="shrink-0 text-right">
        <p className="text-sm font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {confirmDelete ? (
          <>
            <button
              onClick={() => onDelete(expense.id)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onEdit(expense)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
