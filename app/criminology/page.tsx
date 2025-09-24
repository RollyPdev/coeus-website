import React from 'react';
import { Metadata } from 'next';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CriminologySection from "../../components/CriminologySection";

export const metadata: Metadata = {
  title: 'Criminology Review Program - Coeus Review & Training Specialist, Inc.',
  description: 'Comprehensive Criminology review program for the Criminologist Licensure Examination. Expert lecturers, proven track record, and high passing rates.',
  keywords: ['criminology review', 'criminologist board exam', 'licensure examination', 'review center', 'Roxas City'],
  openGraph: {
    title: 'Criminology Review Program - High Passing Rates',
    description: 'Join our comprehensive Criminology review program with expert lecturers and proven success in board examinations.',
    url: 'https://coeus-incorporated.com/criminology',
    images: [
      {
        url: 'https://coeus-incorporated.com/image-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Criminology Review Program',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Criminology Review Program - Coeus Review Center',
    description: 'Comprehensive preparation for the Criminologist Licensure Examination with high passing rates.',
    images: ['https://coeus-incorporated.com/image-1.jpg'],
  },
};

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