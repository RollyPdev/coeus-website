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

const LecturersSection = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const lecturersPerPage = 8;

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

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-blue-50" id="lecturers">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading lecturers...</p>
          </div>
        </div>
      </section>
    );
  }
  
  // Calculate total pages
  const totalPages = Math.ceil(lecturers.length / lecturersPerPage);
  
  // Get current lecturers
  const indexOfLastLecturer = currentPage * lecturersPerPage;
  const indexOfFirstLecturer = indexOfLastLecturer - lecturersPerPage;
  const currentLecturers = lecturers.slice(indexOfFirstLecturer, indexOfLastLecturer);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50" id="lecturers">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Meet Our Expert Lecturers</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">Learn from industry professionals with extensive experience in their respective fields.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentLecturers.map((lecturer, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden bg-blue-100">
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
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{lecturer.bio}</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-medium text-sm">{lecturer.specialization}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{lecturer.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-700 hover:bg-blue-100'}`}
              aria-label="Previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex space-x-1">
              {/* Show limited page numbers with ellipsis for large number of pages */}
              {[...Array(totalPages)].map((_, idx) => {
                const pageNumber = idx + 1;
                
                // Always show first page, last page, current page, and pages around current
                if (
                  pageNumber === 1 || 
                  pageNumber === totalPages || 
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={idx}
                      onClick={() => paginate(pageNumber)}
                      className={`w-8 h-8 rounded-md ${currentPage === pageNumber ? 'bg-blue-700 text-white' : 'text-blue-700 hover:bg-blue-100'}`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                
                // Show ellipsis for breaks in page numbers
                if (
                  (pageNumber === 2 && currentPage > 3) || 
                  (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return <span key={idx} className="px-2">...</span>;
                }
                
                return null;
              })}
            </div>
            
            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-700 hover:bg-blue-100'}`}
              aria-label="Next page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
  {/* Modal removed */}
    </section>
  );
};

export default LecturersSection;