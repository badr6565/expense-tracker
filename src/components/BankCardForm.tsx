'use client';

import { useState, useEffect } from 'react';
import { BankCard, BankCardFormData, CardTheme, CARD_THEMES } from '@/types/bankCard';
import BankCardVisual from './BankCardVisual';

interface BankCardFormProps {
  onSubmit: (data: BankCardFormData) => void;
  onCancel: () => void;
  initial?: BankCard;
}

const EMPTY: BankCardFormData = {
  cardholderName: '',
  lastFour: '',
  bankName: '',
  cardType: 'debit',
  theme: 'indigo',
};

interface Errors {
  cardholderName?: string;
  lastFour?: string;
  bankName?: string;
}

export default function BankCardForm({ onSubmit, onCancel, initial }: BankCardFormProps) {
  const [form, setForm] = useState<BankCardFormData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initial) {
      setForm({
        cardholderName: initial.cardholderName,
        lastFour: initial.lastFour,
        bankName: initial.bankName,
        cardType: initial.cardType,
        theme: initial.theme,
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
    setTouched({});
  }, [initial]);

  function validate(data: BankCardFormData): Errors {
    const errs: Errors = {};
    if (!data.cardholderName.trim()) errs.cardholderName = 'Cardholder name is required';
    else if (data.cardholderName.trim().length > 50) errs.cardholderName = 'Max 50 characters';
    if (!data.lastFour.trim()) errs.lastFour = 'Last 4 digits are required';
    else if (!/^\d{4}$/.test(data.lastFour.trim())) errs.lastFour = 'Must be exactly 4 digits';
    if (!data.bankName.trim()) errs.bankName = 'Bank name is required';
    else if (data.bankName.trim().length > 50) errs.bankName = 'Max 50 characters';
    return errs;
  }

  function handleChange(field: keyof BankCardFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate({ ...form, [field]: value });
    setErrors(errs);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ cardholderName: true, lastFour: true, bankName: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({
      ...form,
      cardholderName: form.cardholderName.trim(),
      lastFour: form.lastFour.trim(),
      bankName: form.bankName.trim(),
    });
  }

  const fieldClass = (field: keyof Errors) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
      touched[field] && errors[field]
        ? 'border-red-300 focus:ring-red-200 bg-red-50'
        : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 bg-white'
    }`;

  /* Preview card with current form values */
  const previewCard: BankCard = {
    id: 'preview',
    cardholderName: form.cardholderName.trim() || 'CARDHOLDER NAME',
    lastFour: /^\d{4}$/.test(form.lastFour) ? form.lastFour : '0000',
    bankName: form.bankName.trim() || 'Bank Name',
    cardType: form.cardType,
    theme: form.theme,
    isDefault: false,
    createdAt: '',
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Live preview */}
      <div className="w-full max-w-xs mx-auto">
        <BankCardVisual card={previewCard} />
      </div>

      {/* Bank Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
        <input
          type="text"
          placeholder="e.g. Chase, Wells Fargo"
          value={form.bankName}
          maxLength={50}
          onChange={(e) => handleChange('bankName', e.target.value)}
          className={fieldClass('bankName')}
        />
        {touched.bankName && errors.bankName && (
          <p className="mt-1 text-xs text-red-500">{errors.bankName}</p>
        )}
      </div>

      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
        <input
          type="text"
          placeholder="e.g. JOHN DOE"
          value={form.cardholderName}
          maxLength={50}
          onChange={(e) => handleChange('cardholderName', e.target.value.toUpperCase())}
          className={fieldClass('cardholderName')}
        />
        {touched.cardholderName && errors.cardholderName && (
          <p className="mt-1 text-xs text-red-500">{errors.cardholderName}</p>
        )}
      </div>

      {/* Last Four Digits */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Last 4 Digits</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="e.g. 4321"
          value={form.lastFour}
          maxLength={4}
          onChange={(e) => handleChange('lastFour', e.target.value.replace(/\D/g, ''))}
          className={fieldClass('lastFour')}
        />
        {touched.lastFour && errors.lastFour && (
          <p className="mt-1 text-xs text-red-500">{errors.lastFour}</p>
        )}
      </div>

      {/* Card Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
        <div className="flex gap-3">
          {(['debit', 'credit'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleChange('cardType', type)}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium capitalize transition-colors ${
                form.cardType === type
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Color Theme */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Color</label>
        <div className="flex gap-2 flex-wrap">
          {(Object.entries(CARD_THEMES) as [CardTheme, { gradient: string; label: string }][]).map(
            ([key, { gradient, label }]) => (
              <button
                key={key}
                type="button"
                title={label}
                onClick={() => handleChange('theme', key)}
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} transition-transform hover:scale-110 ${
                  form.theme === key
                    ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                    : ''
                }`}
              />
            )
          )}
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
          {initial ? 'Save Changes' : 'Add Card'}
        </button>
      </div>
    </form>
  );
}
