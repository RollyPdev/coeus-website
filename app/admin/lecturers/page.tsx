"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import LecturerStats from "@/components/admin/LecturerStats";
import LecturerImport from "@/components/admin/LecturerImport";

interface Lecturer {
  id: string;
  name: string;
  photo: string;
  position: string;
  category: string;
  specialization: string;
  createdAt: string;
}

export default function LecturersPage() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedLecturers, setSelectedLecturers] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/lecturers");
      
      if (!response.ok) {
        throw new Error("Failed to fetch lecturers");
      }
      
      const data = await response.json();
      setLecturers(data);
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch lecturers");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLecturer = (lecturerId: string) => {
    setSelectedLecturers(prev => 
      prev.includes(lecturerId) 
        ? prev.filter(id => id !== lecturerId)
        : [...prev, lecturerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLecturers.length === filteredLecturers.length) {
      setSelectedLecturers([]);
    } else {
      setSelectedLecturers(filteredLecturers.map(l => l.id));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedLecturers.length} lecturer(s)?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const deletePromises = selectedLecturers.map(id => 
        fetch(`/api/lecturers/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      );

      await Promise.all(deletePromises);
      setSelectedLecturers([]);
      fetchLecturers();
    } catch (error) {
      setError('Failed to delete selected lecturers');
    }
  };

  const exportLecturers = () => {
    const csvContent = [
      ['Name', 'Position', 'Category', 'Specialization', 'Credentials', 'Subjects'],
      ...filteredLecturers.map(l => [
        l.name,
        l.position,
        l.category,
        l.specialization,
        l.credentials || '',
        l.subjects || ''
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lecturers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLecturers = lecturers
    .filter(lecturer => {
      const matchesSearch = lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lecturer.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lecturer.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === "all" || lecturer.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-300 rounded w-28"></div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-300 rounded w-16 ml-auto"></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                    <div className="ml-4">
                      <div className="h-4 bg-gray-300 rounded w-32"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-300 rounded w-36"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-300 rounded w-40"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-2">
                    <div className="h-4 bg-gray-300 rounded w-8"></div>
                    <div className="h-4 bg-gray-300 rounded w-12"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Lecturers</h1>
          <Link
            href="/admin/lecturers/new"
            className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
          >
            Add New Lecturer
          </Link>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Lecturers</h1>
          <Link
            href="/admin/lecturers/new"
            className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
          >
            Add New Lecturer
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Lecturers</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchLecturers}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Lecturers ({filteredLecturers.length})</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImport(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Import
          </button>
          <Link
            href="/admin/lecturers/new"
            className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
          >
            Add New Lecturer
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <LecturerStats />

      {/* Search and Filter Section */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search lecturers by name, position, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="criminology">Criminology</option>
              <option value="nursing">Nursing</option>
              <option value="cpd">CPD</option>
            </select>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as 'name' | 'category' | 'createdAt');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="category-asc">Category A-Z</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
            </select>
            <button
              onClick={exportLecturers}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
          </div>
        </div>
        
        {/* Bulk Actions */}
        {selectedLecturers.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedLecturers.length} lecturer(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedLecturers([])}
                className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {filteredLecturers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || filterCategory !== "all" ? "No lecturers found" : "No lecturers yet"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterCategory !== "all" 
              ? "Try adjusting your search criteria" 
              : "Get started by adding your first lecturer"}
          </p>
          {!searchTerm && filterCategory === "all" && (
            <Link
              href="/admin/lecturers/new"
              className="bg-blue-700 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition-colors inline-block"
            >
              Add First Lecturer
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedLecturers.length === filteredLecturers.length && filteredLecturers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLecturers.map((lecturer) => (
                  <tr key={lecturer.id} className={`hover:bg-gray-50 transition-colors ${
                    selectedLecturers.includes(lecturer.id) ? 'bg-blue-50' : ''
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedLecturers.includes(lecturer.id)}
                        onChange={() => handleSelectLecturer(lecturer.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                            src={lecturer.photo.startsWith('data:') 
                              ? lecturer.photo 
                              : lecturer.photo.startsWith('http') 
                                ? lecturer.photo 
                                : `/api/lecturers/${lecturer.id}/photo?t=${Date.now()}`
                            }
                            alt={lecturer.name}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full items-center justify-center text-white font-bold text-sm border-2 border-gray-200 hidden">
                            {lecturer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {lecturer.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lecturer.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lecturer.category === "criminology"
                            ? "bg-red-100 text-red-800"
                            : lecturer.category === "nursing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {lecturer.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lecturer.specialization}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/lecturers/${lecturer.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/lecturers/${lecturer.id}/delete`}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Import Modal */}
      {showImport && (
        <LecturerImport
          onImportComplete={() => {
            fetchLecturers();
            setShowImport(false);
          }}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}