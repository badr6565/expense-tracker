'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Download, Plus, Wallet, Tag, Store, Lightbulb } from 'lucide-react';

interface NavbarProps {
  onAddClick: () => void;
  onExport: () => void;
}

export default function Navbar({ onAddClick, onExport }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + nav links */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl">
                <Wallet size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-none">ExpenseTracker</h1>
                <p className="text-xs text-gray-400 leading-none mt-0.5">Personal Finance Manager</p>
              </div>
            </div>
            {/* Nav links */}
            <Link
              href="/categories"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/categories'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Tag size={14} />
              Categories
            </Link>
            <Link
              href="/vendors"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/vendors'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Store size={14} />
              Vendors
            </Link>
            <Link
              href="/insights"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/insights'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Lightbulb size={14} />
              Insights
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onExport}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Download size={15} />
              Export CSV
            </button>
            <button
              onClick={onAddClick}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Expense</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
