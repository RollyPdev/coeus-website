"use client";

import { useState } from 'react';
import Link from 'next/link';

interface ReceiptData {
  id: string;
  transactionId: string;
  receiptNumber: string;
  studentName: string;
  studentId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  status: string;
  enrollment: {
    reviewType: string;
    batch?: string;
  };
}

export default function VerifyReceiptPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setReceipt(null);
    setSearched(true);

    try {
      const response = await fetch(`/api/admin/payments?search=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search receipt');
      }

      const payment = data.payments?.[0];
      if (payment) {
        setReceipt(payment);
      } else {
        setError('Receipt not found. Please check your receipt number or transaction ID.');
      }
    } catch (error) {
      console.error('Error searching receipt:', error);
      setError(error instanceof Error ? error.message : 'Failed to search receipt');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center">
                <img src="/logo.png" alt="Coeus Logo" className="h-10 w-auto" />
                <span className="ml-3 text-xl font-bold text-blue-900">Coeus Review</span>
              </Link>
            </div>
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Receipt Verification</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Verify and check the status of your payment receipts. Enter your receipt number or transaction ID below.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Receipt Number or Transaction ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter receipt number (e.g., RCP-2024-001) or transaction ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Verify Receipt
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {error ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Receipt Not Found</h3>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : receipt ? (
              <div>
                {/* Receipt Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white">Receipt Verified ✓</h3>
                      <p className="text-green-100">Payment confirmed and validated</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full border-2 ${getStatusColor(receipt.status)}`}>
                      <span className="font-semibold capitalize">{receipt.status}</span>
                    </div>
                  </div>
                </div>

                {/* Receipt Details */}
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Receipt Information</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Receipt Number:</span>
                            <span className="font-mono font-semibold">{receipt.receiptNumber}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Transaction ID:</span>
                            <span className="font-mono text-sm">{receipt.transactionId}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Payment Date:</span>
                            <span className="font-semibold">{new Date(receipt.paymentDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Payment Method:</span>
                            <span className="font-semibold capitalize">{receipt.paymentMethod.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Student Name:</span>
                            <span className="font-semibold">{receipt.studentName}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Student ID:</span>
                            <span className="font-mono font-semibold">{receipt.studentId}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Program:</span>
                            <span className="font-semibold">{receipt.enrollment.reviewType}</span>
                          </div>
                          {receipt.enrollment.batch && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Batch:</span>
                              <span className="font-semibold">{receipt.enrollment.batch}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h4>
                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">Total Amount Paid</p>
                            <p className="text-4xl font-bold text-green-600">₱{receipt.amount.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <Link
                          href={`/receipt?paymentId=${receipt.transactionId}`}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-center"
                        >
                          View Full Receipt
                        </Link>
                        <button
                          onClick={() => window.print()}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                        >
                          Print Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Where to find your receipt number?</h4>
              <p className="text-blue-700 text-sm">Your receipt number is provided when you complete your payment. It usually starts with "RCP-" followed by the year and a unique number.</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Transaction ID location</h4>
              <p className="text-blue-700 text-sm">Your transaction ID is a unique identifier sent to your email after payment completion. It's also displayed on your payment confirmation page.</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-blue-200">
            <p className="text-blue-800 text-sm">
              <strong>Still can't find your receipt?</strong> Contact our support team at{' '}
              <a href="mailto:info@coeusreview.com" className="underline hover:no-underline">
                info@coeusreview.com
              </a>{' '}
              or call us for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}