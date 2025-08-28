import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User, Lock, Mail, IndianRupee, Calendar, Tag, Plus, Trash2, LogOut } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Mainmenu = () => {
  // State declarations
  const [expenses, setExpenses] = useState([]);
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    description: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0]
  });

  // Categories for expenses
  const categories = ['food', 'transport', 'entertainment', 'utilities', 'shopping', 'healthcare', 'other'];

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  // Get chart data
  const getChartData = () => {
    const categoryTotals = {};
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + parseFloat(expense.amount);
    });
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      amount
    }));
  };

  // Handle expense submission
  const handleExpenseSubmit = async () => {
    try {
      if (!expenseForm.amount || !expenseForm.description) {
        toast.error('Please fill in all fields');
        return;
      }

      setExpenses([...expenses, {
        id: Date.now(),
        ...expenseForm,
        amount: parseFloat(expenseForm.amount)
      }]);

      setExpenseForm({
        amount: '',
        description: '',
        category: 'food',
        date: new Date().toISOString().split('T')[0]
      });

      toast.success('Expense added successfully');
    } catch (error) {
      console.error('Failed to add expense:', error);
      toast.error('Failed to add expense');
    }
  };

  // Handle expense deletion
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast.success('Expense deleted successfully');
  };

    return(

        <>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 justify-items-center">
          {/* Add Expense Form */}
          <div className="lg:col-span-1 w-full">
            <div className="bg-white rounded-lg shadow p-6 w-full">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Plus className="h-5 w-5 mr-2 text-indigo-600" />
                Add Expense
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="₹0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <button
                  onClick={handleExpenseSubmit}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
                >
                  Add Expense
                </button>
              </div>

              {/* Total Expenses */}
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-indigo-600 font-medium">Total Expenses</p>
                  <p className="text-2xl font-bold text-indigo-800">₹{totalExpenses.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses List and Chart */}
          <div className="lg:col-span-2 space-y-8 w-full">
            {/* Bar Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h2>
              {getChartData().length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']} />
                    <Legend />
                    <Bar dataKey="amount" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No expenses to display yet.</p>
                  <p className="text-sm">Add your first expense to see the chart!</p>
                </div>
              )}
            </div>

            {/* Expenses List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h2>
              {expenses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No expenses recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses.map(expense => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{expense.description}</h3>
                          <span className="text-lg font-semibold text-gray-900">₹{expense.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center mt-1 space-x-4 text-sm text-gray-600">
                          <span className="inline-flex items-center">
                            <Tag className="h-4 w-4 mr-1" />
                            {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                          </span>
                          <span className="inline-flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {expense.date}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

        
        
        
        </>
    )
}
export default Mainmenu;