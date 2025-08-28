import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, CreditCard, PiggyBank, Calendar, Filter, Plus, Download, Bell, X, Trash2, Edit } from 'lucide-react';

// Indian Rupee Icon Component
const RupeeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.66 7H16v2h-2.34c-.46 1.39-1.86 2.38-3.66 2.38-1.71 0-3.22-1.17-3.66-2.38H4V7h2.34C6.78 5.61 8.29 4.62 10 4.62S13.22 5.61 13.66 7zM10 13c2.21 0 4-1.79 4-4h2c0 3.31-2.69 6-6 6s-6-2.69-6-6h2c0 2.21 1.79 4 4 4z"/>
    <path d="M6 16h4l6 4v-4h2v2H6v-2z"/>
    <path d="M6 7H4V5h12v2H8.34c.46 1.39 1.86 2.38 3.66 2.38h2v2h-2c-3.31 0-6-2.69-6-6z"/>
    <path d="M7 13h10l-3 7H7z"/>
  </svg>
);

// Simplified Indian Rupee Symbol
const RupeeSymbol = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 7V5h8v2h-2v1h2v2h-2.5c-.8 1.3-2.2 2.2-4 2.2H7v2l5 5h2.5l-5-5c2.8 0 5.2-1.9 5.8-4.5H16V6h-1V4H6v2h1z"/>
  </svg>
);

// Add Expense Modal Component
const AddExpenseModal = ({ isOpen, onClose, onAddExpense }) => {
  const [formData, setFormData] = useState({
    description: '',
    category: 'Food & Dining',
    amount: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Other'
  ];

  const handleSubmit = () => {
    if (formData.description && formData.amount) {
      onAddExpense({
        ...formData,
        amount: formData.type === 'expense' ? -Math.abs(parseFloat(formData.amount)) : Math.abs(parseFloat(formData.amount)),
        id: Date.now()
      });
      setFormData({
        description: '',
        category: 'Food & Dining',
        amount: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Add Transaction</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Enter amount"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExpenseTracker = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState('December 2024');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Start with empty transactions - 0 values initially
  const [transactions, setTransactions] = useState([]);

  // Calculate monthly data dynamically from transactions
  const calculateMonthlyData = () => {
    const monthlyTotals = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyTotals[monthYear]) {
        monthlyTotals[monthYear] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyTotals[monthYear].income += transaction.amount;
      } else {
        monthlyTotals[monthYear].expenses += Math.abs(transaction.amount);
      }
    });

    // Return last 6 months with data or zeros
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      income: monthlyTotals[month]?.income || 0,
      expenses: monthlyTotals[month]?.expenses || 0
    }));
  };

  // Calculate category data dynamically from transactions
  const calculateCategoryData = () => {
    if (transactions.length === 0) return [];
    
    const categoryTotals = {};
    const colors = {
      'Food & Dining': '#FF6B6B',
      'Transportation': '#4ECDC4',
      'Shopping': '#45B7D1',
      'Entertainment': '#96CEB4',
      'Bills & Utilities': '#FFEAA7',
      'Healthcare': '#DDA0DD',
      'Education': '#FFB347',
      'Travel': '#98D8C8',
      'Other': '#F7DC6F'
    };

    transactions.forEach(transaction => {
      if (transaction.amount < 0) { // Only expenses
        const category = transaction.category;
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += Math.abs(transaction.amount);
      }
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#95A5A6'
    }));
  };

  // Calculate stats dynamically - show 0 when no transactions
  const calculateStats = () => {
    if (transactions.length === 0) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        savings: 0
      };
    }

    const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
    const balance = totalIncome - totalExpenses;
    const savings = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, balance, savings };
  };

  const stats = calculateStats();
  const categoryData = calculateCategoryData();
  const monthlyData = calculateMonthlyData();

  // Add new expense/income
  const handleAddExpense = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
  };

  // Delete transaction
  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const StatCard = ({ title, amount, change, icon: Icon, trend, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <div className="flex items-center mt-2">
            <RupeeSymbol className="w-5 h-5 text-gray-700 mr-1" />
            <p className="text-2xl font-bold text-gray-900">{amount.toLocaleString('en-IN')}</p>
          </div>
          <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            <span>{change}</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-300 ${isModalOpen ? 'bg-white bg-opacity-50' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`bg-white shadow-sm border-b border-gray-200 transition-all duration-300 ${isModalOpen ? 'opacity-50' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-3 sm:py-0 h-auto sm:h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">ExpenseTracker Pro</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>December 2024</option>
                <option>November 2024</option>
                <option>October 2024</option>
              </select>
              
              {/* Beautiful Add Transaction Button */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-xl blur-sm opacity-30 animate-pulse hidden sm:block"></div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="relative bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 border border-white/20 backdrop-blur-sm group w-full sm:w-auto justify-center text-xs sm:text-sm"
                >
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-12">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-lg" />
                  </div>
                  <span className="font-bold tracking-wide">Add Transaction</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                </button>
              </div>
              
              <Bell className="w-6 h-6 text-gray-600 hover:text-gray-900 cursor-pointer" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className={`bg-white border-b border-gray-200 transition-all duration-300 ${isModalOpen ? 'opacity-50' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex space-x-8 min-w-max">
            {['overview', 'transactions', 'analytics', 'budgets'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${isModalOpen ? 'opacity-50' : 'opacity-100'}`}>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Balance"
            amount={stats.balance}
            change={transactions.length > 0 ? "+12.5%" : "0%"}
            icon={Wallet}
            trend={stats.balance >= 0 ? "up" : "down"}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            title="Monthly Income"
            amount={stats.totalIncome}
            change={transactions.length > 0 ? "+8.2%" : "0%"}
            icon={TrendingUp}
            trend="up"
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            title="Monthly Expenses"
            amount={stats.totalExpenses}
            change={transactions.length > 0 ? "+15.3%" : "0%"}
            icon={CreditCard}
            trend="up"
            color="bg-gradient-to-r from-red-500 to-red-600"
          />
          <StatCard
            title="Savings"
            amount={stats.savings}
            change={transactions.length > 0 ? (stats.savings > 0 ? "+5.2%" : "-5.2%") : "0%"}
            icon={PiggyBank}
            trend={stats.savings >= 0 ? 'up' : 'down'}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Income vs Expenses</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Income</span>
                <div className="w-3 h-3 bg-red-500 rounded-full ml-4"></div>
                <span className="text-sm text-gray-600">Expenses</span>
              </div>
            </div>
            {monthlyData.some(m => m.income > 0 || m.expenses > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No data to display yet</p>
                  <p className="text-sm">Add transactions to see your financial overview</p>
                </div>
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Expense Categories</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
            </div>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <PiggyBank className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No expense data available</p>
                  <p className="text-sm">Add some expenses to see category breakdown</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <div className="flex items-center space-x-3">
                <button className="text-gray-500 hover:text-gray-700">
                  <Filter className="w-5 h-5" />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {transactions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="flex items-center">
                          <RupeeSymbol className="w-4 h-4 text-gray-700 mr-1" />
                          <p className={`font-semibold ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-gray-400">
              <Wallet className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No transactions yet</p>
              <p className="text-sm">Add your first transaction to get started tracking your finances</p>
            </div>
          )}
          
          {transactions.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All Transactions
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddExpense={handleAddExpense}
      />
    </div>
  );
};

export default ExpenseTracker;