import React from 'react';
import { Metadata } from 'next';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SeminarPreviewSection from "../../components/SeminarPreviewSection";
import SeminarRegistrationSection from "../../components/SeminarRegistrationSection";

export const metadata: Metadata = {
  title: 'CPD Seminars - Continuing Professional Development | Coeus Review',
  description: 'PRC-accredited CPD seminars for licensed professionals. Expert speakers, comprehensive materials, and convenient scheduling for your continuing education needs.',
  keywords: ['CPD seminars', 'continuing professional development', 'PRC accredited', 'professional education', 'licensed professionals'],
  openGraph: {
    title: 'CPD Seminars - Professional Development Programs',
    description: 'Join our PRC-accredited CPD seminars with expert speakers and comprehensive learning materials.',
    url: 'https://coeus-incorporated.com/cpd',
    images: [
      {
        url: 'https://coeus-incorporated.com/image-1.jpg',
        width: 1200,
        height: 630,
        alt: 'CPD Seminars - Professional Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CPD Seminars - Coeus Review & Training',
    description: 'PRC-accredited continuing professional development seminars for licensed professionals.',
    images: ['https://coeus-incorporated.com/image-1.jpg'],
  },
};

export default function CPDPage() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <main className="pt-20">
        {/* Page Header */}
        <div className="bg-blue-900 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">CPD Seminars</h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              Continuing Professional Development for Licensed Professionals
            </p>
          </div>
        </div>
        
        {/* CPD Overview Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">Why Choose Our CPD Seminars?</h2>
                <div className="w-20 h-1 bg-blue-600 mb-6"></div>
                <p className="text-lg text-gray-700 mb-6">
                  Our CPD seminars are designed to help professionals stay current with industry trends, enhance their skills, and meet continuing education requirements.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-blue-900">PRC Accredited</h3>
                      <p className="text-gray-700">All our seminars are accredited by the Professional Regulation Commission.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-blue-900">Expert Speakers</h3>
                      <p className="text-gray-700">Learn from industry experts and thought leaders in your field.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-blue-900">Comprehensive Materials</h3>
                      <p className="text-gray-700">Receive detailed handouts and resources to support your learning.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <img 
                  src="/cpd-overview.jpg" 
                  alt="CPD Seminar" 
                  className="rounded-xl shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Upcoming Seminars Section */}
        <SeminarPreviewSection />
        
        {/* Registration Section */}
        <SeminarRegistrationSection />
        
        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Frequently Asked Questions</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">What is CPD?</h3>
                <p className="text-gray-700">
                  Continuing Professional Development (CPD) refers to the process of tracking and documenting the skills, knowledge, and experience that you gain both formally and informally as you work, beyond any initial training.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">How many CPD units do I need?</h3>
                <p className="text-gray-700">
                  The required number of CPD units varies by profession. Please check with your professional regulatory board for specific requirements.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">How do I get my CPD certificate?</h3>
                <p className="text-gray-700">
                  CPD certificates are issued at the end of each seminar. You must attend the entire seminar to receive your certificate.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">Can I cancel my registration?</h3>
                <p className="text-gray-700">
                  Cancellations made at least 7 days before the seminar date are eligible for a full refund. Cancellations made less than 7 days before the seminar date are not refundable, but you may transfer your registration to another person.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}