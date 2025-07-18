"use client";
import React, { useState, useEffect } from 'react';

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has seen the modal before
    const hasSeenModal = localStorage.getItem('hasSeenWelcomeModal');
    
    if (!hasSeenModal) {
      // Show modal after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    // Set flag in localStorage so the modal doesn't show again for this user
    localStorage.setItem('hasSeenWelcomeModal', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">Welcome to Coeus</h2>
        </div>
        
        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center">
          <div className="w-32 h-32 mb-6">
            <img 
              src="/logo.png" 
              alt="Coeus Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <p className="text-center text-gray-700 mb-6">
            Welcome to the official website of Coeus Review & Training Specialist, Inc.
            Your partner in achieving professional excellence.
          </p>
          
          <button 
            onClick={closeModal}
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;