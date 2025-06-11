
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    amount: '',
    gstRate: '18',
    category: '',
    type: '',
    description: ''
  });

  const categories = [
    'Software Development',
    'Consulting',
    'Office Supplies',
    'Travel & Transport',
    'Marketing & Advertising',
    'Professional Services',
    'Equipment & Software',
    'Utilities',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const gstAmount = (parseFloat(formData.amount) * parseFloat(formData.gstRate)) / 100;
    const totalAmount = parseFloat(formData.amount) + gstAmount;
    
    console.log('Transaction submitted:', {
      ...formData,
      gstAmount,
      totalAmount
    });

    toast({
      title: "Transaction Added!",
      description: `Successfully added ${formData.type} of ₹${totalAmount.toLocaleString()} (including ₹${gstAmount.toFixed(2)} GST)`,
    });

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      vendor: '',
      amount: '',
      gstRate: '18',
      category: '',
      type: '',
      description: ''
    });
  };

  const gstAmount = formData.amount ? (parseFloat(formData.amount) * parseFloat(formData.gstRate)) / 100 : 0;
  const totalAmount = formData.amount ? parseFloat(formData.amount) + gstAmount : 0;

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="mr-2">➕</span>
          Add New Transaction
        </CardTitle>
        <CardDescription>
          Manually enter transaction details with automatic GST calculation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor/Client Name</Label>
            <Input
              id="vendor"
              type="text"
              placeholder="Enter vendor or client name"
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              required
              className="border-emerald-200 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (excluding GST)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gstRate">GST Rate (%)</Label>
              <Select value={formData.gstRate} onValueChange={(value) => setFormData({ ...formData, gstRate: value })}>
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0% (Exempt)</SelectItem>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="12">12%</SelectItem>
                  <SelectItem value="18">18%</SelectItem>
                  <SelectItem value="28">28%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add notes about this transaction"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border-emerald-200 focus:border-emerald-500"
            />
          </div>

          {/* GST Summary */}
          {formData.amount && (
            <div className="bg-emerald-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-emerald-800">Transaction Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-emerald-600">Base Amount:</span>
                  <span className="float-right font-medium">₹{parseFloat(formData.amount).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-emerald-600">GST ({formData.gstRate}%):</span>
                  <span className="float-right font-medium">₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="col-span-2 border-t border-emerald-200 pt-2">
                  <span className="text-emerald-800 font-semibold">Total Amount:</span>
                  <span className="float-right font-bold text-lg">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
            disabled={!formData.vendor || !formData.amount || !formData.type || !formData.category}
          >
            Add Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
