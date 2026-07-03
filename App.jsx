import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Wallet, ArrowDownRight, ArrowUpRight, Filter } from 'lucide-react';

export default function App() {
  // --- State Management ---
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('budget_transactions');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Freelance Web Design', amount: 1200, type: 'income', category: 'Business', date: '2026-07-01' },
      { id: 2, text: 'Monthly Rent', amount: 450, type: 'expense', category: 'Housing', date: '2026-07-02' },
      { id: 3, text: 'Groceries', amount: 85, type: 'expense', category: 'Food', date: '2026-07-03' }
    ];
  });

  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['Food', 'Housing', 'Utilities', 'Entertainment', 'Business', 'Other'];

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('budget_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // --- Calculations ---
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expenses;

  // --- Event Handlers ---
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!text.trim() || !amount || parseFloat(amount) <= 0) return;

    const newTransaction = {
      id: Date.now(),
      text: text.trim(),
      amount: parseFloat(amount),
      type,
      category: type === 'income' ? 'Business' : category,
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([newTransaction, ...transactions]);
    setText('');
    setAmount('');
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const filteredTransactions = filterCategory === 'All'
    ? transactions
    : transactions.filter(t => t.category === filterCategory);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              FinTrack
            </span>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            Live Budget Dashboard
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Metric Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Net Balance */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500">Net Balance</span>
              <Wallet className="h-5 w-5 text-indigo-500" />
            </div>
            <h2 className={`text-3xl font-bold ${balance >= 0 ? 'text-gray-900' : 'text-rose-600'}`}>
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>

          {/* Income Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500">Total Income</span>
              <div className="p-1 bg-emerald-50 rounded-full">
                <ArrowUpRight className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-emerald-600">
              +${income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>

          {/* Expenses Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500">Total Expenditures</span>
              <div className="p-1 bg-rose-50 rounded-full">
                <ArrowDownRight className="h-5 w-5 text-rose-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-rose-600">
              -${expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
        </section>

        {/* Layout Split: Form & History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Transaction Form */}
          <section className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-indigo-600" /> Add Transaction
              </h3>
              
              <form onSubmit={handleAddTransaction} className="space-y-4">
                {/* Transaction Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Type</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setType('expense')}
                      className={`py-2 text-sm font-medium rounded-lg transition-all ${type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('income')}
                      className={`py-2 text-sm font-medium rounded-lg transition-all ${type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Income
                    </button>
                  </div>
                </div>

                {/* Description input */}
                <div>
                  <label htmlFor="description" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Description</label>
                  <input
                    id="description"
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g., Grocery stock, Invoice payment"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white placeholder-gray-400 text-sm transition-all"
                    required
                  />
                </div>

                {/* Amount Input */}
                <div>
                  <label htmlFor="amount" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Amount ($)</label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white placeholder-gray-400 text-sm transition-all"
                    required
                  />
                </div>

                {/* Category Selection (Conditional) */}
                {type === 'expense' && (
                  <div>
                    <label htmlFor="category" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Category</label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm transition-all"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-colors shadow-sm text-sm mt-2 flex justify-center items-center gap-1"
                >
                  Save Entry
                </button>
              </form>
            </div>
          </section>

          {/* Right Column: Ledger / History */}
          <section className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
                
                {/* Categorical Filter */}
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Filter className="h-4 w-4 text-gray-400 shrink-0" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full sm:w-auto px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-medium bg-gray-50 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Transactions Stack */}
              <div className="space-y-3">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                    <p className="text-sm text-gray-400">No recent transactions listed under this tier.</p>
                  </div>
                ) : (
                  filteredTransactions.map(t => (
                    <div
                      key={t.id}
                      className={`flex justify-between items-center p-4 rounded-xl border transition-all hover:bg-gray-50 group ${
                        t.type === 'income' ? 'border-l-4 border-l-emerald-500 border-gray-200' : 'border-l-4 border-l-rose-500 border-gray-200'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <p className="font-semibold text-gray-900 text-sm">{t.text}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <span className="font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{t.category}</span>
                          <span>•</span>
                          <span>{t.date}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleDeleteTransaction(t.id)}
                          className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100"
                          aria-label="Delete transaction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}