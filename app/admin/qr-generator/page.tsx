"use client";

import { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  photo?: string;
}

export default function QRGeneratorPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/students');
      const data = await response.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = (student: Student) => {
    // Using QR Server API for QR code generation
    const qrData = student.studentId;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
    setQrCodeUrl(qrUrl);
    setSelectedStudent(student);
  };

  const downloadQRCode = async () => {
    if (!qrCodeUrl || !selectedStudent) return;

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedStudent.studentId}_QR.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('QR code downloaded successfully');
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  const printQRCode = () => {
    if (!qrCodeUrl || !selectedStudent) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${selectedStudent.firstName} ${selectedStudent.lastName}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px; 
              }
              .qr-container { 
                border: 2px solid #000; 
                padding: 20px; 
                display: inline-block; 
                margin: 20px;
              }
              .student-info { 
                margin-bottom: 20px; 
              }
              .student-name { 
                font-size: 18px; 
                font-weight: bold; 
                margin-bottom: 5px; 
              }
              .student-id { 
                font-size: 16px; 
                color: #666; 
              }
              img { 
                display: block; 
                margin: 0 auto; 
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="student-info">
                <div class="student-name">${selectedStudent.firstName} ${selectedStudent.lastName}</div>
                <div class="student-id">ID: ${selectedStudent.studentId}</div>
              </div>
              <img src="${qrCodeUrl}" alt="QR Code" />
              <p>Scan this QR code for attendance</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">QR Code Generator</h1>
          <p className="mt-2 text-sm text-gray-600">
            Generate QR codes for student attendance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Student List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Select Student</h2>
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading students...</span>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => generateQRCode(student)}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedStudent?.id === student.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex-shrink-0 h-10 w-10">
                        {student.photo ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={student.photo} alt="" />
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
                  
                  {filteredStudents.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                      No students found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* QR Code Display */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">QR Code</h2>
            </div>

            <div className="p-6">
              {selectedStudent && qrCodeUrl ? (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center mb-4">
                      <div className="flex-shrink-0 h-12 w-12">
                        {selectedStudent.photo ? (
                          <img className="h-12 w-12 rounded-full object-cover" src={selectedStudent.photo} alt="" />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-lg font-medium text-gray-700">
                              {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 text-left">
                        <p className="text-lg font-medium text-gray-900">
                          {selectedStudent.firstName} {selectedStudent.lastName}
                        </p>
                        <p className="text-sm text-gray-500">ID: {selectedStudent.studentId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="mx-auto mb-4"
                      style={{ maxWidth: '300px', height: 'auto' }}
                    />
                    <p className="text-sm text-gray-600">
                      Scan this QR code for attendance
                    </p>
                  </div>

                  <div className="flex space-x-4 justify-center">
                    <button
                      onClick={downloadQRCode}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download
                    </button>
                    <button
                      onClick={printQRCode}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p className="text-gray-500">Select a student to generate QR code</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}