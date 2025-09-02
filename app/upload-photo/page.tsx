"use client";

import { useState } from 'react';

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

  const searchStudents = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/students/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      
      if (response.ok) {
        setStudents(data.students || []);
        setMessage(data.students?.length ? '' : 'No students found');
      } else {
        setMessage(data.error || 'Search failed');
      }
    } catch (error) {
      setMessage('Search failed');
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Upload Your Photo</h1>
          
          {/* Search Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">Search for your name or student ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter your name or student ID"
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && searchStudents()}
              />
              <button
                onClick={searchStudents}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Students List */}
          {students.length > 0 && (
            <div className="mb-8">
              <h3 className="font-medium mb-4">Select your profile:</h3>
              <div className="space-y-2">
                {students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedStudent?.id === student.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{student.firstName} {student.lastName}</p>
                        <p className="text-sm text-gray-600">ID: {student.studentId}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                      {student.photo && (
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                          <img
                            src={student.photo}
                            alt="Current photo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photo Upload Section */}
          {selectedStudent && (
            <div className="mb-8">
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
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
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
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload Photo'}
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