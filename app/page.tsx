"use client";

import { useEffect } from "react";
import Navbar from "../components/Navbar";
import PhotoSlider from "../components/PhotoSlider";
import AnimatedLogoSection from "../components/AnimatedLogoSection";
import ProgramsSection from "../components/ProgramsSection";
import ReviewLecturersSection from "../components/ReviewLecturersSection";
import BoardPassersSection from "../components/BoardPassersSection";
import TestimonialsSection from "../components/TestimonialsSection";
import AboutCEOSection from "../components/AboutCEOSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import CounterAnimation from "../components/CounterAnimation";
import NewsEventsSection from "../components/NewsEventsSection";
import FeaturedStorySection from "../components/FeaturedStorySection";
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
        <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden" id="about-intro">
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
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              <div className="lg:w-1/2 text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-blue-900">Coeus Review & Training Specialist, Inc.</h2>
                <div className="w-20 h-1 bg-blue-600 mb-6"></div>
                <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                  We are dedicated to providing high-quality review programs and professional development seminars to help you achieve your career goals and aspirations.
                </p>
                <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
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
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden">
          {/* Animated background elements - hidden on mobile */}
          <div className="absolute inset-0 opacity-10 hidden sm:block">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-white rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 animate-fade-in-up">Our Achievements</h2>
              <div className="w-16 sm:w-24 h-1 bg-white mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}></div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
              <div className="p-3 sm:p-4 lg:p-6 transform transition-all duration-700 hover:scale-110 hover:bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 group">
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-4 group-hover:animate-pulse">
                  <svg className="w-8 h-8 sm:w-10 h-10 lg:w-12 h-12 text-yellow-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-3 flex justify-center text-yellow-300">
                  <CounterAnimation end={2500} suffix="+" duration={3000} />
                </div>
                <div className="text-blue-200 font-medium text-xs sm:text-sm lg:text-base">Students Trained</div>
              </div>
              
              <div className="p-6 transform transition-all duration-700 hover:scale-110 hover:bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 group">
                <div className="text-5xl mb-4 group-hover:animate-pulse">
                  <svg className="w-12 h-12 text-green-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
                <div className="text-4xl font-bold mb-3 flex justify-center text-green-300">
                  <CounterAnimation end={98} suffix="%" duration={2800} />
                </div>
                <div className="text-blue-200 font-medium">Passing Rate</div>
              </div>
              
              <div className="p-6 transform transition-all duration-700 hover:scale-110 hover:bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 group">
                <div className="text-5xl mb-4 group-hover:animate-pulse">
                  👨‍🏫
                </div>
                <div className="text-4xl font-bold mb-3 flex justify-center text-blue-300">
                  <CounterAnimation end={75} suffix="+" duration={2600} />
                </div>
                <div className="text-blue-200 font-medium">Expert Lecturers</div>
              </div>
              
              <div className="p-6 transform transition-all duration-700 hover:scale-110 hover:bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 group">
                <div className="text-5xl mb-4 group-hover:animate-pulse">
                  <svg className="w-12 h-12 text-orange-300 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="text-4xl font-bold mb-3 flex justify-center text-orange-300">
                  <CounterAnimation end={15} suffix="+" duration={2400} />
                </div>
                <div className="text-blue-200 font-medium">Years Experience</div>
              </div>
            </div>
          </div>
          
          <style jsx>{`
            @keyframes fade-in-up {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-in-up {
              animation: fade-in-up 0.8s ease-out forwards;
            }
          `}</style>
        </section>
        
        {/* Featured Story Section */}
        <FeaturedStorySection />
        
        {/* Programs Section */}
        <ProgramsSection />
        
        {/* Review Lecturers Section */}
        <ReviewLecturersSection />
        
        {/* Board Passers Section */}
        <BoardPassersSection />
        
        {/* News & Events Section */}
        <NewsEventsSection />
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* About CEO Section */}
        <AboutCEOSection />
        
        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Ready to Start Your Journey?</h2>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">Join our review programs and take the first step towards achieving your professional goals.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <a 
                href="/attendance" 
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Mark Attendance
              </a>
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
