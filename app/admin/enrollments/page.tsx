"use client";

import { useState, useEffect } from 'react';

interface Enrollment {
  id: string;
  enrollmentId: string;
  reviewType: string;
  status: 'PENDING' | 'VERIFIED' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    middleInitial?: string;
    email: string;
    contactNumber: string;
    address: string;
    region?: string;
    province?: string;
    city?: string;
    barangay?: string;
    zipCode?: string;
    guardianFirstName: string;
    guardianLastName: string;
    guardianContact: string;
    guardianAddress: string;
    schoolName?: string;
    course?: string;
    yearGraduated?: string;
    gender?: string;
    age?: number;
    birthPlace?: string;
    relationship?: string;
  };
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchEnrollments();
  }, [statusFilter]);

  useEffect(() => {
    fetchEnrollments();
  }, [pagination.page]);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timeout = setTimeout(() => {
      fetchEnrollments();
    }, 300);
    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchTerm]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });
      
      const response = await fetch(`/api/admin/enrollments?${params}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Enrollment data:', data);
        setEnrollments(data.enrollments || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Remove client-side filtering since we're now doing server-side filtering
  const filteredEnrollments = enrollments;

  const updateEnrollmentStatus = async (id: string, newStatus: Enrollment['status']) => {
    try {
      setUpdating(id);
      const response = await fetch('/api/admin/enrollments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.deleted) {
          setEnrollments(prev => prev.filter(enrollment => enrollment.id !== id));
        } else {
          setEnrollments(prev => prev.map(enrollment => 
            enrollment.id === id ? { ...enrollment, status: newStatus } : enrollment
          ));
        }
      }
    } catch (error) {
      console.error('Error updating enrollment:', error);
    } finally {
      setUpdating(null);
    }
  };

  const viewEnrollmentDetails = (enrollment: Enrollment) => {
    console.log('Selected enrollment:', enrollment);
    setSelectedEnrollment(enrollment);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Enrollment Management
              </h1>
              <p className="text-slate-600 text-lg">Manage student enrollments and track their progress</p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {enrollments.filter(e => e.status === 'COMPLETED').length} Completed
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {enrollments.filter(e => e.status === 'VERIFIED').length} Verified
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  {enrollments.filter(e => e.status === 'PENDING').length} Pending
                </span>
              </div>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 lg:min-w-[400px]">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-sm transition-all"
                />
                <svg className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filtering
                }}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-sm text-sm min-w-[140px] transition-all"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Pending Review</h3>
                </div>
                <p className="text-3xl font-bold text-slate-800">{enrollments.filter(e => e.status === 'PENDING').length}</p>
                <p className="text-sm text-slate-500 mt-1">Awaiting verification</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-4 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Verified</h3>
                </div>
                <p className="text-3xl font-bold text-slate-800">{enrollments.filter(e => e.status === 'VERIFIED').length}</p>
                <p className="text-sm text-slate-500 mt-1">Ready to start</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Completed</h3>
                </div>
                <p className="text-3xl font-bold text-slate-800">{enrollments.filter(e => e.status === 'COMPLETED').length}</p>
                <p className="text-sm text-slate-500 mt-1">Successfully enrolled</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollments Table */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Enrollment Applications</h2>
                <p className="text-slate-600 mt-1">Manage and track student enrollment applications</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Total: {pagination.total}</span>
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                <span>Showing {filteredEnrollments.length} of {pagination.total} results</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-100 to-blue-100">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Student Information</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Enrollment Details</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Program</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Date Applied</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-slate-200/50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200"></div>
                          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0"></div>
                        </div>
                        <p className="text-slate-600 mt-4 font-medium">Loading enrollments...</p>
                        <p className="text-slate-400 text-sm">Please wait while we fetch the data</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="bg-gradient-to-br from-slate-100 to-blue-100 rounded-2xl p-6 mb-6">
                          <svg className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No enrollments found</h3>
                        <p className="text-slate-500 max-w-md">No enrollment applications match your current search criteria. Try adjusting your filters or search terms.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEnrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-white/80 transition-all duration-200 group">
                      <td className="px-8 py-6">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              {enrollment.student?.firstName?.[0] || 'N'}{enrollment.student?.lastName?.[0] || 'A'}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-slate-800">{enrollment.student?.firstName} {enrollment.student?.lastName}</div>
                            <div className="text-sm text-slate-500">{enrollment.student?.email}</div>
                            <div className="text-xs text-slate-400">{enrollment.student?.contactNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm font-mono text-slate-800 bg-slate-100 px-2 py-1 rounded-lg inline-block">
                          {enrollment.id.slice(-8)}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Enrollment ID</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm font-semibold text-slate-800">{enrollment.reviewType}</div>
                        <div className="text-xs text-slate-500">Review Program</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm font-medium text-slate-800">
                          {new Date(enrollment.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(enrollment.createdAt).toLocaleDateString('en-US', { weekday: 'long' })}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                          enrollment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                          enrollment.status === 'VERIFIED' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          enrollment.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border border-green-200' :
                          'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            enrollment.status === 'PENDING' ? 'bg-yellow-500' :
                            enrollment.status === 'VERIFIED' ? 'bg-blue-500' :
                            enrollment.status === 'COMPLETED' ? 'bg-green-500' :
                            'bg-red-500'
                          }`}></span>
                          {enrollment.status.charAt(0) + enrollment.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => viewEnrollmentDetails(enrollment)}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            View Details
                          </button>
                          {enrollment.status === 'PENDING' && (
                            <button 
                              onClick={() => updateEnrollmentStatus(enrollment.id, 'VERIFIED')}
                              disabled={updating === enrollment.id}
                              className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updating === enrollment.id ? 'Processing...' : 'Approve'}
                            </button>
                          )}
                          {enrollment.status === 'VERIFIED' && (
                            <button 
                              onClick={() => updateEnrollmentStatus(enrollment.id, 'COMPLETED')}
                              disabled={updating === enrollment.id}
                              className="bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updating === enrollment.id ? 'Processing...' : 'Complete'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-8 py-6 border-t border-slate-200/50 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                    className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            pagination.page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-600 bg-white border border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Modal */}
        {showDetailsModal && selectedEnrollment && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-xl border-4 border-white/30">
                      {selectedEnrollment.student?.firstName?.[0]}{selectedEnrollment.student?.lastName?.[0]}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {selectedEnrollment.student?.firstName} {selectedEnrollment.student?.lastName}
                      </h2>
                      <p className="text-blue-100 font-medium">{selectedEnrollment.id}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowDetailsModal(false)}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Full Name:</span>
                        <span className="text-slate-900 font-semibold">{selectedEnrollment.student?.firstName} {selectedEnrollment.student?.middleInitial} {selectedEnrollment.student?.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Email:</span>
                        <span className="text-slate-900">{selectedEnrollment.student?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Contact:</span>
                        <span className="text-slate-900">{selectedEnrollment.student?.contactNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Gender:</span>
                        <span className="text-slate-900">{selectedEnrollment.student?.gender || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Age:</span>
                        <span className="text-slate-900">{selectedEnrollment.student?.age || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Address Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Address:</span>
                        <span className="text-slate-900 text-right">{selectedEnrollment.student?.address || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Barangay:</span>
                        <span className="text-slate-900">{selectedEnrollment.student?.barangay || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">City:</span>
                        <span className="text-slate-900">{selectedEnrollment.student?.city || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Province:</span>
                        <span className="text-slate-900">{selectedEnrollment.student?.province || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Region:</span>
                        <span className="text-slate-900">{selectedEnrollment.student?.region || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Zip Code:</span>
                        <span className="text-slate-900">{selectedEnrollment.student?.zipCode || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Guardian Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Guardian Name:</span>
                        <span className="text-slate-900">{selectedEnrollment.student?.guardianFirstName} {selectedEnrollment.student?.guardianLastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Relationship:</span>
                        <span className="text-slate-900">{selectedEnrollment.student?.relationship || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Contact:</span>
                        <span className="text-slate-900">{selectedEnrollment.student?.guardianContact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Address:</span>
                        <span className="text-slate-900 text-right">{selectedEnrollment.student?.guardianAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Educational Background</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">School:</span>
                        <span className="text-slate-900 text-right">{selectedEnrollment.student?.schoolName || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Course:</span>
                        <span className="text-slate-900">{selectedEnrollment.student?.course || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Year Graduated:</span>
                        <span className="text-slate-900">{selectedEnrollment.student?.yearGraduated || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Program:</span>
                        <span className="text-slate-900">{selectedEnrollment.reviewType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Status:</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          selectedEnrollment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          selectedEnrollment.status === 'VERIFIED' ? 'bg-blue-100 text-blue-800' :
                          selectedEnrollment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedEnrollment.status.charAt(0) + selectedEnrollment.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <button 
                    onClick={() => setShowDetailsModal(false)}
                    className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                  >
                    Close
                  </button>
                  {selectedEnrollment.status !== 'COMPLETED' && (
                    <>
                      <button 
                        onClick={() => {
                          updateEnrollmentStatus(selectedEnrollment.id, 'VERIFIED');
                          setShowDetailsModal(false);
                        }}
                        disabled={updating === selectedEnrollment.id}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => {
                          updateEnrollmentStatus(selectedEnrollment.id, 'REJECTED');
                          setShowDetailsModal(false);
                        }}
                        disabled={updating === selectedEnrollment.id}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
                      >
                        Not Approved
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}