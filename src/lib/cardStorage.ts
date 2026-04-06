import { BankCard } from '@/types/bankCard';

const CARD_STORAGE_KEY = 'expense_tracker_cards';

export function getCards(): BankCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CARD_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCards(cards: BankCard[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(cards));
}

export function addCard(card: BankCard): BankCard[] {
  const cards = getCards();
  const updated = [card, ...cards];
  saveCards(updated);
  return updated;
}

export function updateCard(updated: BankCard): BankCard[] {
  const cards = getCards();
  const list = cards.map((c) => (c.id === updated.id ? updated : c));
  saveCards(list);
  return list;
}

export function deleteCard(id: string): BankCard[] {
  const cards = getCards();
  const list = cards.filter((c) => c.id !== id);
  saveCards(list);
  return list;
}
