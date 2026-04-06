import { Expense, FilterOptions, Category } from '@/types/expense';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
}

export function filterExpenses(expenses: Expense[], filters: FilterOptions): Expense[] {
  return expenses.filter((expense) => {
    // Category filter
    if (filters.category !== 'All' && expense.category !== filters.category) return false;

    // Date range filter
    if (filters.dateFrom && expense.date < filters.dateFrom) return false;
    if (filters.dateTo && expense.date > filters.dateTo) return false;

    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !expense.description.toLowerCase().includes(q) &&
        !expense.category.toLowerCase().includes(q)
      ) {
        return false;
      }
    }

    return true;
  });
}

export function getTotalSpending(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function getMonthlySpending(expenses: Expense[]): number {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  return expenses
    .filter((e) => {
      try {
        return isWithinInterval(parseISO(e.date), { start, end });
      } catch {
        return false;
      }
    })
    .reduce((sum, e) => sum + e.amount, 0);
}

export function getSpendingByCategory(expenses: Expense[]): Record<Category, number> {
  const result = {} as Record<Category, number>;
  for (const e of expenses) {
    result[e.category] = (result[e.category] || 0) + e.amount;
  }
  return result;
}

export function getTopCategory(expenses: Expense[]): { category: Category; amount: number } | null {
  const byCategory = getSpendingByCategory(expenses);
  const entries = Object.entries(byCategory) as [Category, number][];
  if (!entries.length) return null;
  const [category, amount] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  return { category, amount };
}

export function getMonthlyTrend(expenses: Expense[]): { month: string; amount: number }[] {
  const map = new Map<string, number>();
  for (const e of expenses) {
    try {
      const key = format(parseISO(e.date), 'MMM yyyy');
      map.set(key, (map.get(key) || 0) + e.amount);
    } catch {
      // skip invalid dates
    }
  }
  return Array.from(map.entries())
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(-6);
}

export function exportToCSV(expenses: Expense[]): void {
  const headers = ['Date', 'Amount', 'Category', 'Description'];
  const rows = expenses.map((e) => [
    e.date,
    e.amount.toFixed(2),
    e.category,
    `"${e.description.replace(/"/g, '""')}"`,
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `expenses_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
