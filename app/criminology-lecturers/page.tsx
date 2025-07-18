import React from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { criminologyLecturers } from "../../data/criminologyLecturers";

export default function CriminologyLecturersPage() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <main className="pt-20">
        {/* Page Header */}
        <div className="bg-blue-900 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Criminology Lecturers</h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              Meet our team of expert criminology lecturers who will guide you through your licensure examination preparation
            </p>
          </div>
        </div>
        
        {/* Lecturers Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Our Expert Team</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Learn from the best in the field of criminology. Our lecturers bring years of experience and expertise to help you succeed.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {criminologyLecturers.map((lecturer, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={lecturer.photo} 
                      alt={lecturer.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-70"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-bold text-xl">{lecturer.name}</h3>
                      <p className="text-blue-100">{lecturer.position}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4">{lecturer.credentials}</p>
                    
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subjects</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {lecturer.subjects.map((subject, i) => (
                        <span 
                          key={i} 
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-gray-700 text-sm line-clamp-3 mb-4">{lecturer.bio}</p>
                    
                    <button className="text-blue-700 font-medium hover:text-blue-800 transition-colors inline-flex items-center">
                      Read full profile
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Ready to Start Your Criminology Review?</h2>
              <p className="text-lg text-gray-700 mb-8">
                Join our Criminology Review Program and learn from these expert lecturers to prepare for your licensure examination.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a 
                  href="/criminology" 
                  className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Learn About Our Program
                </a>
                <a 
                  href="#contact" 
                  className="bg-transparent border-2 border-blue-700 text-blue-700 hover:bg-blue-50 font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}