
import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, TrendingUp, FileText, Settings } from 'lucide-react';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const [searchUser, setSearchUser] = useState('');

  const mockUsers = [
    { id: 1, name: 'Priya Sharma', email: 'priya@example.com', transactions: 45, gst: 12500, lastLogin: '2024-06-10' },
    { id: 2, name: 'Rahul Kumar', email: 'rahul@example.com', transactions: 32, gst: 8900, lastLogin: '2024-06-09' },
    { id: 3, name: 'Anjali Patel', email: 'anjali@example.com', transactions: 67, gst: 18700, lastLogin: '2024-06-08' }
  ];

  const mockSystemStats = {
    totalUsers: 156,
    totalTransactions: 2834,
    totalGSTProcessed: 456780,
    averageMonthlyTransactions: 18
  };

  const mockCategories = [
    'Software Development',
    'Consulting',
    'Office Supplies',
    'Travel & Transport',
    'Marketing & Advertising',
    'Professional Services',
    'Equipment & Software',
    'Utilities'
  ];

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.email.toLowerCase().includes(searchUser.toLowerCase())
  );

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
                Smart Ledger AI - Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Admin</Badge>
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-blue-100">Total Users</CardDescription>
                    <Users className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{mockSystemStats.totalUsers}</CardTitle>
                </CardHeader>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-emerald-100">Total Transactions</CardDescription>
                    <FileText className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{mockSystemStats.totalTransactions}</CardTitle>
                </CardHeader>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-purple-100">GST Processed</CardDescription>
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-2xl font-bold">₹{mockSystemStats.totalGSTProcessed.toLocaleString()}</CardTitle>
                </CardHeader>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-orange-100">Avg Monthly</CardDescription>
                    <Settings className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{mockSystemStats.averageMonthlyTransactions}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent User Activity</CardTitle>
                <CardDescription>Latest transactions and user logins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{user.transactions} transactions</p>
                        <p className="text-xs text-gray-600">Last login: {user.lastLogin}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Label htmlFor="search">Search Users</Label>
                    <Input
                      id="search"
                      placeholder="Search by name or email..."
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      className="max-w-sm border-emerald-200 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">Last login: {user.lastLogin}</p>
                        </div>
                        <div className="text-right mr-4">
                          <p className="text-sm font-medium">{user.transactions} transactions</p>
                          <p className="text-sm text-gray-600">₹{user.gst.toLocaleString()} GST</p>
                        </div>
                        <div className="space-y-2">
                          <Button size="sm" variant="outline">View Ledger</Button>
                          <Button size="sm" variant="outline">Edit User</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Category Management</CardTitle>
                <CardDescription>Manage expense and income categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Input placeholder="Add new category..." className="flex-1 border-emerald-200 focus:border-emerald-500" />
                    <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                      Add Category
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {mockCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <span className="font-medium">{category}</span>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Default GST Rate</Label>
                    <Input placeholder="18%" className="max-w-sm border-emerald-200 focus:border-emerald-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>System Timezone</Label>
                    <Input placeholder="Asia/Kolkata" className="max-w-sm border-emerald-200 focus:border-emerald-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Currency Format</Label>
                    <Input placeholder="INR" className="max-w-sm border-emerald-200 focus:border-emerald-500" />
                  </div>
                  
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
