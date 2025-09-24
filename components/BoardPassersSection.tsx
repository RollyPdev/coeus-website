"use client";
import React, { useState, useEffect } from 'react';

interface BoardPasser {
  id: string;
  name: string;
  photo: string;
  rating: number;
  examDate: string;
  examYear: string;
  program: string;
  category: string;
  batch?: string;
  school: string;
  testimonial?: string;
}

const BoardPassersSection = () => {
  const [activeTab, setActiveTab] = useState('criminology');
  const [selectedPasser, setSelectedPasser] = useState<number | null>(null);
  const [passers, setPassers] = useState<BoardPasser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockPassers: BoardPasser[] = [
      {
        id: '1',
        name: 'Maria Santos',
        photo: '/learning-1.jpg',
        rating: 89.5,
        examDate: 'March',
        examYear: '2024',
        program: 'Criminologist Licensure Examinations',
        category: 'criminology',
        batch: 'Batch 2024-A',
        school: 'University of the Philippines',
        testimonial: 'Coeus Review helped me achieve my dream of becoming a top notcher!'
      },
      {
        id: '2',
        name: 'Juan Dela Cruz',
        photo: '/image-1.jpg',
        rating: 87.2,
        examDate: 'March',
        examYear: '2024',
        program: 'Criminologist Licensure Examinations',
        category: 'criminology',
        batch: 'Batch 2024-A',
        school: 'Ateneo de Manila University'
      },
      {
        id: '3',
        name: 'Ana Reyes',
        photo: '/image-2.jpg',
        rating: 85.8,
        examDate: 'March',
        examYear: '2024',
        program: 'Criminologist Licensure Examinations',
        category: 'criminology',
        batch: 'Batch 2024-A',
        school: 'De La Salle University'
      },
      {
        id: '4',
        name: 'Carlos Martinez',
        photo: '/learning-1.jpg',
        rating: 84.3,
        examDate: 'March',
        examYear: '2024',
        program: 'Criminologist Licensure Examinations',
        category: 'criminology',
        batch: 'Batch 2024-A',
        school: 'University of Santo Tomas'
      },
      {
        id: '5',
        name: 'Sofia Garcia',
        photo: '/image-1.jpg',
        rating: 88.7,
        examDate: 'February',
        examYear: '2024',
        program: 'Registered Nurse Licensure Examinations',
        category: 'nursing',
        batch: 'Batch 2024-B',
        school: 'Far Eastern University'
      },
      {
        id: '6',
        name: 'Miguel Torres',
        photo: '/image-2.jpg',
        rating: 86.9,
        examDate: 'February',
        examYear: '2024',
        program: 'Registered Nurse Licensure Examinations',
        category: 'nursing',
        batch: 'Batch 2024-B',
        school: 'St. Paul University'
      }
    ];
    
    setPassers(mockPassers);
    setLoading(false);
  }, []);
  
  const activePassers = passers.filter(passer => passer.category === activeTab);



  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded-lg w-80 mx-auto mb-4 animate-pulse"></div>
            <div className="w-24 h-1 bg-gray-200 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-md shadow-sm">
              <div className="h-12 w-32 bg-gray-200 rounded-l-lg animate-pulse"></div>
              <div className="h-12 w-24 bg-gray-200 rounded-r-lg animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="h-64 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Board Exam Passers</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Celebrating our students who achieved outstanding results in their professional licensure examinations.
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
              className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                activeTab === 'nursing' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200`}
            >
              Nursing
            </button>
          </div>
        </div>
        
        {/* Passers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {activePassers.map((passer, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => setSelectedPasser(idx)}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={passer.photo} 
                  alt={passer.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-900 to-transparent opacity-70"></div>

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-xl">{passer.name}</h3>
                  <p className="text-yellow-100">Board Passer</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-yellow-600">{passer.rating}%</span>
                  <span className="text-sm text-gray-500">{passer.examDate}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{passer.program}</p>
                {passer.batch && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {passer.batch}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="mt-12 text-center">
          <button className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
            View All {activeTab === 'criminology' ? 'Criminology' : 'Nursing'} Passers
          </button>
        </div>
      </div>
      
      {/* Modal for passer details */}
      {selectedPasser !== null && (
        <div 
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPasser(null)}
        >
          <div 
            className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 bg-yellow-600">
              <img 
                src={activePassers[selectedPasser].photo} 
                alt={activePassers[selectedPasser].name} 
                className="w-full h-full object-cover opacity-80" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-900 to-yellow-900/30"></div>
              <button 
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-300"
                onClick={() => setSelectedPasser(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
                  <img 
                    src={activePassers[selectedPasser].photo} 
                    alt={activePassers[selectedPasser].name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-20 pb-8 px-6">
              <h3 className="text-2xl font-bold text-center mb-2">{activePassers[selectedPasser].name}</h3>
              <p className="text-center text-yellow-700 font-medium mb-4">
                Board Passer - {activePassers[selectedPasser].rating}%
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Exam Details</h4>
                  <p className="text-gray-800">{activePassers[selectedPasser].program}</p>
                  <p className="text-gray-600 text-sm">{activePassers[selectedPasser].examDate} {activePassers[selectedPasser].examYear}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">School</h4>
                  <p className="text-gray-800">{activePassers[selectedPasser].school}</p>
                </div>
                
                {activePassers[selectedPasser].testimonial && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Testimonial</h4>
                    <p className="text-gray-800 italic">"{activePassers[selectedPasser].testimonial}"</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 text-center">
                <button 
                  className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full transition-colors"
                  onClick={() => setSelectedPasser(null)}
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

export default BoardPassersSection;