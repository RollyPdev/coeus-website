"use client";

interface PaymentSummaryCardsProps {
  totalStudents: number;
  totalEnrollmentAmount: number;
  totalPaidAmount: number;
  totalRemainingBalance: number;
  paidInFull: number;
  partialPayments: number;
  pendingPayments: number;
}

export default function PaymentSummaryCards({
  totalStudents,
  totalEnrollmentAmount,
  totalPaidAmount,
  totalRemainingBalance,
  paidInFull,
  partialPayments,
  pendingPayments
}: PaymentSummaryCardsProps) {
  const collectionRate = totalEnrollmentAmount > 0 ? (totalPaidAmount / totalEnrollmentAmount) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Students */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Students</p>
            <p className="text-3xl font-bold">{totalStudents}</p>
          </div>
          <div className="bg-blue-400/30 rounded-lg p-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-blue-100">
            {paidInFull} paid • {partialPayments} partial • {pendingPayments} pending
          </span>
        </div>
      </div>

      {/* Total Enrollment Amount */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Total Enrollment</p>
            <p className="text-3xl font-bold">₱{totalEnrollmentAmount.toLocaleString()}</p>
          </div>
          <div className="bg-green-400/30 rounded-lg p-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-100">Expected revenue from all enrollments</span>
        </div>
      </div>

      {/* Amount Available (Total Paid) */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">Amount Available</p>
            <p className="text-3xl font-bold">₱{totalPaidAmount.toLocaleString()}</p>
          </div>
          <div className="bg-purple-400/30 rounded-lg p-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-purple-100">
            {collectionRate.toFixed(1)}% collection rate
          </span>
        </div>
      </div>

      {/* Current Balance (Remaining) */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">Current Balance</p>
            <p className="text-3xl font-bold">₱{totalRemainingBalance.toLocaleString()}</p>
          </div>
          <div className="bg-orange-400/30 rounded-lg p-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-orange-100">Outstanding balance to collect</span>
        </div>
      </div>
    </div>
  );
}