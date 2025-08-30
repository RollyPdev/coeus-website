"use client";

import { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
}

export default function PublicAttendancePage() {
  const [method, setMethod] = useState<'qr' | 'search'>('qr');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [qrCode, setQrCode] = useState('');

  // Review center coordinates - 11°34'27.2"N 122°44'41.9"E
  const REVIEW_CENTER_LAT = 11.574222;
  const REVIEW_CENTER_LNG = 122.744972;
  const ALLOWED_RADIUS = process.env.NODE_ENV === 'development' ? 50000 : 1000; // 50km for dev, 1km for prod
  const BYPASS_LOCATION = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_BYPASS_LOCATION === 'true';

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLocationAllowed(true);
          
          // Check if user is within allowed radius
          const distance = calculateDistance(
            latitude, longitude,
            REVIEW_CENTER_LAT, REVIEW_CENTER_LNG
          );
          
          if (distance > ALLOWED_RADIUS && !BYPASS_LOCATION) {
            toast.error('You must be within the review center premises to mark attendance');
          }
        },
        (error) => {
          console.error('Location error:', error);
          toast.error('Location access is required for attendance');
          setLocationAllowed(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const isWithinAllowedArea = () => {
    if (BYPASS_LOCATION) return true;
    if (!userLocation) return false;
    
    const distance = calculateDistance(
      userLocation.lat, userLocation.lng,
      REVIEW_CENTER_LAT, REVIEW_CENTER_LNG
    );
    
    return distance <= ALLOWED_RADIUS;
  };

  const searchStudents = async (term: string) => {
    if (term.length < 2) {
      setStudents([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/students/search?q=${encodeURIComponent(term)}`);
      const data = await response.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error('Error searching students:', error);
      toast.error('Failed to search students');
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = async (qrData: string) => {
    try {
      // QR code should contain student ID
      const response = await fetch(`/api/students/search?studentId=${encodeURIComponent(qrData)}`);
      const data = await response.json();
      
      if (data.student) {
        setSelectedStudent(data.student);
      } else {
        toast.error('Invalid QR code or student not found');
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      toast.error('Failed to process QR code');
    }
  };

  const markAttendance = async (student: Student) => {
    if (!isWithinAllowedArea() && !BYPASS_LOCATION) {
      toast.error('You must be within the review center premises to mark attendance');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          location: userLocation,
          method: method
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Attendance marked successfully for ${student.firstName} ${student.lastName}`);
        setSelectedStudent(null);
        setSearchTerm('');
        setStudents([]);
      } else {
        toast.error(data.error || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Attendance</h1>
          <p className="text-gray-600">Mark your attendance for today</p>
        </div>

        {/* Location Status */}
        <div className={`mb-6 p-4 rounded-lg ${locationAllowed && isWithinAllowedArea() 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {locationAllowed && isWithinAllowedArea() ? (
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${locationAllowed && isWithinAllowedArea() 
                ? 'text-green-800' 
                : 'text-red-800'
              }`}>
                {locationAllowed && isWithinAllowedArea() 
                  ? 'Location verified - You can mark attendance' 
                  : 'Location required - Please enable location access and be within review center premises'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Method Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setMethod('qr')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                method === 'qr'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              QR Code
            </button>
            <button
              onClick={() => setMethod('search')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                method === 'search'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Search Name
            </button>
          </div>

          {method === 'qr' ? (
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <p className="text-gray-600">Scan your student QR code</p>
              </div>
              <input
                type="text"
                placeholder="Or enter QR code manually"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {qrCode && (
                <button
                  onClick={() => handleQRScan(qrCode)}
                  className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Process QR Code
                </button>
              )}
            </div>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Search by name or student ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  searchStudents(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              />
              
              {loading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              )}
              
              {students.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex-shrink-0 h-10 w-10">
                        {student.photoUrl ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={student.photoUrl} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {student.firstName[0]}{student.lastName[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{student.studentId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Student */}
        {selectedStudent && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Attendance</h3>
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 h-12 w-12">
                {selectedStudent.photoUrl ? (
                  <img className="h-12 w-12 rounded-full object-cover" src={selectedStudent.photoUrl} alt="" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-700">
                      {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-4">
                <p className="text-lg font-medium text-gray-900">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </p>
                <p className="text-sm text-gray-500">{selectedStudent.studentId}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => markAttendance(selectedStudent)}
                disabled={loading || !isWithinAllowedArea()}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Marking...' : 'Mark Present'}
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}