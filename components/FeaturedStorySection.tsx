"use client";

import React, { useState, useEffect } from 'react';
import { FeaturedStorySkeleton } from './SkeletonLoader';

interface NewsEvent {
  id: string;
  title: string;
  content: string;
  summary: string;
  image: string;
  date: string;
  category: string;
  featured: boolean;
}

const FeaturedStorySection = () => {
  const [featuredStory, setFeaturedStory] = useState<NewsEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchFeaturedStory = async () => {
      try {
        const response = await fetch('/api/news-events');
        if (response.ok) {
          const data = await response.json();
          const featured = data.find((item: NewsEvent) => item.featured);
          if (featured) {
            setFeaturedStory({
              ...featured,
              date: new Date(featured.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            });
          }
        }
      } catch (error) {
        console.error('Error fetching featured story:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedStory();
  }, []);

  if (loading) {
    return <FeaturedStorySkeleton />;
  }

  if (!featuredStory) {
    return null;
  }

  return (
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
                src={featuredStory.image} 
                alt={featuredStory.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:w-1/2 p-8">
              <div className={`inline-block px-3 py-1 rounded-lg mb-4 text-white ${
                featuredStory.category.toLowerCase() === 'news' ? 'bg-blue-700' : 'bg-green-600'
              }`}>
                {featuredStory.category}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">
                {featuredStory.title}
              </h3>
              <p className="text-gray-700 mb-6">
                {featuredStory.summary}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-500 text-sm">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {featuredStory.date}
                </div>
                <button 
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800 transition-colors"
                >
                  Read more
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal for full article */}
      {showModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64">
              <img 
                src={featuredStory.image} 
                alt={featuredStory.title} 
                className="w-full h-full object-cover"
              />
              <button 
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-300"
                onClick={() => setShowModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-white ${
                featuredStory.category.toLowerCase() === 'news' ? 'bg-blue-700' : 'bg-green-600'
              }`}>
                {featuredStory.category}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {featuredStory.date}
              </div>
              
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                {featuredStory.title}
              </h3>
              
              <p className="text-gray-700 mb-6 whitespace-pre-line">
                {featuredStory.content}
              </p>
              
              <div className="flex justify-end">
                <button 
                  className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedStorySection;