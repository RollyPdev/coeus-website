"use client";
import React, { useState, useEffect } from 'react';

interface Lecturer {
  id: string;
  name: string;
  photo: string;
  position: string;
  credentials: string;
  bio: string;
  specialization: string;
  category: string;
  subjects: string;
}

const ReviewLecturersSection = () => {
  const [activeTab, setActiveTab] = useState('criminology');
  const [selectedLecturer, setSelectedLecturer] = useState<number | null>(null);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const response = await fetch('/api/lecturers');
        if (response.ok) {
          const data = await response.json();
          setLecturers(data);
        }
      } catch (error) {
        console.error('Error fetching lecturers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLecturers();
  }, []);
  
  const activeLecturers = lecturers.filter(lecturer => lecturer.category === activeTab);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white" id="lecturers">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded-lg w-80 mx-auto mb-4 animate-pulse"></div>
            <div className="w-24 h-1 bg-gray-200 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          
          {/* Category Tabs Skeleton */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-md shadow-sm">
              <div className="h-12 w-32 bg-gray-200 rounded-l-lg animate-pulse"></div>
              <div className="h-12 w-24 bg-gray-200 animate-pulse"></div>
              <div className="h-12 w-32 bg-gray-200 rounded-r-lg animate-pulse"></div>
            </div>
          </div>
          
          {/* Lecturers Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="h-64 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-3 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-3 animate-pulse"></div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-14 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white" id="lecturers">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Our Expert Lecturers</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Learn from our team of highly qualified and experienced lecturers who are experts in their respective fields.
          </p>
        </div>
        
        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setActiveTab('criminology')}
              className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                activeTab === 'criminology' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200`}
            >
              Criminology
            </button>
            <button
              onClick={() => setActiveTab('nursing')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'nursing' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-200`}
            >
              Nursing
            </button>
            <button
              onClick={() => setActiveTab('cpd')}
              className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                activeTab === 'cpd' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200`}
            >
              CPD Speakers
            </button>
          </div>
        </div>
        
        {/* Lecturers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {activeLecturers.map((lecturer, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => setSelectedLecturer(idx)}
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
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-3">{lecturer.credentials}</p>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subjects</h4>
                  <div className="flex flex-wrap gap-2">
                    {lecturer.subjects.split(',').map((subject, i) => (
                      <span 
                        key={i} 
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {subject.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="mt-12 text-center">
          <a 
            href={`/${activeTab}-lecturers`}
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            View All {activeTab === 'criminology' ? 'Criminology' : activeTab === 'nursing' ? 'Nursing' : 'CPD'} Lecturers
          </a>
        </div>
      </div>
      
      {/* Modal for lecturer details */}
      {selectedLecturer !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedLecturer(null)}
        >
          <div 
            className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 bg-blue-600">
              <img 
                src={activeLecturers[selectedLecturer].photo} 
                alt={activeLecturers[selectedLecturer].name} 
                className="w-full h-full object-cover opacity-80" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-blue-900/30"></div>
              <button 
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-300"
                onClick={() => setSelectedLecturer(null)}
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
                  <img 
                    src={activeLecturers[selectedLecturer].photo} 
                    alt={activeLecturers[selectedLecturer].name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-20 pb-8 px-6">
              <h3 className="text-2xl font-bold text-center mb-2">{activeLecturers[selectedLecturer].name}</h3>
              <p className="text-center text-blue-700 font-medium mb-4">{activeLecturers[selectedLecturer].position}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Credentials</h4>
                  <p className="text-gray-800">{activeLecturers[selectedLecturer].credentials}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Subjects</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeLecturers[selectedLecturer].subjects.split(',').map((subject, i) => (
                      <span 
                        key={i} 
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {subject.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <button 
                  className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full transition-colors"
                  onClick={() => setSelectedLecturer(null)}
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

export default ReviewLecturersSection;