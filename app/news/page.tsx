import React from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import NewsEventsSection from "../../components/NewsEventsSection";
import FeaturedStorySection from "../../components/FeaturedStorySection";

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
        <FeaturedStorySection />
        
        {/* News & Events Section */}
        <NewsEventsSection excludeFeatured={true} />
        
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