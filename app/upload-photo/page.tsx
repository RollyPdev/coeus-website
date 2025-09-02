"use client";

import { useState, useEffect, useRef } from 'react';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  photo?: string;
}

export default function UploadPhotoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchStudents = async (query: string) => {
    if (!query.trim()) {
      setStudents([]);
      setShowDropdown(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`/api/students/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (response.ok) {
        setStudents(data.students || []);
        setShowDropdown(true);
        setMessage(data.students?.length ? '' : 'No students found');
      } else {
        setMessage(data.error || 'Search failed');
        setShowDropdown(false);
      }
    } catch (error) {
      setMessage('Search failed');
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.length >= 2) {
      searchStudents(value);
    } else {
      setStudents([]);
      setShowDropdown(false);
    }
  };

  const selectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSearchTerm(`${student.firstName} ${student.lastName}`);
    setShowDropdown(false);
    setStudents([]);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Photo must be less than 5MB');
        return;
      }
      
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      setMessage('');
    }
  };

  const uploadPhoto = async () => {
    if (!selectedStudent || !photo) return;
    
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        
        const response = await fetch('/api/students/upload-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: selectedStudent.id,
            photo: base64
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setMessage('Photo uploaded successfully!');
          setSelectedStudent({ ...selectedStudent, photo: base64 });
          setPhoto(null);
          setPreview(null);
        } else {
          setMessage(data.error || 'Upload failed');
        }
        setUploading(false);
      };
      reader.readAsDataURL(photo);
    } catch (error) {
      setMessage('Upload failed');
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-8">
      <div className="max-w-md mx-auto sm:max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Upload Your Photo</h1>
          
          {/* Search Section */}
          <div className="mb-6 sm:mb-8 relative" ref={dropdownRef}>
            <label className="block text-sm font-medium mb-2">Search for your name or student ID</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Type your name or student ID..."
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                autoComplete="off"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
            
            {/* Dropdown */}
            {showDropdown && students.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => selectStudent(student)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {student.photo ? (
                          <img
                            src={student.photo}
                            alt="Student photo"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-sm font-medium">
                              {student.firstName[0]}{student.lastName[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">ID: {student.studentId}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Student */}
          {selectedStudent && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-2">Selected Profile:</h3>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {selectedStudent.photo ? (
                    <img
                      src={selectedStudent.photo}
                      alt="Current photo"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                  <p className="text-sm text-gray-600">ID: {selectedStudent.studentId}</p>
                </div>
              </div>
            </div>
          )}

          {/* Photo Upload Section */}
          {selectedStudent && (
            <div className="mb-6 sm:mb-8">
              <h3 className="font-medium mb-4">Upload your photo</h3>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                
                {preview && (
                  <div className="flex justify-center">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                
                {photo && (
                  <button
                    onClick={uploadPhoto}
                    disabled={uploading}
                    className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium text-base"
                  >
                    {uploading ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      'Upload Photo'
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('successfully') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}