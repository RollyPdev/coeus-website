"use client";

import { useState, useEffect } from 'react';
import PaymentForm from '@/components/admin/PaymentForm';
import PaymentAnalytics from '@/components/admin/PaymentAnalytics';
import PaymentFilters from '@/components/admin/PaymentFilters';

interface Payment {
  id: string;
  transactionId: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  studentContact: string;
  amount: number;
  paymentMethod: string;
  paymentGateway?: string;
  paymentDate: string;
  dueDate?: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  receiptNumber?: string;
  refundAmount?: number;
  lateFee?: number;
  discount?: number;
  tax?: number;
  notes?: string;
  enrollmentId: string;
  enrollment: {
    id: string;
    reviewType: string;
    batch?: string;
    startDate?: string;
    student: {
      firstName: string;
      lastName: string;
      studentId: string;
      email: string;
      contactNumber: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('payments');

  useEffect(() => {
    const isSearch = filters.search && filters.search.length > 0;
    fetchPayments(isSearch);
    if (!isSearch) {
      fetchStudents();
      fetchEnrollments();
    }
  }, [filters, currentPage]);

  const fetchPayments = async (isSearch = false) => {
    try {
      if (isSearch) {
        setSearching(true);
      } else {
        setLoading(true);
      }
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...filters
      });
      
      const response = await fetch(`/api/admin/payments?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch payments');
      }
      
      setPayments(data.payments || []);
      setPagination(data.pagination);
      setAnalytics(data.analytics);
      setError(null);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch payments');
      setPayments([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/admin/students');
      const data = await response.json();
      if (response.ok) {
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await fetch('/api/admin/enrollments');
      const data = await response.json();
      if (response.ok) {
        setEnrollments(data.enrollments || []);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };



  const handleCreatePayment = async (paymentData: any) => {
    try {
      console.log('Sending payment data:', paymentData);
      const response = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      
      const data = await response.json();
      console.log('API response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }
      
      setShowPaymentForm(false);
      fetchPayments();
      alert('Payment created successfully!');
    } catch (error) {
      console.error('Error creating payment:', error);
      alert(error instanceof Error ? error.message : 'Failed to create payment');
    }
  };

  const handleRefund = async (paymentId: string, refundAmount: number, refundReason: string) => {
    try {
      const response = await fetch('/api/admin/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, refundAmount, refundReason })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process refund');
      }
      
      setShowRefundModal(false);
      setSelectedPayment(null);
      fetchPayments();
      alert('Refund processed successfully!');
    } catch (error) {
      console.error('Error processing refund:', error);
      alert(error instanceof Error ? error.message : 'Failed to process refund');
    }
  };

  const handleExport = async (format: string) => {
    try {
      const params = new URLSearchParams({ format, ...filters });
      const response = await fetch(`/api/admin/payments/export?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data');
    }
  };

  if (loading && payments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-300 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Payment Management
              </h1>
              <p className="text-gray-600 mt-1">Track and manage student payments</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPaymentForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                + New Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Payments
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'analytics' ? (
          <PaymentAnalytics analytics={analytics} />
        ) : (
          <>
            {/* Filters */}
            <PaymentFilters
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setCurrentPage(1);
              }}
              onExport={handleExport}
            />
            
            {searching && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-blue-700 text-sm">Searching payments...</span>
                </div>
              </div>
            )}

            {/* Payments Table */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Payment Transactions</h2>
                    <p className="text-slate-600 mt-1">
                      {pagination ? `${pagination.total} total payments` : 'Loading...'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-100 to-blue-100">
                    <tr>
                      <th className="px-8 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Transaction Info
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Student Details
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Payment Info
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50">
                    {error && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <svg className="h-12 w-12 mx-auto mb-4 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <p className="text-red-600 font-medium mb-2">Error loading payments</p>
                            <p className="text-gray-500 text-sm mb-4">{error}</p>
                            <button 
                              onClick={() => fetchPayments()}
                              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Try Again
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                    {!error && payments.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <svg className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-lg font-medium mb-2">No payments found</p>
                            <p className="text-sm text-gray-400">Create your first payment to get started</p>
                          </div>
                        </td>
                      </tr>
                    )}
                    {!error && payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-mono font-semibold text-slate-900">
                              {payment.transactionId}
                            </span>
                            <span className="text-xs text-slate-500 mt-1">
                              {new Date(payment.paymentDate).toLocaleDateString()}
                            </span>
                            {payment.receiptNumber && (
                              <span className="text-xs text-blue-600 mt-1">
                                Receipt: {payment.receiptNumber}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                {payment.studentName.split(' ').map(n => n[0]).join('')}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900">{payment.studentName}</div>
                              <div className="text-sm text-slate-500">ID: {payment.studentId}</div>
                              <div className="text-xs text-slate-400">{payment.studentEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex flex-col">
                            <span className="text-lg font-bold text-slate-900">₱{payment.amount.toLocaleString()}</span>
                            <span className="text-sm text-slate-600">{payment.paymentMethod}</span>
                            {payment.paymentGateway && (
                              <span className="text-xs text-slate-400">{payment.paymentGateway}</span>
                            )}
                            <span className="text-xs text-slate-400">{payment.enrollment.reviewType}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            payment.status === 'refunded' ? 'bg-gray-100 text-gray-800 border border-gray-200' :
                            'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              payment.status === 'completed' ? 'bg-green-500' :
                              payment.status === 'pending' ? 'bg-yellow-500' :
                              payment.status === 'refunded' ? 'bg-gray-500' :
                              'bg-red-500'
                            }`}></div>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => window.open(`/receipt?paymentId=${payment.id}`, '_blank')}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Receipt
                            </button>
                            {payment.status === 'completed' && (
                              <button
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setShowRefundModal(true);
                                }}
                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                              >
                                Refund
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                      disabled={currentPage === pagination.totalPages}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <PaymentForm
          onSubmit={handleCreatePayment}
          onClose={() => setShowPaymentForm(false)}
          students={students}
          enrollments={enrollments}
        />
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedPayment && (
        <RefundModal
          payment={selectedPayment}
          onRefund={handleRefund}
          onClose={() => {
            setShowRefundModal(false);
            setSelectedPayment(null);
          }}
        />
      )}
    </div>
  );
}

// Refund Modal Component
function RefundModal({ payment, onRefund, onClose }: { payment: Payment; onRefund: (id: string, amount: number, reason: string) => void; onClose: () => void }) {
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  const maxRefund = payment.amount - (payment.refundAmount || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(refundAmount);
    if (amount > 0 && amount <= maxRefund && refundReason.trim()) {
      onRefund(payment.id, amount, refundReason);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Process Refund</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refund Amount (Max: ₱{maxRefund.toLocaleString()})
            </label>
            <input
              type="number"
              step="0.01"
              max={maxRefund}
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refund Reason
            </label>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Process Refund
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}