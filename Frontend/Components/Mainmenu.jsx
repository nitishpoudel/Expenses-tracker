import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, DollarSign, TrendingUp, Calendar, PieChart, Home, FileText, LogOut, HelpCircle, Menu, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../src/config/api.js';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    id: null,
    title: '',
    amount: '',
    category: '',
    date: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    // Get the saved tab from localStorage, default to 'home' if none exists
    return localStorage.getItem('activeTab') || 'home';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ['Food', 'Transportation', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Other'];
  
  const pieColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff'];

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  // Fetch expenses from database when component mounts or when expenses tab is selected
  useEffect(() => {
    if (activeTab === 'expenses') {
      fetchExpenses();
    }
  }, [activeTab]);

  // Check if user is authenticated and fetch expenses on initial load
  useEffect(() => {
    const checkAuthAndFetchExpenses = async () => {
      // Check if JWT cookie exists
      const hasJWT = document.cookie.includes('jwt=');
      if (hasJWT && activeTab === 'expenses') {
        await fetchExpenses();
      }
    };
    
    checkAuthAndFetchExpenses();
  }, []);

  // Fetch expenses from database
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.GET_EXPENSES, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses(data.expenses || []);
        console.log('Expenses fetched successfully:', data.expenses);
      } else {
        console.error('Failed to fetch expenses');
        setExpenses([]);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async () => {
    if (!form.title || !form.amount || !form.category || !form.date) return;

    try {
      setLoading(true);
      
      if (isEditing) {
        // Update existing expense
        const response = await fetch(API_ENDPOINTS.UPDATE_EXPENSE, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: form.id,
            title: form.title,
            amount: form.amount,
            category: form.category,
            date: form.date
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setExpenses(expenses.map(exp => 
            exp._id === form.id 
              ? data.expense
              : exp
          ));
          console.log('Expense updated successfully:', data.expense);
        } else {
          console.error('Failed to update expense');
        }
        setIsEditing(false);
      } else {
        // Add new expense
        const response = await fetch(API_ENDPOINTS.ADD_EXPENSE, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: form.title,
            amount: form.amount,
            category: form.category,
            date: form.date
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setExpenses([data.expense, ...expenses]);
          console.log('Expense added successfully:', data.expense);
        } else {
          console.error('Failed to add expense');
        }
      }

      setForm({ id: null, title: '', amount: '', category: '', date: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setForm({
      id: expense._id,
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date.split('T')[0] // Convert ISO date to YYYY-MM-DD format
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.DELETE_EXPENSE}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setExpenses(expenses.filter(exp => exp._id !== id));
        console.log('Expense deleted successfully');
      } else {
        console.error('Failed to delete expense');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      setLoading(false);
    }
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
      console.log("User pressed logout - starting logout process");
      
      // Call logout API
      const response = await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log("Logout API call successful");
        // Clear any local storage or session storage if needed
        localStorage.removeItem('user');
        sessionStorage.clear();
        
        // Clear cookies by setting them to expire
        document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        console.log("Local data cleared, navigating to login page");
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Chat with AI</h2>
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
                <strong>Need more help?</strong> Contact our support team at nitishpaudel260@gmail.com
              </p>
                 <a href="/help" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors duration-200 mt-7">
              click here to chat with AI!!!
            </a>
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
                        <Bar dataKey="amount" fill="#FF0000" radius={[4, 4, 0, 0]} />
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

              {/* Add Expense Button and Refresh */}
              <div className="mb-6 flex gap-4">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200"
                >
                  <PlusCircle className="h-5 w-5" />
                  Add New Expense
                </button>
                <button
                  onClick={fetchExpenses}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200"
                >
                  <TrendingUp className="h-5 w-5" />
                  {loading ? 'Loading...' : 'Refresh'}
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
                        max={today}

                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2 lg:col-span-4 flex gap-3">
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                      >
                        {loading ? 'Saving...' : (isEditing ? 'Update Expense' : 'Add Expense')}
                      </button>
                      <button
                        onClick={resetForm}
                        disabled={loading}
                        className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors duration-200"
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
                        <tr key={expense._id} className="hover:bg-gray-50">
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
                                disabled={loading}
                                className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 transition-colors duration-200"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(expense._id)}
                                disabled={loading}
                                className="text-red-600 hover:text-red-900 disabled:text-gray-400 transition-colors duration-200"
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
                
                {loading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500 text-lg">Loading expenses...</p>
                  </div>
                )}
                
                {!loading && expenses.length === 0 && (
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