import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EnrollmentForm from '../../components/EnrollmentForm';

export default function EnrollPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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