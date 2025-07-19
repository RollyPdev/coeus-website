"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Barcode } from 'react-barcode';

interface FormData {
  reviewType: string;
  photo: string | null;
  firstName: string;
  lastName: string;
  middleInitial: string;
  gender: string;
  birthday: string;
  birthPlace: string;
  contactNumber: string;
  email: string;
  address: string;
  guardianFirstName: string;
  guardianLastName: string;
  guardianMiddleInitial: string;
  guardianContact: string;
  guardianAddress: string;
  paymentMethod: string;
  amount: string;
}

const EnrollmentForm = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    reviewType: '',
    photo: null,
    firstName: '',
    lastName: '',
    middleInitial: '',
    gender: '',
    birthday: '',
    birthPlace: '',
    contactNumber: '',
    email: '',
    address: '',
    guardianFirstName: '',
    guardianLastName: '',
    guardianMiddleInitial: '',
    guardianContact: '',
    guardianAddress: '',
    paymentMethod: '',
    amount: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const generateQRCode = async (data: any) => {
    try {
      const url = await QRCode.toDataURL(data);
      setQrCodeUrl(url);
      return url;
    } catch (err) {
      console.error(err);
      return '';
    }
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    
    // Generate QR code
    const qrData = JSON.stringify({
      studentId,
      enrollmentId,
      name: `${formData.firstName} ${formData.lastName}`,
      reviewType: formData.reviewType,
      amount: formData.amount,
      date: new Date().toISOString()
    });
    
    const qrUrl = await generateQRCode(qrData);
    
    // Add content to PDF
    doc.setFontSize(22);
    doc.text("COEUS REVIEW CENTER", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.text("Enrollment Receipt", 105, 30, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Student ID: ${studentId}`, 20, 40);
    doc.text(`Enrollment ID: ${enrollmentId}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
    
    doc.text("Student Information:", 20, 80);
    doc.text(`Name: ${formData.lastName}, ${formData.firstName} ${formData.middleInitial}.`, 30, 90);
    doc.text(`Review Type: ${formData.reviewType}`, 30, 100);
    doc.text(`Contact: ${formData.contactNumber}`, 30, 110);
    doc.text(`Email: ${formData.email}`, 30, 120);
    
    doc.text("Payment Information:", 20, 140);
    doc.text(`Method: ${formData.paymentMethod}`, 30, 150);
    doc.text(`Amount: PHP ${formData.amount}`, 30, 160);
    
    // Add QR code
    if (qrUrl) {
      doc.addImage(qrUrl, 'PNG', 70, 170, 60, 60);
    }
    
    doc.text("Please present this receipt to our staff for verification.", 105, 240, { align: "center" });
    
    return doc;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // For demo purposes, generate IDs locally
      const studentId = `STU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const enrollmentId = `ENR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      // Set the IDs
      setEnrollmentId(enrollmentId);
      setStudentId(studentId);
      
      // Generate PDF
      const doc = await generatePDF();
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Save PDF for download
      window.localStorage.setItem('enrollmentPdf', doc.output('datauristring'));
      
      // In a real app, we would send the data to the server here
      // For demo purposes, we'll just simulate a successful submission
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleDownloadPDF = () => {
    const pdfData = window.localStorage.getItem('enrollmentPdf');
    if (pdfData) {
      const link = document.createElement('a');
      link.href = pdfData;
      link.download = `coeus-enrollment-${studentId}-${enrollmentId}.pdf`;
      link.click();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6 text-center">Enrollment Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Review Type and Photo */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="reviewType" className="block text-sm font-medium text-gray-700 mb-1">
                What are you enrolling for?
              </label>
              <select
                id="reviewType"
                name="reviewType"
                value={formData.reviewType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Select a review program</option>
                <option value="Nursing Review">Nursing Review</option>
                <option value="Criminologist Review">Criminologist Review</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload Your Photo
              </label>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-blue-500">
                  {formData.photo ? (
                    <img 
                      src={formData.photo} 
                      alt="Student" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Select Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Personal Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-800">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="middleInitial" className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Initial
                </label>
                <input
                  type="text"
                  id="middleInitial"
                  name="middleInitial"
                  value={formData.middleInitial}
                  onChange={handleChange}
                  maxLength={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday
                </label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700 mb-1">
                Birth Place
              </label>
              <input
                type="text"
                id="birthPlace"
                name="birthPlace"
                value={formData.birthPlace}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Complete Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              ></textarea>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Guardian Information */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-800">Guardian Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="guardianFirstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="guardianFirstName"
                  name="guardianFirstName"
                  value={formData.guardianFirstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="guardianLastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="guardianLastName"
                  name="guardianLastName"
                  value={formData.guardianLastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="guardianMiddleInitial" className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Initial
                </label>
                <input
                  type="text"
                  id="guardianMiddleInitial"
                  name="guardianMiddleInitial"
                  value={formData.guardianMiddleInitial}
                  onChange={handleChange}
                  maxLength={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="guardianContact" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                id="guardianContact"
                name="guardianContact"
                value={formData.guardianContact}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            
            <div>
              <label htmlFor="guardianAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                id="guardianAddress"
                name="guardianAddress"
                value={formData.guardianAddress}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              ></textarea>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {/* Step 4: Payment Information */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-800">Payment Information</h3>
            
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Select payment method</option>
                <option value="GCash">GCash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (PHP)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
              >
                Enroll Now
              </button>
            </div>
          </div>
        )}
      </form>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enrollment Successful!</h3>
              <p className="text-gray-600 mb-2">
                Thank you for enrolling with Coeus Review Center. Please download your enrollment receipt and present it to our staff for verification.
              </p>
              <div className="mb-4 text-center">
                <p className="text-sm font-semibold">Student ID: <span className="text-blue-600">{studentId}</span></p>
                <p className="text-sm font-semibold">Enrollment ID: <span className="text-blue-600">{enrollmentId}</span></p>
              </div>
              
              {qrCodeUrl && (
                <div className="mb-6 flex justify-center">
                  <img src={qrCodeUrl} alt="QR Code" className="h-32 w-32" />
                </div>
              )}
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleDownloadPDF}
                  className="w-full px-4 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Download Receipt
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    router.push('/');
                  }}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentForm;