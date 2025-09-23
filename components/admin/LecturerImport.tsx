"use client";

import { useState } from 'react';

interface LecturerImportProps {
  onImportComplete: () => void;
  onClose: () => void;
}

export default function LecturerImport({ onImportComplete, onClose }: LecturerImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<any[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setError('');
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      
      const data = lines.slice(1, 6).map(line => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      });
      
      setPreview(data);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/lecturers/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        onImportComplete();
        onClose();
      } else {
        setError(result.error || 'Import failed');
      }
    } catch (error) {
      setError('Import failed. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = [
      ['name', 'position', 'credentials', 'bio', 'specialization', 'category', 'subjects'],
      ['John Doe', 'Professor', 'PhD in Criminology', 'Experienced educator with 10+ years', 'Criminal Law', 'criminology', 'Criminal Law, Ethics'],
      ['Jane Smith', 'Associate Professor', 'MSN, RN', 'Nursing expert with clinical experience', 'Medical Nursing', 'nursing', 'Medical Nursing, Pharmacology']
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lecturer-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Import Lecturers</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Step 1: Download Template</h3>
            <p className="text-gray-600 mb-3">
              Download the CSV template with the required format and sample data.
            </p>
            <button
              onClick={downloadTemplate}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Download Template
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Step 2: Upload CSV File</h3>
            <p className="text-gray-600 mb-3">
              Upload your CSV file with lecturer data. Required columns: name, position, credentials, bio, specialization, category, subjects.
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {preview.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Preview (First 5 rows)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(preview[0]).map(key => (
                        <th key={key} className="px-3 py-2 border-b text-left text-xs font-medium text-gray-500 uppercase">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, index) => (
                      <tr key={index} className="border-b">
                        {Object.values(row).map((value: any, i) => (
                          <td key={i} className="px-3 py-2 text-sm text-gray-900">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!file || importing}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {importing ? 'Importing...' : 'Import Lecturers'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}