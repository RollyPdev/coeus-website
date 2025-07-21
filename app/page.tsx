"use client";

import { useEffect } from "react";
import Navbar from "../components/Navbar";
import PhotoSlider from "../components/PhotoSlider";
import AnimatedLogoSection from "../components/AnimatedLogoSection";
import ProgramsSection from "../components/ProgramsSection";
import ReviewLecturersSection from "../components/ReviewLecturersSection";
import TestimonialsSection from "../components/TestimonialsSection";
import AboutCEOSection from "../components/AboutCEOSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import CounterAnimation from "../components/CounterAnimation";
import NewsEventsSection from "../components/NewsEventsSection";
import "../styles/enrollment-styles.css";

export default function Home() {
  // Force correct background on component mount and cleanup on unmount
  useEffect(() => {
    const homeContainer = document.querySelector('.home-page-container');
    if (homeContainer) {
      (homeContainer as HTMLElement).style.background = 'linear-gradient(to bottom right, rgb(239 246 255), rgb(219 234 254))';
    }
    
    // Cleanup function to reset any persistent styles
    return () => {
      // Remove any enrollment page styles that might persist
      const enrollContainers = document.querySelectorAll('.enroll-page-container');
      enrollContainers.forEach(container => {
        (container as HTMLElement).remove();
      });
    };
  }, []);
  
  return (
    <div className="font-sans min-h-screen home-page-container bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <main>
        {/* Hero Section */}
        <PhotoSlider />
        
        {/* About Section with animated logo */}
        <section className="py-20 bg-white relative overflow-hidden" id="about-intro">
          {/* Background image with blur */}
          <div className="absolute inset-0 w-full h-full z-0">
            <img 
              src="/background-image.jpg" 
              alt="Background" 
              className="w-full h-full object-cover blur-md scale-105" 
              style={{ filter: 'blur(8px)' }}
            />
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-white opacity-70" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">Coeus Review & Training Specialist, Inc.</h2>
                <div className="w-20 h-1 bg-blue-600 mb-6"></div>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  We are dedicated to providing high-quality review programs and professional development seminars to help you achieve your career goals and aspirations.
                </p>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  With our team of expert lecturers and comprehensive study materials, we ensure that you are well-prepared for your licensure examinations and professional growth.
                </p>
                <a 
                  href="/about" 
                  className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800 transition-colors"
                >
                  Learn more about us
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <div className="w-full max-w-md">
                  <AnimatedLogoSection />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-16 bg-blue-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-4 transform transition-all duration-500 hover:scale-110">
                <div className="text-4xl font-bold mb-2 flex justify-center">
                  <CounterAnimation end={1000} suffix="+" />
                </div>
                <div className="text-blue-200">Students Trained</div>
              </div>
              <div className="p-4 transform transition-all duration-500 hover:scale-110">
                <div className="text-4xl font-bold mb-2 flex justify-center">
                  <CounterAnimation end={95} suffix="%" />
                </div>
                <div className="text-blue-200">Passing Rate</div>
              </div>
              <div className="p-4 transform transition-all duration-500 hover:scale-110">
                <div className="text-4xl font-bold mb-2 flex justify-center">
                  <CounterAnimation end={50} suffix="+" />
                </div>
                <div className="text-blue-200">Expert Lecturers</div>
              </div>
              <div className="p-4 transform transition-all duration-500 hover:scale-110">
                <div className="text-4xl font-bold mb-2 flex justify-center">
                  <CounterAnimation end={10} suffix="+" />
                </div>
                <div className="text-blue-200">Years Experience</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Story Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Featured Story</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl overflow-hidden shadow-lg">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2">
                  <img 
                    src="/background-image.jpg" 
                    alt="Featured News" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="lg:w-1/2 p-8">
                  <div className="inline-block bg-blue-700 text-white px-3 py-1 rounded-lg mb-4">
                    News
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">
                    Coeus Celebrates 10 Years of Excellence in Professional Education
                  </h3>
                  <p className="text-gray-700 mb-6">
                    This year marks a significant milestone for Coeus Review & Training Specialist, Inc. as we celebrate our 10th anniversary. Over the past decade, we have helped thousands of students achieve their professional goals through our comprehensive review programs and CPD seminars.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-500 text-sm">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      June 1, 2023
                    </div>
                    <a 
                      href="/news" 
                      className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800 transition-colors"
                    >
                      Read more
                      <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Programs Section */}
        <ProgramsSection />
        
        {/* Review Lecturers Section */}
        <ReviewLecturersSection />
        
        {/* News & Events Section */}
        <NewsEventsSection />
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* About CEO Section */}
        <AboutCEOSection />
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">Join our review programs and take the first step towards achieving your professional goals.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="#contact" 
                className="bg-white text-blue-700 hover:bg-blue-50 font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Contact Us
              </a>
              <a 
                href="#programs" 
                className="bg-transparent hover:bg-white/20 text-white border-2 border-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Explore Programs
              </a>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
