"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  middleInitial?: string;
  photo?: string;
  photoUrl?: string;
  schoolName?: string;
  yearGraduated?: string;
  course?: string;
  status: string;
  enrollments: {
    reviewType: string;
    status: string;
    createdAt: string;
  }[];
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [studentPhotos, setStudentPhotos] = useState<{[key: string]: string}>({});
  const [schoolLogos, setSchoolLogos] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudentPhoto = async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}/photo`);
      if (response.ok) {
        const data = await response.json();
        const photoUrl = data.photoUrl || (data.photo ? 
          data.photo.startsWith('data:image/') ? data.photo : `data:image/jpeg;base64,${data.photo}` 
          : null);
        if (photoUrl) {
          setStudentPhotos(prev => ({ ...prev, [studentId]: photoUrl }));
        }
      }
    } catch (error) {
      console.error('Error fetching student photo:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/students?limit=50');
      const data = await response.json();
      
      if (response.ok && data.students) {
        // Filter only active students for public display
        const activeStudents = data.students.filter((student: Student) => 
          student.status === 'active' || student.status === 'graduated'
        );
        setStudents(activeStudents);
        
        // Fetch photos and school logos for each student
        activeStudents.forEach((student: Student) => {
          fetchStudentPhoto(student.id);
          if (student.schoolName) {
            fetchSchoolLogo(student.schoolName);
          }
        });
      } else {
        throw new Error(data.error || 'Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const getFullName = (student: Student) => {
    const middleInitial = student.middleInitial ? ` ${student.middleInitial}.` : '';
    return `${student.firstName}${middleInitial} ${student.lastName}`;
  };

  const getStudentImage = (student: Student) => {
    // Check cached photos first
    if (studentPhotos[student.id]) {
      return studentPhotos[student.id];
    }
    
    // Use photoUrl if available
    if (student.photoUrl && student.photoUrl.trim() !== '') {
      return student.photoUrl;
    }
    
    return '/default-student.svg';
  };

  const fetchSchoolLogo = async (schoolName: string) => {
    if (!schoolName || schoolLogos[schoolName]) return;
    
    try {
      const response = await fetch(`/api/schools/logo?school=${encodeURIComponent(schoolName)}`);
      const data = await response.json();
      
      if (data.logoUrl) {
        setSchoolLogos(prev => ({ ...prev, [schoolName]: data.logoUrl }));
      }
    } catch (error) {
      console.error('Error fetching school logo:', error);
    }
  };

  // Facebook-style skeleton loading component
  const SkeletonCard = () => (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20 animate-pulse">
      {/* Photo Skeleton */}
      <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="w-full h-full bg-gray-300 relative overflow-hidden">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
        </div>
        {/* Status Badge Skeleton */}
        <div className="absolute top-4 right-4 w-16 h-6 bg-gray-300 rounded-full">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Name Skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 rounded-lg w-3/4 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          </div>
        </div>
        
        {/* Details Skeleton */}
        <div className="space-y-3">
          {/* ID Row */}
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-20 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
          </div>
          
          {/* School Row */}
          <div className="flex items-start space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded mt-0.5 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
            <div className="space-y-1 flex-1">
              <div className="h-4 bg-gray-300 rounded w-16 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-full relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
            </div>
          </div>
          
          {/* Year Row */}
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-24 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
          </div>
          
          {/* Course Row */}
          <div className="flex items-start space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded mt-0.5 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
            <div className="space-y-1 flex-1">
              <div className="h-4 bg-gray-300 rounded w-16 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-4/5 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Programs Section Skeleton */}
        <div className="pt-4 border-t border-gray-200">
          <div className="h-3 bg-gray-300 rounded w-20 mb-2 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          </div>
          <div className="flex flex-wrap gap-1">
            <div className="h-6 bg-gray-300 rounded-full w-20 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
            <div className="h-6 bg-gray-300 rounded-full w-24 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Statistics skeleton component
  const StatsSkeletonCard = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-pulse">
      <div className="text-center">
        <div className="h-10 bg-gray-300 rounded-lg w-16 mx-auto mb-2 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-24 mx-auto relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
        </div>
      </div>
    </div>
  );

  const filteredStudents = students.filter(student => {
    const matchesSearch = getFullName(student).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.schoolName && student.schoolName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => a.lastName.localeCompare(b.lastName));

  if (loading) {
    return (
      <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <main className="pt-20">
          {/* Hero Section Skeleton */}
          <section className="relative py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0), radial-gradient(circle at 75px 75px, white 2px, transparent 0)`,
                backgroundSize: '100px 100px'
              }}></div>
            </div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-4xl mx-auto">
                <div className="h-16 bg-white/20 rounded-lg w-80 mx-auto mb-6 animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </div>
                <div className="w-32 h-1 bg-white/30 mx-auto mb-8 rounded animate-pulse"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-white/20 rounded w-3/4 mx-auto animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  </div>
                  <div className="h-6 bg-white/20 rounded w-2/3 mx-auto animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="h-4 bg-white/15 rounded w-1/2 mx-auto animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  </div>
                  <div className="h-4 bg-white/15 rounded w-3/5 mx-auto animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute top-1/2 right-20 w-16 h-16 bg-indigo-400/30 rounded-full blur-xl animate-pulse"></div>
          </section>

          {/* Statistics Section Skeleton */}
          <section className="py-16 bg-white/70 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <StatsSkeletonCard />
                <StatsSkeletonCard />
                <StatsSkeletonCard />
                <StatsSkeletonCard />
              </div>
            </div>
          </section>

          {/* Search and Filter Section Skeleton */}
          <section className="py-8 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <div className="relative flex-1 max-w-md">
                  <div className="h-12 bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                  </div>
                </div>
                <div className="h-12 w-40 bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Students Grid Skeleton */}
          <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 12 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0), radial-gradient(circle at 75px 75px, white 2px, transparent 0)`,
              backgroundSize: '100px 100px'
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Our Students
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto mb-8"></div>
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                Meet the dedicated individuals who have chosen Coeus Review & Training Specialist, Inc. 
                to achieve their professional dreams and academic excellence.
              </p>
              <p className="text-lg text-blue-200 mt-6 max-w-2xl mx-auto">
                Our students represent the future leaders in their respective fields, equipped with knowledge, 
                skills, and determination to make a positive impact in society.
              </p>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-20 w-16 h-16 bg-indigo-400/30 rounded-full blur-xl"></div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-white/70 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/20">
                <div className="text-4xl font-bold text-blue-600 mb-2">{filteredStudents.length}</div>
                <div className="text-gray-600 font-medium">Total Students</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/20">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {filteredStudents.filter(s => s.status === 'graduated').length}
                </div>
                <div className="text-gray-600 font-medium">Graduates</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/20">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {filteredStudents.filter(s => s.status === 'active').length}
                </div>
                <div className="text-gray-600 font-medium">Active Students</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/20">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {new Set(filteredStudents.map(s => s.schoolName).filter(Boolean)).size}
                </div>
                <div className="text-gray-600 font-medium">Schools</div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search students by name, ID, or school..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                />
                <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
              >
                <option value="all">All Students</option>
                <option value="active">Active</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
          </div>
        </section>

        {/* Students Grid Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {error && (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                  <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Students</h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <button 
                    onClick={fetchStudents}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {!error && filteredStudents.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-lg mx-auto shadow-lg">
                  <svg className="h-16 w-16 text-gray-300 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">No Students Found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
                </div>
              </div>
            )}

            {!error && filteredStudents.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredStudents.map((student) => (
                  <div 
                    key={student.id} 
                    className="group bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 hover:scale-105 border border-white/30 hover:border-blue-200/50"
                  >
                    {/* Student Photo */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                      <img 
                        src={getStudentImage(student)} 
                        alt={getFullName(student)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/default-student.svg';
                        }}
                      />
                      
                      {/* Status Badge */}
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                        student.status === 'graduated' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {student.status === 'graduated' ? 'Graduate' : 'Active'}
                      </div>
                      
                      {/* School Logo - Top Left */}
                      {student.schoolName && schoolLogos[student.schoolName] && (
                        <div className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full p-1 shadow-lg">
                          <img 
                            src={schoolLogos[student.schoolName]} 
                            alt="School Logo"
                            className="w-full h-full object-contain rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Verification Badge - Bottom Left */}
                      {student.status === 'active' && (
                        <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg">
                          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Official Reviewee
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Student Information */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 uppercase text-center">
                        {getFullName(student)}
                      </h3>
                      
                      <div className="space-y-3 text-sm text-gray-600">
                        
                        {student.schoolName && (
                          <div className="flex items-start bg-green-50 rounded-lg p-2 border border-green-100">
                            <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div>
                              <span className="font-medium text-green-700">School:</span>
                              <div className="text-green-800 font-medium leading-tight mt-1 text-center">{student.schoolName}</div>
                            </div>
                          </div>
                        )}
                        
                        {student.yearGraduated && (
                          <div className="flex items-center bg-indigo-50 rounded-lg p-2 border border-indigo-100">
                            <svg className="h-4 w-4 text-indigo-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium text-indigo-700">Graduated:</span>
                            <span className="ml-2 text-indigo-800 font-semibold">{student.yearGraduated}</span>
                          </div>
                        )}
                        
                        {student.course && (
                          <div className="flex items-start bg-purple-50 rounded-lg p-2 border border-purple-100">
                            <svg className="h-4 w-4 text-purple-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
                            </svg>
                            <div>
                              <span className="font-medium text-purple-700">Course:</span>
                              <div className="text-purple-800 font-medium leading-tight mt-1 text-center">{student.course}</div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Programs Enrolled */}
                      {student.enrollments && student.enrollments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="text-xs font-medium text-gray-500 mb-2">Programs:</div>
                          <div className="flex flex-wrap gap-2">
                            {student.enrollments.slice(0, 2).map((enrollment, index) => (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium border border-blue-200"
                              >
                                {enrollment.reviewType.length > 20 
                                  ? enrollment.reviewType.substring(0, 20) + '...' 
                                  : enrollment.reviewType
                                }
                              </span>
                            ))}
                            {student.enrollments.length > 2 && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium border border-gray-200">
                                +{student.enrollments.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Join Our Community of Achievers</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
              Be part of our success story. Enroll now and take the first step towards your professional goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/enroll" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Enroll Now
              </a>
              <a 
                href="/about" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}