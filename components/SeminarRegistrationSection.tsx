"use client";
import React, { useState } from 'react';

const SeminarRegistrationSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
    licenseNumber: '',
    seminarId: '',
    paymentMethod: 'bank'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage({
        type: 'success',
        text: 'Registration successful! We will contact you with further details.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        profession: '',
        licenseNumber: '',
        seminarId: '',
        paymentMethod: 'bank'
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitMessage(null);
      }, 5000);
    }, 1500);
  };

  return (
    <section className="py-16 bg-blue-50" id="registration">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Register for a CPD Seminar</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Complete the form below to register for one of our upcoming CPD seminars. Our team will contact you with payment instructions and further details.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {submitMessage && (
              <div className={`mb-6 p-4 rounded-lg ${submitMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {submitMessage.text}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                  <input 
                    type="text" 
                    id="profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                  <input 
                    type="text" 
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="seminarId" className="block text-sm font-medium text-gray-700 mb-1">Select Seminar</label>
                  <select 
                    id="seminarId"
                    name="seminarId"
                    value={formData.seminarId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    required
                  >
                    <option value="">Select a seminar</option>
                    <option value="1">Professional Ethics and Ethical Standards</option>
                    <option value="2">Leadership and Management in Professional Practice</option>
                    <option value="3">Digital Transformation in Professional Services</option>
                    <option value="4">Research Methodologies and Evidence-Based Practice</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="bank" 
                      checked={formData.paymentMethod === 'bank'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-2 text-gray-700">Bank Transfer</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="gcash" 
                      checked={formData.paymentMethod === 'gcash'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-2 text-gray-700">GCash</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cash" 
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-2 text-gray-700">Cash</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : 'Register Now'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Registration Notes</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Registration confirmation will be sent to your email within 24 hours.</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Payment instructions will be included in the confirmation email.</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Please bring your professional ID and payment receipt on the day of the seminar.</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>CPD certificates will be issued at the end of the seminar.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeminarRegistrationSection;