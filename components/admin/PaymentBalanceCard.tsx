"use client";

interface PaymentBalanceCardProps {
  studentName: string;
  studentId: string;
  totalEnrollment: number;
  totalPaid: number;
  remainingBalance: number;
  amountAvailable: number;
  currentBalance: number;
  paymentStatus: string;
}

export default function PaymentBalanceCard({
  studentName,
  studentId,
  totalEnrollment,
  totalPaid,
  remainingBalance,
  amountAvailable,
  currentBalance,
  paymentStatus
}: PaymentBalanceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const progressPercentage = totalEnrollment > 0 ? (totalPaid / totalEnrollment) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{studentName}</h3>
            <p className="text-blue-100 text-sm">ID: {studentId}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(paymentStatus)}`}>
            {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-3 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Payment Progress</span>
          <span>{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Balance Details */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Total Enrollment */}
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-blue-600 text-sm font-medium mb-1">Total Enrollment</div>
            <div className="text-2xl font-bold text-blue-900">₱{totalEnrollment.toLocaleString()}</div>
          </div>

          {/* Amount Available */}
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-green-600 text-sm font-medium mb-1">Amount Available</div>
            <div className="text-2xl font-bold text-green-900">₱{amountAvailable.toLocaleString()}</div>
          </div>

          {/* Remaining Balance */}
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-orange-600 text-sm font-medium mb-1">Remaining Balance</div>
            <div className="text-2xl font-bold text-orange-900">₱{remainingBalance.toLocaleString()}</div>
          </div>

          {/* Current Balance */}
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-purple-600 text-sm font-medium mb-1">Current Balance</div>
            <div className="text-2xl font-bold text-purple-900">₱{currentBalance.toLocaleString()}</div>
          </div>
        </div>

        {/* Balance Calculation Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Total Paid:</span>
              <span className="font-medium">₱{totalPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Available (Total Paid):</span>
              <span className="font-medium text-green-600">₱{amountAvailable.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span>Current Balance (Remaining):</span>
              <span className="font-medium text-orange-600">₱{currentBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}