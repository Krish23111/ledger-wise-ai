
import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TransactionForm from './TransactionForm';
import InvoiceUpload from './InvoiceUpload';
import Chatbot from './Chatbot';
import AdminPanel from './AdminPanel';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const mockStats = {
    totalIncome: 125000,
    totalExpenses: 78000,
    inputGST: 14040,
    outputGST: 22500,
    netGST: 8460
  };

  const mockTransactions = [
    { id: 1, date: '2024-06-10', vendor: 'Tech Solutions Ltd', amount: 25000, gst: 4500, type: 'income', category: 'Software Development' },
    { id: 2, date: '2024-06-09', vendor: 'Office Supplies Co', amount: 3200, gst: 576, type: 'expense', category: 'Office Supplies' },
    { id: 3, date: '2024-06-08', vendor: 'Client ABC', amount: 50000, gst: 9000, type: 'income', category: 'Consulting' }
  ];

  if (user?.role === 'admin') {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">₹</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Smart Ledger AI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-200 px-4 py-2 sm:hidden">
        <div className="flex space-x-2 overflow-x-auto">
          {['overview', 'add', 'upload', 'chat'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' : ''}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { id: 'overview', label: 'Dashboard', icon: '📊' },
                  { id: 'add', label: 'Add Transaction', icon: '➕' },
                  { id: 'upload', label: 'Upload Invoice', icon: '📄' },
                  { id: 'chat', label: 'Ask AI Assistant', icon: '💬' }
                ].map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      activeTab === item.id ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' : ''
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-emerald-100">Total Income</CardDescription>
                      <CardTitle className="text-2xl font-bold">₹{mockStats.totalIncome.toLocaleString()}</CardTitle>
                    </CardHeader>
                  </Card>
                  
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-rose-100">Total Expenses</CardDescription>
                      <CardTitle className="text-2xl font-bold">₹{mockStats.totalExpenses.toLocaleString()}</CardTitle>
                    </CardHeader>
                  </Card>
                  
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-blue-100">Net GST Payable</CardDescription>
                      <CardTitle className="text-2xl font-bold">₹{mockStats.netGST.toLocaleString()}</CardTitle>
                    </CardHeader>
                  </Card>
                </div>

                {/* GST Summary */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="mr-2">🧾</span>
                      GST Summary - June 2024
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600">Input GST</p>
                        <p className="text-xl font-bold text-green-700">₹{mockStats.inputGST.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">Output GST</p>
                        <p className="text-xl font-bold text-blue-700">₹{mockStats.outputGST.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-600">Net Payable</p>
                        <p className="text-xl font-bold text-purple-700">₹{mockStats.netGST.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="mr-2">💼</span>
                      Recent Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                                {transaction.type}
                              </Badge>
                              <span className="font-medium">{transaction.vendor}</span>
                            </div>
                            <p className="text-sm text-gray-600">{transaction.category} • {transaction.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹{transaction.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">GST: ₹{transaction.gst}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'add' && <TransactionForm />}
            {activeTab === 'upload' && <InvoiceUpload />}
            {activeTab === 'chat' && <Chatbot />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
