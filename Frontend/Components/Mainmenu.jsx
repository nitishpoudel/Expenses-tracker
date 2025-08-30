import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, DollarSign, TrendingUp, Calendar, PieChart, Home, FileText, LogOut, HelpCircle, Menu, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../src/config/api.js';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: null,
    title: '',
    amount: '',
    category: '',
    date: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = ['Food', 'Transportation', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Other'];
  
  const pieColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff'];

  // Calculate totals and statistics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categoryData = categories.map(category => {
    const categoryExpenses = expenses.filter(exp => exp.category === category);
    const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return { category, amount: total, count: categoryExpenses.length };
  }).filter(item => item.amount > 0);

  // Monthly data for bar chart
  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.amount += expense.amount;
    } else {
      acc.push({ month, amount: expense.amount });
    }
    return acc;
  }, []);

  const handleSubmit = () => {
    if (!form.title || !form.amount || !form.category || !form.date) return;

    if (isEditing) {
      setExpenses(expenses.map(exp => 
        exp.id === form.id 
          ? { ...form, amount: parseFloat(form.amount) }
          : exp
      ));
      setIsEditing(false);
    } else {
      const newExpense = {
        id: Date.now(),
        title: form.title,
        amount: parseFloat(form.amount),
        category: form.category,
        date: form.date
      };
      setExpenses([...expenses, newExpense]);
    }

    setForm({ id: null, title: '', amount: '', category: '', date: '' });
    setShowForm(false);
  };

  const handleEdit = (expense) => {
    setForm({
      id: expense.id,
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const resetForm = () => {
    setForm({ id: null, title: '', amount: '', category: '', date: '' });
    setIsEditing(false);
    setShowForm(false);
  };

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'expenses', label: 'Expense Tracker', icon: FileText },
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'logout', label: 'Logout', icon: LogOut }
  ];

  const handleLogout = async () => {
    try {
      // Call logout API
      const response = await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Clear any local storage or session storage if needed
        localStorage.removeItem('user');
        sessionStorage.clear();
        
        document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        console.log("logout sucessfully");
        
        // Navigate to login page
        navigate('/login');
      } else {
        console.error('Logout failed');
        // Still navigate to login even if API call fails
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Navigate to login even if there's an error
      navigate('/login');
    }
  };

  const handleSidebarClick = (itemId) => {
    if (itemId === 'logout') {
      handleLogout();
      return;
    }
    setActiveTab(itemId);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Expense Tracker</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Take control of your finances with our comprehensive expense tracking dashboard.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 border border-gray-200 rounded-lg">
                <FileText className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Track Expenses</h3>
                <p className="text-gray-600">Record and categorize all your expenses in one place</p>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg">
                <PieChart className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Visual Analytics</h3>
                <p className="text-gray-600">Understand your spending patterns with charts and graphs</p>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg">
                <TrendingUp className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Smart Insights</h3>
                <p className="text-gray-600">Get detailed breakdowns and spending summaries</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('expenses')}
              className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors duration-200"
            >
              Get Started
            </button>
          </div>
        );
      
      case 'support':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Support & Help</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-semibold mb-2">How to Add Expenses</h3>
                <p className="text-gray-600">Click "Add New Expense" button, fill in the required details, and click "Add Expense" to save.</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-xl font-semibold mb-2">Editing Expenses</h3>
                <p className="text-gray-600">Click the edit icon next to any expense in the table to modify its details.</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-xl font-semibold mb-2">Understanding Charts</h3>
                <p className="text-gray-600">The bar chart shows monthly trends, while the pie chart displays category-wise distribution of expenses.</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-xl font-semibold mb-2">Categories</h3>
                <p className="text-gray-600">Choose from predefined categories: Food, Transportation, Entertainment, Bills, Shopping, Healthcare, and Other.</p>
              </div>
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                <strong>Need more help?</strong> Contact our support team at support@expensetracker.com
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSidebarClick(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'home' && renderContent()}
          {activeTab === 'support' && renderContent()}
          
          {activeTab === 'expenses' && (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
                <p className="text-gray-600">Track and manage your expenses with visual insights</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Expenses</p>
                      <p className="text-2xl font-bold text-gray-900">₹{totalExpenses.toFixed(2)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Transactions</p>
                      <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Categories</p>
                      <p className="text-2xl font-bold text-gray-900">{categoryData.length}</p>
                    </div>
                    <PieChart className="h-8 w-8 text-purple-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Avg per Transaction</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : '0.00'}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-orange-500" />
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Bar Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Monthly Expenses</h3>
                  {monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']} />
                        <Legend />
                        <Bar dataKey="amount" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-72 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <BarChart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <p>No data to display</p>
                        <p className="text-sm">Add expenses to see monthly trends</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Expenses by Category</h3>
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="amount"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-72 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <PieChart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <p>No data to display</p>
                        <p className="text-sm">Add expenses to see category breakdown</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Expense Button */}
              <div className="mb-6">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200"
                >
                  <PlusCircle className="h-5 w-5" />
                  Add New Expense
                </button>
              </div>

              {/* Add/Edit Form */}
              {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {isEditing ? 'Edit Expense' : 'Add New Expense'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Expense title"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2 lg:col-span-4 flex gap-3">
                      <button
                        onClick={handleSubmit}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                      >
                        {isEditing ? 'Update Expense' : 'Add Expense'}
                      </button>
                      <button
                        onClick={resetForm}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Expenses Table */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Expenses</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {expenses.map((expense) => (
                        <tr key={expense.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{expense.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">₹{expense.amount.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              expense.category === 'Food' ? 'bg-green-100 text-green-800' :
                              expense.category === 'Transportation' ? 'bg-blue-100 text-blue-800' :
                              expense.category === 'Entertainment' ? 'bg-purple-100 text-purple-800' :
                              expense.category === 'Bills' ? 'bg-red-100 text-red-800' :
                              expense.category === 'Shopping' ? 'bg-yellow-100 text-yellow-800' :
                              expense.category === 'Healthcare' ? 'bg-pink-100 text-pink-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {expense.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(expense.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(expense)}
                                className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(expense.id)}
                                className="text-red-600 hover:text-red-900 transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {expenses.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No expenses found</p>
                    <p className="text-gray-400">Add your first expense to get started!</p>
                  </div>
                )}
              </div>

              {/* Category Summary */}
              {categoryData.length > 0 && (
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Category Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryData.map((item, index) => (
                      <div key={item.category} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{item.category}</h4>
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: pieColors[index % pieColors.length] }}
                          ></div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">₹{item.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{item.count} transaction{item.count !== 1 ? 's' : ''}</p>
                        <div className="mt-2 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${(item.amount / totalExpenses) * 100}%`,
                              backgroundColor: pieColors[index % pieColors.length]
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;