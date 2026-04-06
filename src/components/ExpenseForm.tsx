'use client';

import { useState, useEffect, useRef } from 'react';
import { Expense, ExpenseFormData, CATEGORIES, Category } from '@/types/expense';
import { BankCard } from '@/types/bankCard';
import { format } from 'date-fns';

interface ExpenseFormProps {
  onSubmit: (data: { date: string; amount: number; category: Category; description: string; cardId?: string }) => void;
  onCancel: () => void;
  initial?: Expense;
  cards?: BankCard[];
}

const EMPTY: ExpenseFormData = {
  date: format(new Date(), 'yyyy-MM-dd'),
  amount: '',
  category: 'Food',
  description: '',
  cardId: '',
};

interface Errors {
  date?: string;
  amount?: string;
  description?: string;
}

export default function ExpenseForm({ onSubmit, onCancel, initial, cards = [] }: ExpenseFormProps) {
  const [form, setForm] = useState<ExpenseFormData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const cardsRef = useRef(cards);
  cardsRef.current = cards;

  useEffect(() => {
    if (initial) {
      setForm({
        date: initial.date,
        amount: initial.amount.toString(),
        category: initial.category,
        description: initial.description,
        cardId: initial.cardId ?? '',
      });
    } else {
      const defaultCard = cardsRef.current.find((c) => c.isDefault);
      setForm({ ...EMPTY, cardId: defaultCard?.id ?? '' });
    }
    setErrors({});
    setTouched({});
  }, [initial]);

  function validate(data: ExpenseFormData): Errors {
    const errs: Errors = {};
    if (!data.date) errs.date = 'Date is required';
    const amt = parseFloat(data.amount);
    if (!data.amount) errs.amount = 'Amount is required';
    else if (isNaN(amt) || amt <= 0) errs.amount = 'Amount must be a positive number';
    else if (amt > 1_000_000) errs.amount = 'Amount is too large';
    if (!data.description.trim()) errs.description = 'Description is required';
    else if (data.description.trim().length > 200) errs.description = 'Max 200 characters';
    return errs;
  }

  function handleChange(field: keyof ExpenseFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newForm = { ...form, [field]: value };
    const errs = validate(newForm);
    setErrors(errs);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allTouched = { date: true, amount: true, description: true };
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({
      date: form.date,
      amount: parseFloat(parseFloat(form.amount).toFixed(2)),
      category: form.category,
      description: form.description.trim(),
      cardId: form.cardId || undefined,
    });
  }

  const fieldClass = (field: keyof Errors) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
      touched[field] && errors[field]
        ? 'border-red-300 focus:ring-red-200 bg-red-50'
        : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 bg-white'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={form.date}
          max={format(new Date(), 'yyyy-MM-dd')}
          onChange={(e) => handleChange('date', e.target.value)}
          className={fieldClass('date')}
        />
        {touched.date && errors.date && (
          <p className="mt-1 text-xs text-red-500">{errors.date}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            className={`${fieldClass('amount')} pl-8`}
          />
        </div>
        {touched.amount && errors.amount && (
          <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={form.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-white transition-colors"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Card selector (only when cards exist) */}
      {cards.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pay with Card</label>
          <select
            value={form.cardId}
            onChange={(e) => handleChange('cardId', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-white transition-colors"
          >
            <option value="">No card</option>
            {cards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.bankName} •• {card.lastFour}{card.isDefault ? ' (default)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          placeholder="What did you spend on?"
          value={form.description}
          maxLength={200}
          onChange={(e) => handleChange('description', e.target.value)}
          className={fieldClass('description')}
        />
        <div className="flex justify-between mt-1">
          {touched.description && errors.description ? (
            <p className="text-xs text-red-500">{errors.description}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-gray-400">{form.description.length}/200</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
        >
          {initial ? 'Save Changes' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
