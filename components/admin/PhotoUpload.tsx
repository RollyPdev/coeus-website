"use client";

import { useState, useRef } from "react";

interface PhotoUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  className?: string;
}

export default function PhotoUpload({ currentImage, onImageChange, className = "" }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch('/api/news-events/upload-photo', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        onImageChange(result.url);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Photo *
      </label>
      
      <div className="space-y-3">
        {currentImage && (
          <div className="relative">
            <img
              src={currentImage}
              alt="Current"
              className="h-32 w-32 object-cover rounded border"
            />
          </div>
        )}
        
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={uploading}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : currentImage ? 'Change Photo' : 'Upload Photo'}
          </button>
        </div>
        
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        
        <p className="text-xs text-gray-500">
          Max file size: 5MB. Supported formats: JPG, PNG, GIF
        </p>
      </div>
    </div>
  );
}