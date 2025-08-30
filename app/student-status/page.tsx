"use client";

import { useState } from 'react';

interface Student {
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

  const handleSearch = async () => {
    const trimmedName = searchName.trim();
    if (trimmedName.length === 0) {
      alert('Please enter a name to search');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Searching for:', trimmedName);
      const response = await fetch(`/api/student-status?name=${encodeURIComponent(trimmedName)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      console.log('Students found:', data.students?.length || 0);
      
      if (data.error) {
        console.error('API Error:', data.error);
        alert('Search failed: ' + data.error);
        return;
      }
      
      setStudents(data.students || []);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Check Your Enrollment Status</h1>
          <p className="text-lg text-gray-600">Search your name to view your current enrollment status</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter your first or last name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading || searchName.trim().length === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {students.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Results</h2>
              {students.map((student, index) => {
                const status = getStatusDisplay(student);
                return (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {(student.photoUrl || student.photo) ? (
                        <img
                          src={student.photoUrl || student.photo}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {student.firstName} {student.middleInitial} {student.lastName}
                      </h3>
                      {student.enrollments.length > 0 && (
                        <p className="text-gray-600">{student.enrollments[0].reviewType}</p>
                      )}
                    </div>
                    <div>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Debug Info */}
          {searchName.trim().length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">
                Debug: Searched for "{searchName}" - Found {students.length} students
              </p>
            </div>
          )}

          {searchName.trim().length > 0 && students.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">No students found with that name.</p>
              <p className="text-xs text-gray-400 mt-2">Try searching with just your first name or last name</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}