'use client';

import { useState, useEffect } from 'react';

interface Program {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  features: string;
  duration: number;
  price: number;
  schedule?: string;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean, programId: string, programTitle: string}>({show: false, programId: '', programTitle: ''});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: 'criminology',
    features: '',
    duration: 0,
    price: 0,
    schedule: ''
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/admin/programs');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched programs:', data); // Debug log
        setPrograms(data);
      } else {
        console.error('Failed to fetch programs:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/admin/programs';
      const method = editingProgram ? 'PUT' : 'POST';
      const body = editingProgram ? { id: editingProgram.id, ...formData } : formData;

      // Remove image from form data since it will be uploaded separately
      const { image, ...programData } = body;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(programData)
      });

      if (response.ok) {
        const savedProgram = await response.json();
        
        // Upload photo if one was selected and it's different from the existing one
        if (selectedPhoto && 
            (!editingProgram || selectedPhoto !== editingProgram.image)) {
          await uploadPhoto(editingProgram?.id || savedProgram.id, selectedPhoto);
        }
        
        fetchPrograms();
        resetForm();
      } else {
        const errorData = await response.json();
        console.error('Error saving program:', errorData.error);
        alert('Error saving program: ' + errorData.error);
      }
    } catch (error) {
      console.error('Error saving program:', error);
      alert('Error saving program. Please try again.');
    }
  };

  const uploadPhoto = async (programId: string, photoData: string) => {
    try {
      setUploadingPhoto(true);
      const response = await fetch(`/api/admin/programs/${programId}/photo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: photoData })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Photo upload failed:', error.error);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert('Please select an image smaller than 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setSelectedPhoto(base64String);
        setFormData({...formData, image: base64String});
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setSelectedPhoto(null);
    setFormData({...formData, image: ''});
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      description: program.description,
      image: program.image,
      category: program.category,
      features: program.features,
      duration: program.duration,
      price: program.price,
      schedule: program.schedule || ''
    });
    // Set photo preview if program has an image
    if (program.image && program.image.startsWith('data:')) {
      setSelectedPhoto(program.image);
    } else {
      setSelectedPhoto(null);
    }
    setShowForm(true);
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000); // Auto-hide after 5 seconds
  };

  const handleDeleteClick = (program: Program) => {
    setDeleteConfirm({
      show: true,
      programId: program.id,
      programTitle: program.title
    });
  };

  const confirmDelete = async () => {
    const { programId } = deleteConfirm;
    console.log('Attempting to delete program with ID:', programId); // Debug log
    
    try {
      setDeletingId(programId); // Set loading state for this specific program
      setDeleteConfirm({show: false, programId: '', programTitle: ''}); // Hide confirmation modal
      
      console.log('Sending DELETE request...'); // Debug log
      const response = await fetch('/api/admin/programs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: programId })
      });
      
      console.log('DELETE response status:', response.status); // Debug log
      const data = await response.json();
      console.log('DELETE response data:', data); // Debug log
      
      if (response.ok) {
        // Success - refresh the programs list
        console.log('Delete successful, refreshing programs list...'); // Debug log
        fetchPrograms();
        showNotification('Program deleted successfully!', 'success');
      } else {
        // Handle API errors
        console.error('Delete failed:', data.error);
        showNotification('Failed to delete program: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      showNotification('Error deleting program. Please check your connection and try again.', 'error');
    } finally {
      setDeletingId(null); // Clear loading state
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({show: false, programId: '', programTitle: ''});
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      category: 'criminology',
      features: '',
      duration: 0,
      price: 0,
      schedule: ''
    });
    setEditingProgram(null);
    setSelectedPhoto(null);
    setShowForm(false);
  };

  return (
      <div className="p-6">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            <div className="flex items-center space-x-2">
              {notification.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span>{notification.message}</span>
              <button 
                onClick={() => setNotification(null)}
                className="ml-2 text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Programs Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add Program
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div key={program.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="w-full h-32 mb-4 rounded overflow-hidden bg-gray-100">
                  {program.image ? (
                    <img 
                      src={program.image} 
                      alt={program.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-program.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{program.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{program.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  <p>Category: {program.category}</p>
                  <p>Duration: {program.duration} weeks</p>
                  <p>Price: ₱{program.price.toLocaleString()}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(program)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(program)}
                    disabled={deletingId === program.id}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    {deletingId === program.id ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
              <h2 className="text-xl font-bold mb-4">
                {editingProgram ? 'Edit Program' : 'Add New Program'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Program Image</label>
                  
                  {/* Photo Preview */}
                  {selectedPhoto ? (
                    <div className="mb-4">
                      <div className="relative inline-block">
                        <img
                          src={selectedPhoto}
                          alt="Program preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs mt-1">No image</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* File Upload */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                      id="program-image-upload"
                    />
                    <label
                      htmlFor="program-image-upload"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200 text-sm"
                    >
                      {selectedPhoto ? 'Change Image' : 'Upload Image'}
                    </label>
                    {uploadingPhoto && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Uploading...</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: JPG, PNG, GIF. Max size: 2MB.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="criminology">Criminology</option>
                    <option value="nursing">Nursing</option>
                    <option value="cpd">CPD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Features (comma-separated)</label>
                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration (weeks)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (₱)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Schedule (optional)</label>
                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingPhoto}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingPhoto ? 'Saving...' : (editingProgram ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Delete Program</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>"{deleteConfirm.programTitle}"</strong>? This will permanently remove the program and all associated data.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete Program
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
