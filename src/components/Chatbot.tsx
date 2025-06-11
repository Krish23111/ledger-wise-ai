
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI bookkeeping assistant. I can help you with queries about your ledger, GST calculations, and financial insights. Try asking me questions like 'How much GST did I pay in June?' or 'What are my top expense categories?'",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');

  const quickQuestions = [
    "How much GST did I pay this month?",
    "What are my top 3 expense categories?",
    "Show me my total income vs expenses",
    "Calculate my net GST liability",
    "What's my biggest expense this quarter?"
  ];

  const mockLedgerData = {
    totalIncome: 125000,
    totalExpenses: 78000,
    gstPaid: 14040,
    gstCollected: 22500,
    topCategories: [
      { name: "Software Development", amount: 75000 },
      { name: "Consulting", amount: 50000 },
      { name: "Office Supplies", amount: 15000 }
    ]
  };

  const generateResponse = async (question: string): Promise<string> => {
    // If no API key, use mock responses
    if (!geminiApiKey) {
      const lowerQuestion = question.toLowerCase();
      
      if (lowerQuestion.includes('gst') && (lowerQuestion.includes('month') || lowerQuestion.includes('pay'))) {
        return `Based on your ledger, you paid ₹${mockLedgerData.gstPaid.toLocaleString()} in Input GST and collected ₹${mockLedgerData.gstCollected.toLocaleString()} in Output GST this month. Your net GST payable is ₹${(mockLedgerData.gstCollected - mockLedgerData.gstPaid).toLocaleString()}.`;
      }
      
      if (lowerQuestion.includes('top') && lowerQuestion.includes('categor')) {
        return `Your top 3 expense categories are:\n1. ${mockLedgerData.topCategories[0].name}: ₹${mockLedgerData.topCategories[0].amount.toLocaleString()}\n2. ${mockLedgerData.topCategories[1].name}: ₹${mockLedgerData.topCategories[1].amount.toLocaleString()}\n3. ${mockLedgerData.topCategories[2].name}: ₹${mockLedgerData.topCategories[2].amount.toLocaleString()}`;
      }
      
      if (lowerQuestion.includes('income') && lowerQuestion.includes('expense')) {
        return `Your financial summary:\n• Total Income: ₹${mockLedgerData.totalIncome.toLocaleString()}\n• Total Expenses: ₹${mockLedgerData.totalExpenses.toLocaleString()}\n• Net Profit: ₹${(mockLedgerData.totalIncome - mockLedgerData.totalExpenses).toLocaleString()}`;
      }
      
      return "I understand you're asking about your financial data. For real-time accurate responses, please add your Gemini API key above. For now, I can provide general guidance about bookkeeping and GST compliance.";
    }

    // Use Gemini API for real responses
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a bookkeeping assistant for Indian small businesses. Answer this question about the user's finances: "${question}". Use this ledger data: Total Income: ₹${mockLedgerData.totalIncome}, Total Expenses: ₹${mockLedgerData.totalExpenses}, GST Paid: ₹${mockLedgerData.gstPaid}, GST Collected: ₹${mockLedgerData.gstCollected}. Be helpful, accurate, and format numbers in Indian currency format.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Gemini');
      }

      const result = await response.json();
      return result.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return "I'm sorry, I couldn't process your request at the moment. Please check your API key and try again.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await generateResponse(inputMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="space-y-6">
      {/* API Key Configuration */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🔑</span>
            AI Assistant Configuration
          </CardTitle>
          <CardDescription>
            Enter your Gemini API key for intelligent responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="chatbot-api-key">Gemini API Key (Optional)</Label>
            <Input
              id="chatbot-api-key"
              type="password"
              placeholder="Enter your Gemini API key for enhanced responses"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="border-emerald-200 focus:border-emerald-500"
            />
            <p className="text-xs text-muted-foreground">
              Without API key, you'll get demo responses based on sample data
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">💬</span>
            AI Bookkeeping Assistant
          </CardTitle>
          <CardDescription>
            Ask questions about your finances, GST, and get instant insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Quick Questions */}
            <div className="space-y-2">
              <Label>Quick Questions</Label>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="h-96 border border-emerald-200 rounded-lg p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-2 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                          : 'bg-white border border-emerald-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-emerald-200 rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="flex space-x-2">
              <Input
                placeholder="Ask me anything about your finances..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border-emerald-200 focus:border-emerald-500"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;
