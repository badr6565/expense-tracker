'use client';

import { useState, useEffect, useCallback } from 'react';
import { BankCard, BankCardFormData } from '@/types/bankCard';
import { getCards, addCard, updateCard, deleteCard, saveCards } from '@/lib/cardStorage';
import { generateId } from '@/lib/storage';

export function useBankCards() {
  const [cards, setCards] = useState<BankCard[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCards(getCards());
    setIsLoaded(true);
  }, []);

  const add = useCallback((data: BankCardFormData) => {
    const existing = getCards();
    const card: BankCard = {
      id: generateId(),
      ...data,
      isDefault: existing.length === 0,
      createdAt: new Date().toISOString(),
    };
    const updated = addCard(card);
    setCards(updated);
    return card;
  }, []);

  const update = useCallback((card: BankCard) => {
    const updated = updateCard(card);
    setCards(updated);
  }, []);

  const remove = useCallback((id: string) => {
    const current = getCards();
    const wasDefault = current.find((c) => c.id === id)?.isDefault ?? false;
    let updated = deleteCard(id);
    if (wasDefault && updated.length > 0) {
      updated = updated.map((c, i) => ({ ...c, isDefault: i === 0 }));
      saveCards(updated);
    }
    setCards(updated);
  }, []);

  const setDefault = useCallback((id: string) => {
    const current = getCards();
    const updated = current.map((c) => ({ ...c, isDefault: c.id === id }));
    saveCards(updated);
    setCards(updated);
  }, []);

  return { cards, isLoaded, add, update, remove, setDefault };
}
