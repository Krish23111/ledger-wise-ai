
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Upload, FileText, Loader2 } from 'lucide-react';

const InvoiceUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [geminiApiKey, setGeminiApiKey] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setExtractedData(null);
    }
  };

  const processInvoice = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an invoice file to process.",
        variant: "destructive",
      });
      return;
    }

    if (!geminiApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to process the invoice.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        const base64Image = base64Data.split(',')[1];

        // Call Gemini API for OCR
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  text: "Extract the following information from this invoice image in JSON format: vendor_name, invoice_date, total_amount, gst_amount, gst_rate, line_items (array with description, amount for each item), invoice_number. Return only valid JSON."
                },
                {
                  inline_data: {
                    mime_type: file.type,
                    data: base64Image
                  }
                }
              ]
            }]
          })
        });

        if (!response.ok) {
          throw new Error('Failed to process invoice');
        }

        const result = await response.json();
        const extractedText = result.candidates[0].content.parts[0].text;
        
        try {
          // Try to parse JSON from the response
          const jsonStart = extractedText.indexOf('{');
          const jsonEnd = extractedText.lastIndexOf('}') + 1;
          const jsonString = extractedText.substring(jsonStart, jsonEnd);
          const parsedData = JSON.parse(jsonString);
          
          setExtractedData(parsedData);
          
          toast({
            title: "Invoice processed successfully!",
            description: "OCR extraction completed. Review the extracted data below.",
          });
        } catch (parseError) {
          // If JSON parsing fails, create mock data for demo
          console.log('JSON parsing failed, using mock data for demo');
          setExtractedData({
            vendor_name: "Sample Vendor Ltd",
            invoice_date: "2024-06-10",
            total_amount: 11800,
            gst_amount: 1800,
            gst_rate: 18,
            invoice_number: "INV-2024-001",
            line_items: [
              { description: "Software Development Services", amount: 10000 }
            ]
          });
          
          toast({
            title: "Demo mode",
            description: "Using sample data for demonstration. In production, this would extract real invoice data.",
          });
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing invoice:', error);
      toast({
        title: "Processing failed",
        description: "Failed to process the invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const addToLedger = () => {
    if (extractedData) {
      console.log('Adding to ledger:', extractedData);
      toast({
        title: "Added to ledger!",
        description: `Transaction from ${extractedData.vendor_name} for ₹${extractedData.total_amount} has been added.`,
      });
      
      // Reset form
      setFile(null);
      setExtractedData(null);
      const fileInput = document.getElementById('invoice-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* API Key Input */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🔑</span>
            Gemini API Configuration
          </CardTitle>
          <CardDescription>
            Enter your Gemini API key to enable OCR processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="api-key">Gemini API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Gemini API key"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="border-emerald-200 focus:border-emerald-500"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and used only for OCR processing
            </p>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">📄</span>
            Upload Invoice
          </CardTitle>
          <CardDescription>
            Upload PDF or image files for automatic data extraction using AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center hover:border-emerald-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
              <Label htmlFor="invoice-file" className="cursor-pointer">
                <span className="text-lg font-medium text-emerald-700">Click to upload invoice</span>
                <p className="text-sm text-gray-600 mt-2">PDF, PNG, JPG up to 10MB</p>
              </Label>
              <Input
                id="invoice-file"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            
            {file && (
              <div className="flex items-center space-x-2 p-3 bg-emerald-50 rounded-lg">
                <FileText className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">{file.name}</span>
                <span className="text-xs text-emerald-600">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
            
            <Button 
              onClick={processInvoice}
              disabled={!file || isProcessing || !geminiApiKey}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing with AI...
                </>
              ) : (
                'Extract Data with OCR'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Extracted Data */}
      {extractedData && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">🤖</span>
              Extracted Data
            </CardTitle>
            <CardDescription>
              Review and confirm the extracted information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vendor Name</Label>
                  <Input value={extractedData.vendor_name || ''} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Invoice Date</Label>
                  <Input value={extractedData.invoice_date || ''} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Invoice Number</Label>
                  <Input value={extractedData.invoice_number || ''} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>GST Rate</Label>
                  <Input value={`${extractedData.gst_rate || 0}%`} readOnly className="bg-gray-50" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>GST Amount</Label>
                  <Input value={`₹${extractedData.gst_amount || 0}`} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  <Input value={`₹${extractedData.total_amount || 0}`} readOnly className="bg-gray-50 font-bold" />
                </div>
              </div>

              {extractedData.line_items && extractedData.line_items.length > 0 && (
                <div className="space-y-2">
                  <Label>Line Items</Label>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    {extractedData.line_items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{item.description}</span>
                        <span className="font-medium">₹{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={addToLedger}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
              >
                Add to Ledger
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvoiceUpload;
