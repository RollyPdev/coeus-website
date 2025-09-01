"use client";
import React, { useState, useEffect } from 'react';

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

const NewsEventsSection = () => {
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsEvents = async () => {
      try {
        console.log('Fetching news events...');
        const response = await fetch('/api/news-events');
        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched news events:', data);
          setNewsEvents(data.map((item: any) => ({
            ...item,
            date: new Date(item.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          })));
        } else {
          console.error('Failed to fetch news events:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching news events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white" id="news-events">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading news and events...</p>
          </div>
        </div>
      </section>
    );
  }
  
  const filteredItems = activeTab === 'all' 
    ? newsEvents 
    : newsEvents.filter(item => item.category.toLowerCase() === activeTab);

  return (
    <section className="py-16 bg-white" id="news-events">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">News & Events</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Stay updated with the latest news and upcoming events at Coeus Review & Training Specialist, Inc.
          </p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                activeTab === 'all' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'news' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-200`}
            >
              News
            </button>
            <button
              onClick={() => setActiveTab('event')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                activeTab === 'event' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200`}
            >
              Events
            </button>
          </div>
        </div>
        
        {/* News/Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <svg className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-gray-500 text-lg">No news or events available at the moment.</p>
              <p className="text-gray-400 text-sm mt-2">Check back later for updates!</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedItem(item.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-0 right-0 ${
                    item.category.toLowerCase() === 'news' ? 'bg-blue-700' : 'bg-green-600'
                  } text-white px-3 py-1 rounded-bl-lg`}>
                    {item.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {item.date}
                  </div>
                  
                  <h3 className="text-xl font-bold text-blue-900 mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-700 mb-4 line-clamp-3">{item.summary}</p>
                  
                  <button 
                    className="text-blue-700 font-medium hover:text-blue-800 transition-colors inline-flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item.id);
                    }}
                  >
                    Read more
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* View More Button */}
        <div className="mt-12 text-center">
          <a 
            href="/news"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            View All News & Events
          </a>
        </div>
      </div>
      
      {/* Modal for full article */}
      {selectedItem !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64">
              <img 
                src={newsEvents.find(item => item.id === selectedItem)?.image} 
                alt={newsEvents.find(item => item.id === selectedItem)?.title} 
                className="w-full h-full object-cover"
              />
              <button 
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-300"
                onClick={() => setSelectedItem(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className={`absolute top-4 left-4 ${
                newsEvents.find(item => item.id === selectedItem)?.category.toLowerCase() === 'news' 
                  ? 'bg-blue-700' 
                  : 'bg-green-600'
              } text-white px-3 py-1 rounded-lg`}>
                {newsEvents.find(item => item.id === selectedItem)?.category}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {newsEvents.find(item => item.id === selectedItem)?.date}
              </div>
              
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                {newsEvents.find(item => item.id === selectedItem)?.title}
              </h3>
              
              <p className="text-gray-700 mb-6 whitespace-pre-line">
                {newsEvents.find(item => item.id === selectedItem)?.content}
              </p>
              
              <div className="flex justify-end">
                <button 
                  className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  onClick={() => setSelectedItem(null)}
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

export default NewsEventsSection;