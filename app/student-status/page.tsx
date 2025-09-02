"use client";

import { useState, useEffect, useCallback } from 'react';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  middleInitial?: string;
  photo?: string;
  photoUrl?: string;
  status: string;
  enrollments: {
    status: string;
    reviewType: string;
  }[];
}

export default function StudentStatusPage() {
  const [searchName, setSearchName] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm.trim().length === 0) {
        setStudents([]);
        return;
      }
      
      if (searchTerm.trim().length < 2) {
        return; // Don't search for single characters
      }
      
      setLoading(true);
      try {
        const response = await fetch(`/api/student-status?name=${encodeURIComponent(searchTerm.trim())}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          setStudents([]);
          return;
        }
        
        const data = await response.json();
        
        if (data.error) {
          console.error('API Error:', data.error);
          setStudents([]);
          return;
        }
        
        setStudents(data.students || []);
      } catch (error) {
        console.error('Search failed:', error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Trigger search when searchName changes
  useEffect(() => {
    debouncedSearch(searchName);
  }, [searchName, debouncedSearch]);

  const getStatusDisplay = (student: Student) => {
    if (student.enrollments.length > 0) {
      const enrollment = student.enrollments[0];
      if (enrollment.status === 'COMPLETED' || student.status === 'active') {
        return { text: 'Enrolled', color: 'bg-green-100 text-green-800' };
      }
      if (enrollment.status === 'VERIFIED' || student.status === 'pending') {
        return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
      }
    }
    return { text: 'Pending', color: 'bg-gray-100 text-gray-800' };
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Check Your Enrollment Status</h1>
          <p className="text-lg text-gray-600">Start typing your name to view your current enrollment status</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Start typing your first or last name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm text-lg"
            />
            {loading && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <svg className="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>

          {searchName.trim().length > 0 && searchName.trim().length < 2 && (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">Type at least 2 characters to search</p>
            </div>
          )}

          {students.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Found {students.length} student{students.length !== 1 ? 's' : ''}
              </h2>
              {students.map((student, index) => {
                const status = getStatusDisplay(student);
                return (
                  <div 
                    key={index} 
                    onClick={() => handleStudentClick(student)}
                    className="bg-white/70 backdrop-blur-sm rounded-xl p-6 flex items-center space-x-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  >
                    <div className="flex-shrink-0 relative">
                      <img 
                        src={`/api/admin/students/${student.id}/photo?t=${Date.now()}`} 
                        alt={`${student.firstName} ${student.lastName}`}
                        className="h-20 w-20 rounded-full object-cover border-4 border-blue-200 shadow-lg group-hover:border-blue-300 transition-colors"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-blue-200 shadow-lg hidden group-hover:border-blue-300 transition-colors">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <div className={`w-4 h-4 rounded-full ${
                          status.text === 'Enrolled' ? 'bg-green-500' :
                          status.text === 'Pending' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 uppercase group-hover:text-blue-700 transition-colors">
                        {student.firstName} {student.middleInitial} {student.lastName}
                      </h3>
                      {student.enrollments.length > 0 && (
                        <p className="text-gray-600 font-medium mt-1">{student.enrollments[0].reviewType}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">Click to view details</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full shadow-md ${status.color}`}>
                        {status.text}
                      </span>
                      <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {searchName.trim().length >= 2 && students.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-500">No students found with the name "{searchName}"</p>
              <p className="text-sm text-gray-400 mt-2">Try searching with just your first name or last name</p>
            </div>
          )}

          {searchName.trim().length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start your search</h3>
              <p className="text-gray-500">Enter your name in the search box above to find your enrollment status</p>
            </div>
          )}
        </div>
      </div>

      {/* Student Details Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src={`/api/admin/students/${selectedStudent.id}/photo?t=${Date.now()}`} 
                    alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                    className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-white hidden">
                    {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white uppercase">
                      {selectedStudent.firstName} {selectedStudent.middleInitial} {selectedStudent.lastName}
                    </h2>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-2 ${
                      getStatusDisplay(selectedStudent).text === 'Enrolled' ? 'bg-green-100 text-green-800' :
                      getStatusDisplay(selectedStudent).text === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusDisplay(selectedStudent).text}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Student Photo Section */}
              <div className="mb-6 text-center">
                <img 
                  src={`/api/admin/students/${selectedStudent.id}/photo?t=${Date.now()}`} 
                  alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                  className="h-48 w-48 rounded-2xl object-cover border-4 border-blue-200 shadow-lg mx-auto"
                  style={{ width: '192px', height: '192px' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="h-48 w-48 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl border-4 border-blue-200 shadow-lg mx-auto hidden" style={{ width: '192px', height: '192px' }}>
                  {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                </div>
                <p className="mt-3 text-sm text-gray-600 font-medium">Student Photo</p>
              </div>

              {/* Enrollment Information */}
              {selectedStudent.enrollments && selectedStudent.enrollments.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Enrollment Information
                  </h3>
                  <div className="space-y-3">
                    {selectedStudent.enrollments.map((enrollment, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-gray-900 text-lg">{enrollment.reviewType}</span>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                              enrollment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              enrollment.status === 'VERIFIED' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {enrollment.status === 'COMPLETED' ? 'Enrolled' :
                               enrollment.status === 'VERIFIED' ? 'Verified' :
                               enrollment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Information */}
              <div className="mt-6 bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Current Status
                </h3>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Overall Status:</span>
                    <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full ${
                      getStatusDisplay(selectedStudent).color
                    }`}>
                      {getStatusDisplay(selectedStudent).text}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}