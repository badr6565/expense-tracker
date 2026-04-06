'use client';

import { useState } from 'react';
import { BankCard } from '@/types/bankCard';
import BankCardVisual from './BankCardVisual';
import { CreditCard, Plus, Pencil, Trash2, Star } from 'lucide-react';

interface BankCardsSectionProps {
  cards: BankCard[];
  onAdd: () => void;
  onEdit: (card: BankCard) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export default function BankCardsSection({
  cards,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
}: BankCardsSectionProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Bank Cards</h2>
          <p className="text-sm text-gray-400">
            {cards.length === 0
              ? 'No cards added yet'
              : `${cards.length} card${cards.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Card</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Empty state */}
      {cards.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-gray-100 rounded-2xl mb-4">
            <CreditCard size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">No bank cards yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Add your first card to track which card you use for each expense.
          </p>
          <button
            onClick={onAdd}
            className="mt-5 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Plus size={15} />
            Add Card
          </button>
        </div>
      )}

      {/* Cards grid */}
      {cards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow"
            >
              <BankCardVisual card={card} />

              {/* Card info row */}
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{card.bankName}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    {card.cardType} •• {card.lastFour}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {!card.isDefault && (
                    <button
                      onClick={() => onSetDefault(card.id)}
                      title="Set as default"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                    >
                      <Star size={14} />
                    </button>
                  )}
                  {card.isDefault && (
                    <span
                      title="Default card"
                      className="p-1.5 rounded-lg text-amber-500"
                    >
                      <Star size={14} fill="currentColor" />
                    </span>
                  )}
                  <button
                    onClick={() => onEdit(card)}
                    title="Edit"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  {confirmDeleteId === card.id ? (
                    <>
                      <button
                        onClick={() => {
                          onDelete(card.id);
                          setConfirmDeleteId(null);
                        }}
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(card.id)}
                      title="Delete"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
