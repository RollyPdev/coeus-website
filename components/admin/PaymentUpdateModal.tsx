"use client";

import { useState } from 'react';

interface Payment {
  id: string;
  transactionId: string;
  studentName: string;
  studentId: string;
  amount: number;
  promoAvails?: number;
  paymentStatus?: string;
  paymentMethod: string;
  status: string;
  notes?: string;
  enrollment: {
    id: string;
    reviewType: string;
    amount: number;
    totalPaid: number;
    remainingBalance: number;
  };
}

interface PaymentUpdateModalProps {
  payment: Payment;
  onUpdate: (id: string, data: any) => void;
  onClose: () => void;
}

export default function PaymentUpdateModal({ payment, onUpdate, onClose }: PaymentUpdateModalProps) {
  const [formData, setFormData] = useState({
    promoAvails: (payment.promoAvails || 0).toString(),
    amount: payment.amount.toString(),
    paymentMethod: payment.paymentMethod,
    status: payment.status,
    paymentStatus: payment.paymentStatus || 'downpayment',
    notes: payment.notes || ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onUpdate(payment.id, {
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        status: formData.status,
        paymentStatus: formData.paymentStatus,
        notes: formData.notes
      });
    } finally {
      setLoading(false);
    }
  };

  const amountAvailable = payment.enrollment.totalPaid;
  const currentBalance = payment.enrollment.remainingBalance;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Update Payment</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Student Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Student Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Name:</span>
                <span className="ml-2">{payment.studentName}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">ID:</span>
                <span className="ml-2">{payment.studentId}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Program:</span>
                <span className="ml-2">{payment.enrollment.reviewType}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Transaction:</span>
                <span className="ml-2 font-mono">{payment.transactionId}</span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="text-indigo-600 text-sm font-medium">Total Enrollment</div>
              <div className="text-2xl font-bold text-indigo-900">₱{payment.enrollment.amount.toLocaleString()}</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-600 text-sm font-medium">Total Enrollment</div>
              <div className="text-2xl font-bold text-green-900">₱{payment.enrollment.amount.toLocaleString()}</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-blue-600 text-sm font-medium">Amount Available</div>
              <div className="text-2xl font-bold text-blue-900">₱{amountAvailable.toLocaleString()}</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="text-orange-600 text-sm font-medium">Remaining Balance</div>
              <div className="text-2xl font-bold text-orange-900">₱{currentBalance.toLocaleString()}</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-purple-600 text-sm font-medium">New Balance</div>
              <div className="text-2xl font-bold text-purple-900">₱{Math.max(0, payment.enrollment.amount - (parseFloat(formData.amount) || 0)).toLocaleString()}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Enrollment Value (₱)
                </label>
                <input
                  type="text"
                  value={`₱${payment.enrollment.amount.toLocaleString()}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                  disabled
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount (₱)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="gcash">GCash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="check">Check</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status Type
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="downpayment">Downpayment</option>
                  <option value="registration_fee">Registration Fee</option>
                  <option value="fully_paid">Fully Paid</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any notes about this payment..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}