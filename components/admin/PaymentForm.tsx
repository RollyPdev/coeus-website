"use client";

import { useState } from 'react';

interface PaymentFormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
  students: any[];
  enrollments: any[];
}

export default function PaymentForm({ onSubmit, onClose, students, enrollments }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    studentId: '',
    enrollmentId: '',
    promoAvails: '',
    amount: '',
    paymentMethod: 'cash',
    paymentGateway: '',
    dueDate: '',
    notes: '',
    installmentPlan: 'full',
    paymentStatus: 'downpayment'
  });

  const [loading, setLoading] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [availableEnrollments, setAvailableEnrollments] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('');

  const handleStudentChange = (student: any) => {
    setSelectedStudent(student);
    setStudentSearch(`${student.firstName} ${student.lastName} (${student.studentId})`);
    setShowStudentDropdown(false);
    
    const studentEnrollments = enrollments.filter(e => e.studentId === student.id);
    setAvailableEnrollments(studentEnrollments);
    
    // Auto-select first enrollment if available
    const firstEnrollment = studentEnrollments[0];
    
    if (firstEnrollment) {
      const programName = getProgramName(firstEnrollment.reviewType);
      const finalProgram = programName || firstEnrollment.reviewType || 'Review for Criminology Licensure Examination';
      setSelectedProgram(finalProgram);
    } else {
      setSelectedProgram('Review for Criminology Licensure Examination');
    }
    
    setFormData(prev => ({
      ...prev,
      studentId: student.id,
      enrollmentId: firstEnrollment ? firstEnrollment.id : ''
    }));
  };

  // Sort students alphabetically and filter by search
  const filteredStudents = students
    .sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`))
    .filter(student => 
      `${student.firstName} ${student.lastName} ${student.studentId}`
        .toLowerCase()
        .includes(studentSearch.toLowerCase())
    );

  // Get program name based on reviewType
  const getProgramName = (reviewType: string) => {
    // Use exact text from enrollment form
    const programMap: { [key: string]: string } = {
      'Review for Criminology Licensure Examination': 'Review for Criminology Licensure Examination',
      'Nursing Review': 'Nursing Review',
      'criminology': 'Review for Criminology Licensure Examination',
      'nursing': 'Nursing Review',
      'cpd': 'Continuing Professional Development Program',
      'board_exam': 'Board Examination Review Program'
    };
    return programMap[reviewType] || reviewType;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.studentId || !formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please fill in all required fields with valid values.');
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalAmount = () => {
    return parseFloat(formData.amount) || 0;
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Create Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student
              </label>
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => {
                  setStudentSearch(e.target.value);
                  setShowStudentDropdown(true);
                }}
                onFocus={() => setShowStudentDropdown(true)}

                placeholder="Search for a student..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {showStudentDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                      <div
                        key={student.id}
                        onClick={() => handleStudentChange(student)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {student.studentId} • {student.email}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      No students found
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program
              </label>
              <input
                type="text"
                value={selectedProgram || (selectedStudent ? 'Review for Criminology Licensure Examination' : '')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                disabled
                placeholder={selectedStudent ? 'Program will appear here' : 'Select a student first'}
              />
              <input
                type="hidden"
                value={formData.enrollmentId}
              />
              {/* Debug info for enrollment */}
              <div className="text-xs text-gray-500 mt-1">
                EnrollmentId: {formData.enrollmentId || 'Not set'}
              </div>
            </div>
          </div>

          {/* Promo Avails and Payment Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Enrollment Value (₱)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.promoAvails}
                onChange={(e) => setFormData(prev => ({ ...prev, promoAvails: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Total value student needs to pay"
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
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Amount student paid"
                required
              />
            </div>
          </div>

          {/* Payment Method and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="cash">Cash</option>
                <option value="gcash">GCash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentStatus: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="downpayment">Downpayment</option>
                <option value="registration_fee">Registration Fee</option>
                <option value="fully_paid">Fully Paid</option>
              </select>
            </div>
          </div>

          {/* Gateway and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Gateway (Optional)
              </label>
              <input
                type="text"
                value={formData.paymentGateway}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentGateway: e.target.value }))}

                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., PayMongo, Stripe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date (Optional)
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}

                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>



          {/* Installment Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Installment Plan
            </label>
            <select
              value={formData.installmentPlan}
              onChange={(e) => setFormData(prev => ({ ...prev, installmentPlan: e.target.value }))}

              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="full">Full Payment</option>
              <option value="monthly">Monthly Installment</option>
              <option value="quarterly">Quarterly Installment</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}

              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes about this payment..."
            />
          </div>

          {/* Payment Summary */}
          {(formData.amount || formData.promoAvails) && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-gray-900 mb-3">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                {formData.promoAvails && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Total Enrollment Value:</span>
                    <span className="font-medium text-green-700">₱{parseFloat(formData.promoAvails || '0').toLocaleString()}</span>
                  </div>
                )}
                {formData.amount && (
                  <div className="flex justify-between">
                    <span className="text-blue-600">Payment Amount:</span>
                    <span className="font-medium text-blue-700">₱{parseFloat(formData.amount || '0').toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Remaining Balance:</span>
                    <span className="text-orange-700">₱{Math.max(0, parseFloat(formData.promoAvails || '0') - parseFloat(formData.amount || '0')).toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  Status: <span className="font-medium capitalize">{formData.paymentStatus.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Payment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}