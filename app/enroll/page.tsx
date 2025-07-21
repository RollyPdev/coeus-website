"use client";

import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EnrollmentForm from '../../components/EnrollmentForm';
import '../../styles/enrollment-styles.css';

export default function EnrollPage() {
  // Force correct background on component mount and cleanup on unmount
  useEffect(() => {
    const enrollContainer = document.querySelector('.enroll-page-container');
    if (enrollContainer) {
      (enrollContainer as HTMLElement).style.background = 'linear-gradient(to bottom, rgb(239 246 255), rgb(255 255 255))';
    }
    
    // Cleanup function to reset any persistent styles
    return () => {
      // Remove any home page styles that might persist
      const homeContainers = document.querySelectorAll('.home-page-container');
      homeContainers.forEach(container => {
        (container as HTMLElement).style.background = '';
      });
    };
  }, []);
  return (
    <div className="min-h-screen enroll-page-container" style={{ background: 'linear-gradient(to bottom, rgb(239 246 255), rgb(255 255 255))' }}>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Enroll Now</h1>
            <p className="text-lg text-gray-700">
              Take the first step towards your professional success by enrolling in one of our review programs.
            </p>
          </div>
          
          <EnrollmentForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}