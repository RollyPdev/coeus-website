"use client";

import { useState, useEffect } from 'react';

interface GoodMoralCertificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  purpose: string;
  issuedDate: string;
  validUntil: string;
  status: 'active' | 'expired' | 'revoked';
  issuedBy: string;
  remarks?: string;
  student: {
    firstName: string;
    lastName: string;
    studentId: string;
  };
}

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  enrollments?: {
    reviewType: string;
  }[];
}

export default function GoodMoralPage() {
  const [certificates, setCertificates] = useState<GoodMoralCertificate[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  useEffect(() => {
    fetchCertificates();
    fetchStudents();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/admin/good-moral');
      if (response.ok) {
        const data = await response.json();
        setCertificates(data);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/admin/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const handleIssueCertificate = async (purpose: string, remarks?: string) => {
    if (!selectedStudent) return;
    
    setIssuing(true);
    try {
      const response = await fetch('/api/admin/good-moral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          purpose,
          remarks,
          issuedBy: 'Admin'
        })
      });
      
      if (response.ok) {
        await fetchCertificates();
        setShowIssueModal(false);
        setSelectedStudent(null);
        setStudentSearch('');
      }
    } catch (error) {
      console.error('Error issuing certificate:', error);
    } finally {
      setIssuing(false);
    }
  };

  const handleRevokeCertificate = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this certificate?')) return;
    
    try {
      const response = await fetch('/api/admin/good-moral', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'revoked' })
      });
      
      if (response.ok) {
        await fetchCertificates();
      }
    } catch (error) {
      console.error('Error revoking certificate:', error);
    }
  };

  const handlePrintCertificate = (cert: GoodMoralCertificate) => {
    window.open(`/api/admin/good-moral/print/${cert.id}`, '_blank');
  };

  const handleDownloadCertificate = (cert: GoodMoralCertificate) => {
    window.open(`/api/admin/good-moral/download/${cert.id}`, '_blank');
  };

  const filteredStudents = Array.isArray(students) ? students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.studentId.toLowerCase().includes(studentSearch.toLowerCase())
  ) : [];

  const filteredCertificates = certificates.filter(cert =>
    `${cert.student.firstName} ${cert.student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Multiple Logo Watermarks */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 transform rotate-12 opacity-5">
          <img src="/logo.png" alt="" className="w-32 h-32" />
        </div>
        <div className="absolute top-40 right-32 transform -rotate-12 opacity-5">
          <img src="/logo.png" alt="" className="w-28 h-28" />
        </div>
        <div className="absolute top-80 left-1/4 transform rotate-45 opacity-5">
          <img src="/logo.png" alt="" className="w-36 h-36" />
        </div>
        <div className="absolute bottom-40 right-20 transform -rotate-45 opacity-5">
          <img src="/logo.png" alt="" className="w-30 h-30" />
        </div>
        <div className="absolute bottom-20 left-40 transform rotate-12 opacity-5">
          <img src="/logo.png" alt="" className="w-32 h-32" />
        </div>
        <div className="absolute top-1/2 right-1/4 transform -rotate-12 opacity-5">
          <img src="/logo.png" alt="" className="w-28 h-28" />
        </div>
        <div className="absolute top-60 left-1/2 transform rotate-45 opacity-5">
          <img src="/logo.png" alt="" className="w-34 h-34" />
        </div>
        <div className="absolute bottom-60 left-1/3 transform -rotate-45 opacity-5">
          <img src="/logo.png" alt="" className="w-30 h-30" />
        </div>
      </div>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10 relative">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Good Moral Certificate Management</h1>
              <p className="text-gray-600 mt-1">Issue and manage good moral certificates for students</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl text-sm font-medium text-gray-700 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-lg hover:shadow-xl transition-all duration-300">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Report
              </button>
              <button 
                onClick={() => setShowIssueModal(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 border border-transparent rounded-xl text-sm font-medium text-white hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Issue Certificate
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Certificates</p>
                <p className="text-3xl font-bold text-gray-900">{certificates.length}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 rounded-full mr-2 bg-blue-500"></div>
                  <span className="text-xs font-medium text-blue-600">All issued</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Certificates</p>
                <p className="text-3xl font-bold text-gray-900">{certificates.filter(c => c.status === 'active').length}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
                  <span className="text-xs font-medium text-green-600">Currently valid</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Expired</p>
                <p className="text-3xl font-bold text-gray-900">{certificates.filter(c => c.status === 'expired').length}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 rounded-full mr-2 bg-amber-500"></div>
                  <span className="text-xs font-medium text-amber-600">Need renewal</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Revoked</p>
                <p className="text-3xl font-bold text-gray-900">{certificates.filter(c => c.status === 'revoked').length}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 rounded-full mr-2 bg-red-500"></div>
                  <span className="text-xs font-medium text-red-600">Cancelled</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Certificate Management Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          {/* Table Header with Advanced Filters */}
          <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Certificate Records</h2>
                <p className="text-sm text-gray-600 mt-1">Manage and track all issued certificates</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search certificates, students, or numbers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 sm:text-sm"
                  />
                </div>
                
                {/* Status Filter */}
                <select className="px-4 py-2.5 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="revoked">Revoked</option>
                </select>
                
                {/* Date Filter */}
                <input
                  type="date"
                  className="px-4 py-2.5 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Certificate Details</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Student Information
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Purpose & Validity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status & Dates
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
                        <p className="text-gray-500 text-sm">Loading certificates...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredCertificates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No certificates found</h3>
                        <p className="text-gray-500 mb-4">Get started by issuing your first certificate</p>
                        <button 
                          onClick={() => setShowIssueModal(true)}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200"
                        >
                          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Issue Certificate
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCertificates.map((cert, index) => (
                    <tr key={cert.id} className="hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-200 group">
                      {/* Certificate Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                              </svg>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                              #{cert.certificateNumber}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Issued by {cert.issuedBy}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Student Information */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">
                                {cert.student.firstName[0]}{cert.student.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {cert.student.firstName} {cert.student.lastName}
                            </div>
                            <div className="text-xs text-gray-500 font-mono">
                              {cert.student.studentId}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Purpose & Validity */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {cert.purpose}
                          </div>
                          <div className="text-xs text-gray-500">
                            Valid until: {new Date(cert.validUntil).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          {cert.remarks && (
                            <div className="text-xs text-gray-400 mt-1 italic">
                              {cert.remarks}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status & Dates */}
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            cert.status === 'active' ? 'bg-green-100 text-green-800 border border-green-200' :
                            cert.status === 'expired' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              cert.status === 'active' ? 'bg-green-400' :
                              cert.status === 'expired' ? 'bg-amber-400' :
                              'bg-red-400'
                            }`}></div>
                            {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                          </span>
                          <div className="text-xs text-gray-500">
                            Issued: {new Date(cert.issuedDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </td>

                      {/* Enhanced Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          {/* View/Preview */}
                          <button 
                            onClick={() => handlePrintCertificate(cert)}
                            className="inline-flex items-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                            title="Preview Certificate"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          
                          {/* Download */}
                          <button 
                            onClick={() => handleDownloadCertificate(cert)}
                            className="inline-flex items-center p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200"
                            title="Download PDF"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                          
                          {/* Print */}
                          <button 
                            onClick={() => window.print()}
                            className="inline-flex items-center p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-all duration-200"
                            title="Print Certificate"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                          </button>
                          
                          {/* Revoke (only for active certificates) */}
                          {cert.status === 'active' && (
                            <button 
                              onClick={() => handleRevokeCertificate(cert.id)}
                              className="inline-flex items-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Revoke Certificate"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                              </svg>
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
          
          {/* Table Footer with Pagination */}
          {filteredCertificates.length > 0 && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCertificates.length}</span> of{' '}
                  <span className="font-medium">{certificates.length}</span> certificates
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-white transition-colors">
                    Previous
                  </button>
                  <button className="px-3 py-1 text-sm bg-amber-600 text-white rounded-lg">
                    1
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-white transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Issue Certificate Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Issue Good Moral Certificate
              </h3>
              <button
                onClick={() => setShowIssueModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleIssueCertificate(
                formData.get('purpose') as string,
                formData.get('remarks') as string || undefined
              );
            }}>
              {/* Student Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
                <div className="relative">
                  <input
                    type="text"
                    value={selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName} (${selectedStudent.studentId})` : studentSearch}
                    onChange={(e) => {
                      setStudentSearch(e.target.value);
                      setSelectedStudent(null);
                      setShowStudentDropdown(true);
                    }}
                    onFocus={() => setShowStudentDropdown(true)}
                    placeholder="Search for a student..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/70 backdrop-blur-sm"
                    required
                  />
                  {showStudentDropdown && studentSearch && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <button
                            key={student.id}
                            type="button"
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowStudentDropdown(false);
                              setStudentSearch('');
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{student.firstName} {student.lastName}</div>
                            <div className="text-sm text-gray-500">{student.studentId} • {student.email}</div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">No students found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Program */}
              {selectedStudent && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review Program</label>
                  <input
                    type="text"
                    value={selectedStudent.enrollments?.[0]?.reviewType || 'N/A'}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                    placeholder="Student's review program will appear here"
                  />
                </div>
              )}

              {/* Purpose */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                <select
                  name="purpose"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/70 backdrop-blur-sm"
                >
                  <option value="">Select purpose</option>
                  <option value="For Board Exam Purposes">For Board Exam Purposes</option>
                  <option value="Employment">Employment</option>
                  <option value="School Transfer">School Transfer</option>
                  <option value="Scholarship Application">Scholarship Application</option>
                  <option value="College Application">College Application</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Remarks */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Remarks (Optional)</label>
                <textarea
                  name="remarks"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/70 backdrop-blur-sm resize-none"
                  placeholder="Additional notes or remarks..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowIssueModal(false);
                    setSelectedStudent(null);
                    setStudentSearch('');
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedStudent || issuing}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
                >
                  {issuing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Issuing...
                    </>
                  ) : (
                    'Issue Certificate'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}