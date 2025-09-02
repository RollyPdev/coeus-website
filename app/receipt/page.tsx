"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface PaymentReceipt {
  id: string;
  transactionId: string;
  receiptNumber: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  status: string;
  discount?: number;
  tax?: number;
  notes?: string;
  enrollment: {
    reviewType: string;
    batch?: string;
  };
}

function ReceiptContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paymentId) {
      fetchReceipt();
    }
  }, [paymentId]);

  const fetchReceipt = async () => {
    try {
      // Try multiple search approaches
      let response = await fetch(`/api/admin/payments?search=${paymentId}&limit=1`);
      let data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch receipt');
      }
      
      let payment = data.payments?.[0];
      
      // If not found by search, try to get all payments and find by ID
      if (!payment) {
        response = await fetch('/api/admin/payments?limit=100');
        data = await response.json();
        
        if (response.ok && data.payments) {
          payment = data.payments.find(p => 
            p.id === paymentId || 
            p.transactionId === paymentId || 
            p.receiptNumber === paymentId
          );
        }
      }
      
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      setReceipt(payment);
    } catch (error) {
      console.error('Error fetching receipt:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch receipt');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const receiptHTML = document.getElementById('receipt-content')?.innerHTML;
    if (receiptHTML) {
      const blob = new Blob([`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Receipt - ${receipt?.receiptNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .receipt { max-width: 600px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .details { margin: 20px 0; }
            .amount { font-size: 24px; font-weight: bold; color: #2563eb; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="receipt">
            ${receiptHTML}
          </div>
        </body>
        </html>
      `], { type: 'text/html' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${receipt?.receiptNumber}.html`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="h-12 w-12 mx-auto mb-4 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-red-600 font-medium mb-2">Receipt not found</p>
          <p className="text-gray-500 text-sm">{error || 'The requested receipt could not be found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6 flex justify-center space-x-4 print:hidden">
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🖨️ Print Receipt
          </button>
          <button
            onClick={handleDownload}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            📄 Download
          </button>
        </div>

        <div id="receipt-content" className="bg-white rounded-lg shadow-lg p-8 print:shadow-none print:rounded-none">
          <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">COEUS REVIEW CENTER</h1>
            <p className="text-gray-600">Official Payment Receipt</p>
            <div className="mt-4">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                Receipt #{receipt.receiptNumber}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono font-medium">{receipt.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Date:</span>
                  <span>{new Date(receipt.paymentDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="capitalize">{receipt.paymentMethod.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    receipt.status === 'completed' ? 'bg-green-100 text-green-800' :
                    receipt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {receipt.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Student Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{receipt.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Student ID:</span>
                  <span className="font-mono">{receipt.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span>{receipt.studentEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Program:</span>
                  <span>{receipt.enrollment.reviewType}</span>
                </div>
                {receipt.enrollment.batch && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Batch:</span>
                    <span>{receipt.enrollment.batch}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span>Base Amount:</span>
                <span>₱{(receipt.amount + (receipt.discount || 0) - (receipt.tax || 0)).toLocaleString()}</span>
              </div>
              
              {receipt.discount && receipt.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-₱{receipt.discount.toLocaleString()}</span>
                </div>
              )}
              
              {receipt.tax && receipt.tax > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Tax:</span>
                  <span>+₱{receipt.tax.toLocaleString()}</span>
                </div>
              )}
              
              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between text-2xl font-bold text-blue-600">
                  <span>Total Paid:</span>
                  <span>₱{receipt.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {receipt.notes && (
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-600 text-sm">{receipt.notes}</p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
            <p>This is an official receipt issued by Coeus Review Center.</p>
            <p className="mt-2">For inquiries, please contact us at info@coeusreview.com</p>
            <p className="mt-4 text-xs">Generated on {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ReceiptContent />
    </Suspense>
  );
}