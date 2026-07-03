import React, { useState, useMemo } from 'react';

// Initial dummy data for demonstration
const INITIAL_TRANSACTIONS = [
  { id: 1, text: 'Project Freelance', amount: 2500, type: 'income', category: 'Salary', date: '2026-07-01' },
  { id: 2, text: 'Groceries', amount: 120, type: 'expense', category: 'Food', date: '2026-07-02' },
  { id: 3, text: 'Electricity Bill', amount: 85, type: 'expense', category: 'Utilities', date: '2026-07-03' },
];

export default function BudgetManager() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');

  // Categories based on transaction type
  const categories = {
    income: ['Salary', 'Freelance', 'Investments', 'Other'],
    expense: ['Food', 'Rent/Mortgage', 'Utilities', 'Entertainment', 'Transport', 'Other']
  };

  // Handle type change to reset category dynamically
  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);
    setCategory(categories[selectedType][0]);
  };

  // Add new transaction
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim() || !amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid description and amount.');
      return;
    }

    const newTransaction = {
      id: Date.now(),
      text: text.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([newTransaction, ...transactions]);
    setText('');
    setAmount('');
  };

  // Delete transaction
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Financial Calculations
  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      if (t.type === 'expense') expense += t.amount;
    });

    return {
      income,
      expense,
      balance: income - expense
    };
  }, [transactions]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Finance Tracker</h1>
        <p style={styles.subtitle}>Manage your budget and track expenditures</p>
      </header>

      {/* Dashboard Grid */}
      <div style={styles.gridDashboard}>
        <div style={{ ...styles.card, ...styles.cardBalance }}>
          <h3>Total Balance</h3>
          <p style={styles.amountBig}>${totals.balance.toFixed(2)}</p>
        </div>
        <div style={{ ...styles.card, ...styles.cardIncome }}>
          <h3>Total Income</h3>
          <p style={styles.amount}>+${totals.income.toFixed(2)}</p>
        </div>
        <div style={{ ...styles.card, ...styles.cardExpense }}>
          <h3>Total Expenses</h3>
          <p style={styles.amount}>-${totals.expense.toFixed(2)}</p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={styles.mainLayout}>
        {/* Transaction Form Section */}
        <div style={styles.sectionCard}>
          <h2 style={styles.sectionTitle}>Add New Transaction</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., Grocery shopping"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Transaction Type</label>
              <select value={type} onChange={handleTypeChange} style={styles.select}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.select}>
                {categories[type].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button type="submit" style={styles.submitButton}>Add Transaction</button>
          </form>
        </div>

        {/* History Log Section */}
        <div style={styles.sectionCard}>
          <h2 style={styles.sectionTitle}>Transaction History</h2>
          <div style={styles.historyList}>
            {transactions.length === 0 ? (
              <p style={styles.emptyState}>No transactions added yet.</p>
            ) : (
              transactions.map((t) => (
                <div key={t.id} style={{
                  ...styles.historyItem,
                  borderLeft: t.type === 'income' ? '5px solid #10b981' : '5px solid #ef4444'
                }}>
                  <div>
                    <h4 style={styles.itemText}>{t.text}</h4>
                    <span style={styles.itemMeta}>{t.category} • {t.date}</span>
                  </div>
                  <div style={styles.itemRight}>
                    <span style={{
                      ...styles.itemAmount,
                      color: t.type === 'income' ? '#10b981' : '#ef4444'
                    }}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                    </span>
                    <button onClick={() => deleteTransaction(t.id)} style={styles.deleteButton} title="Delete">
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline responsive-ready CSS architecture
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2.5rem',
    margin: '0 0 5px 0',
    color: '#111827',
  },
  subtitle: {
    margin: 0,
    color: '#6b7280',
  },
  gridDashboard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  card: {
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  cardBalance: {
    borderTop: '4px solid #3b82f6',
  },
  cardIncome: {
    borderTop: '4px solid #10b981',
  },
  cardExpense: {
    borderTop: '4px solid #ef4444',
  },
  amountBig: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '10px 0 0 0',
  },
  amount: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    margin: '10px 0 0 0',
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginTop: 0,
    marginBottom: '20px',
    borderBottom: '2px solid #f3f4f6',
    paddingBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#4b5563',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
  },
  select: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    backgroundColor: '#fff',
  },
  submitButton: {
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.2s',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '450px',
    overflowY: 'auto',
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  itemText: {
    margin: '0 0 4px 0',
    fontSize: '1rem',
  },
  itemMeta: {
    fontSize: '0.75rem',
    color: '#9ca3af',
  },
  itemRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  itemAmount: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '4px',
  },
  emptyState: {
    textAlign: 'center',
    color: '#9ca3af',
    padding: '20px',
  }
};