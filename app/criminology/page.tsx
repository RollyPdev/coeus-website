import React from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CriminologySection from "../../components/CriminologySection";

export default function CriminologyPage() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <main className="pt-20">
        {/* Page Header */}
        <div className="bg-blue-900 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Criminology Review Program</h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              Comprehensive preparation for the Criminologist Licensure Examination
            </p>
          </div>
        </div>
        
        {/* Criminology Content */}
        <CriminologySection />
      </main>
      <Footer />
    </div>
  );
}