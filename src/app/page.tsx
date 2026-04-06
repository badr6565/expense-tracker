'use client';

import { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useBankCards } from '@/hooks/useBankCards';
import Navbar from '@/components/Navbar';
import SummaryCards from '@/components/SummaryCards';
import Charts from '@/components/Charts';
import FiltersBar from '@/components/FiltersBar';
import ExpenseList from '@/components/ExpenseList';
import ExpenseForm from '@/components/ExpenseForm';
import BankCardsSection from '@/components/BankCardsSection';
import BankCardForm from '@/components/BankCardForm';
import Modal from '@/components/ui/Modal';
import { Expense, Category } from '@/types/expense';
import { BankCard, BankCardFormData } from '@/types/bankCard';
import { exportToCSV, formatCurrency, getTotalSpending } from '@/lib/utils';
import { Download, CreditCard, LayoutDashboard } from 'lucide-react';

type Tab = 'expenses' | 'cards';

export default function Home() {
  const {
    expenses,
    filteredExpenses,
    filters,
    isLoaded,
    add,
    update,
    remove,
    updateFilters,
    resetFilters,
  } = useExpenses();

  const {
    cards,
    isLoaded: cardsLoaded,
    add: addCard,
    update: updateCard,
    remove: removeCard,
    setDefault: setDefaultCard,
  } = useBankCards();

  const [activeTab, setActiveTab] = useState<Tab>('expenses');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState<BankCard | null>(null);

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  /* ── Expense handlers ── */
  function handleAdd(data: { date: string; amount: number; category: Category; description: string; cardId?: string }) {
    add(data);
    setShowAddModal(false);
    showToast('Expense added successfully');
  }

  function handleEdit(data: { date: string; amount: number; category: Category; description: string; cardId?: string }) {
    if (!editingExpense) return;
    update({ ...editingExpense, ...data });
    setEditingExpense(null);
    showToast('Expense updated successfully');
  }

  function handleDelete(id: string) {
    remove(id);
    showToast('Expense deleted');
  }

  function handleExport() {
    if (filteredExpenses.length === 0) {
      showToast('No expenses to export', 'error');
      return;
    }
    exportToCSV(filteredExpenses);
    showToast(`Exported ${filteredExpenses.length} expense(s) to CSV`);
  }

  /* ── Card handlers ── */
  function handleAddCard(data: BankCardFormData) {
    addCard(data);
    setShowAddCardModal(false);
    showToast('Card added successfully');
  }

  function handleEditCard(data: BankCardFormData) {
    if (!editingCard) return;
    updateCard({ ...editingCard, ...data });
    setEditingCard(null);
    showToast('Card updated successfully');
  }

  function handleDeleteCard(id: string) {
    removeCard(id);
    showToast('Card removed');
  }

  const filteredTotal = getTotalSpending(filteredExpenses);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAddClick={() => setShowAddModal(true)} onExport={handleExport} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Tab bar */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1 w-fit">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'expenses'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard size={15} />
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'cards'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CreditCard size={15} />
            Cards
            {cardsLoaded && cards.length > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === 'cards'
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-100 text-indigo-600'
                }`}
              >
                {cards.length}
              </span>
            )}
          </button>
        </div>

        {/* ── Expenses Tab ── */}
        {activeTab === 'expenses' && (
          <>
            {/* Summary cards */}
            {isLoaded ? (
              <SummaryCards expenses={expenses} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-24 animate-pulse" />
                ))}
              </div>
            )}

            {/* Charts */}
            {isLoaded && expenses.length > 0 && <Charts expenses={expenses} />}

            {/* Filters */}
            <FiltersBar
              filters={filters}
              onChange={updateFilters}
              onReset={resetFilters}
              count={filteredExpenses.length}
              total={expenses.length}
            />

            {/* Filtered total */}
            {filteredExpenses.length > 0 && (
              <div className="flex items-center justify-between px-1">
                <span className="text-sm text-gray-500">
                  Filtered total:{' '}
                  <span className="font-bold text-gray-900">{formatCurrency(filteredTotal)}</span>
                </span>
                <button
                  onClick={handleExport}
                  className="sm:hidden flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <Download size={14} />
                  Export CSV
                </button>
              </div>
            )}

            {/* Expense list */}
            {isLoaded ? (
              <ExpenseList
                expenses={filteredExpenses}
                onEdit={(expense) => setEditingExpense(expense)}
                onDelete={handleDelete}
                cards={cards}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Cards Tab ── */}
        {activeTab === 'cards' && (
          <>
            {cardsLoaded ? (
              <BankCardsSection
                cards={cards}
                onAdd={() => setShowAddCardModal(true)}
                onEdit={(card) => setEditingCard(card)}
                onDelete={handleDeleteCard}
                onSetDefault={setDefaultCard}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-52 animate-pulse" />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Add expense modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Expense">
        <ExpenseForm
          onSubmit={handleAdd}
          onCancel={() => setShowAddModal(false)}
          cards={cards}
        />
      </Modal>

      {/* Edit expense modal */}
      <Modal isOpen={!!editingExpense} onClose={() => setEditingExpense(null)} title="Edit Expense">
        <ExpenseForm
          onSubmit={handleEdit}
          onCancel={() => setEditingExpense(null)}
          initial={editingExpense ?? undefined}
          cards={cards}
        />
      </Modal>

      {/* Add card modal */}
      <Modal isOpen={showAddCardModal} onClose={() => setShowAddCardModal(false)} title="Add Bank Card">
        <BankCardForm
          onSubmit={handleAddCard}
          onCancel={() => setShowAddCardModal(false)}
        />
      </Modal>

      {/* Edit card modal */}
      <Modal isOpen={!!editingCard} onClose={() => setEditingCard(null)} title="Edit Card">
        <BankCardForm
          onSubmit={handleEditCard}
          onCancel={() => setEditingCard(null)}
          initial={editingCard ?? undefined}
        />
      </Modal>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium text-white transition-all ${
            toast.type === 'success' ? 'bg-gray-900' : 'bg-red-500'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
