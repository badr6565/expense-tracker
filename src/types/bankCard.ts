export type CardType = 'credit' | 'debit';

export type CardTheme = 'indigo' | 'slate' | 'emerald' | 'rose' | 'amber' | 'violet';

export interface BankCard {
  id: string;
  cardholderName: string;
  lastFour: string;
  bankName: string;
  cardType: CardType;
  theme: CardTheme;
  isDefault: boolean;
  createdAt: string;
}

export interface BankCardFormData {
  cardholderName: string;
  lastFour: string;
  bankName: string;
  cardType: CardType;
  theme: CardTheme;
}

export const CARD_THEMES: Record<CardTheme, { gradient: string; label: string }> = {
  indigo: { gradient: 'from-indigo-500 to-indigo-700', label: 'Indigo' },
  slate:  { gradient: 'from-slate-600 to-slate-800',   label: 'Slate'  },
  emerald:{ gradient: 'from-emerald-500 to-emerald-700',label: 'Emerald'},
  rose:   { gradient: 'from-rose-500 to-rose-700',     label: 'Rose'   },
  amber:  { gradient: 'from-amber-500 to-amber-700',   label: 'Amber'  },
  violet: { gradient: 'from-violet-500 to-violet-700', label: 'Violet' },
};
