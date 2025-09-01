"use client";

import { useState, useEffect } from 'react';

interface PaymentAnalyticsProps {
  analytics: any;
}

export default function PaymentAnalytics({ analytics }: PaymentAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const getRevenueByPeriod = () => {
    switch (selectedPeriod) {
      case 'daily':
        return analytics?.revenue?.daily || 0;
      case 'weekly':
        return analytics?.revenue?.weekly || 0;
      case 'monthly':
        return analytics?.revenue?.monthly || 0;
      case 'yearly':
        return analytics?.revenue?.yearly || 0;
      default:
        return 0;
    }
  };

  const getTransactionsByPeriod = () => {
    switch (selectedPeriod) {
      case 'daily':
        return analytics?.transactions?.daily || 0;
      case 'weekly':
        return analytics?.transactions?.weekly || 0;
      case 'monthly':
        return analytics?.transactions?.monthly || 0;
      case 'yearly':
        return analytics?.transactions?.yearly || 0;
      default:
        return 0;
    }
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  };

  const methodIcons = {
    cash: '💵',
    gcash: '📱',
    bank_transfer: '🏦',
    credit_card: '💳',
    paypal: '🌐'
  };

  return (
    <div className="space-y-6">
      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold">₱{(analytics?.revenue?.yearly || 0).toLocaleString()}</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">This Month</p>
              <p className="text-3xl font-bold">₱{(analytics?.revenue?.monthly || 0).toLocaleString()}</p>
            </div>
            <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Transactions</p>
              <p className="text-3xl font-bold">{(analytics?.transactions?.monthly || 0).toLocaleString()}</p>
            </div>
            <div className="bg-purple-400 bg-opacity-30 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Overdue</p>
              <p className="text-3xl font-bold">{analytics?.overduePayments || 0}</p>
            </div>
            <div className="bg-red-400 bg-opacity-30 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Status Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Status Distribution</h3>
          <div className="space-y-4">
            {analytics?.statusDistribution?.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </div>
                  <span className="text-sm text-gray-600">{item._count.status} payments</span>
                </div>
                <span className="font-semibold text-gray-900">
                  ₱{(item._sum.amount || 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-4">
            {analytics?.methodDistribution?.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {methodIcons[item.paymentMethod as keyof typeof methodIcons] || '💰'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.paymentMethod.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">{item._count.paymentMethod} transactions</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">
                  ₱{(item._sum.amount || 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Revenue Trends</h3>
          <div className="flex space-x-2">
            {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Revenue ({selectedPeriod})</p>
            <p className="text-4xl font-bold text-blue-600">
              ₱{getRevenueByPeriod().toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Transactions ({selectedPeriod})</p>
            <p className="text-4xl font-bold text-green-600">
              {getTransactionsByPeriod().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}