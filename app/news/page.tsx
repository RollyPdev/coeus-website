import React from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import NewsEventsSection from "../../components/NewsEventsSection";

export default function NewsPage() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <main className="pt-20">
        {/* Page Header */}
        <div className="bg-blue-900 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Events</h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              Stay updated with the latest happenings at Coeus Review & Training Specialist, Inc.
            </p>
          </div>
        </div>
        
        {/* Featured News */}
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
                    src="/featured-news.jpg" 
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
                  <p className="text-gray-700 mb-6">
                    To commemorate this occasion, we are launching several initiatives including scholarship programs, community outreach activities, and special anniversary events throughout the year.
                  </p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    June 1, 2023
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* News & Events Section */}
        <NewsEventsSection />
        
        {/* Subscribe Section */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Stay Updated</h2>
              <p className="text-lg text-gray-700 mb-8">
                Subscribe to our newsletter to receive the latest news, events, and promotions directly in your inbox.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required
                />
                <button 
                  type="submit" 
                  className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
              
              <p className="text-sm text-gray-500 mt-4">
                We respect your privacy. You can unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}