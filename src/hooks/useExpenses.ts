'use client';

import { useState, useEffect, useCallback } from 'react';
import { Expense, FilterOptions, Category } from '@/types/expense';
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  generateId,
} from '@/lib/storage';
import { filterExpenses } from '@/lib/utils';

const DEFAULT_FILTERS: FilterOptions = {
  dateFrom: '',
  dateTo: '',
  category: 'All',
  search: '',
};

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setExpenses(getExpenses());
    setIsLoaded(true);
  }, []);

  const filteredExpenses = filterExpenses(expenses, filters);

  const add = useCallback(
    (data: { date: string; amount: number; category: Category; description: string; cardId?: string }) => {
      const expense: Expense = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      const updated = addExpense(expense);
      setExpenses(updated);
      return expense;
    },
    []
  );

  const update = useCallback((expense: Expense) => {
    const updated = updateExpense(expense);
    setExpenses(updated);
  }, []);

  const remove = useCallback((id: string) => {
    const updated = deleteExpense(id);
    setExpenses(updated);
  }, []);

  const updateFilters = useCallback((partial: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return {
    expenses,
    filteredExpenses,
    filters,
    isLoaded,
    add,
    update,
    remove,
    updateFilters,
    resetFilters,
  };
}
