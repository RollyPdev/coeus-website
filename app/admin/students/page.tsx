"use client";

import { useState, useEffect } from 'react';

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  middleInitial?: string;
  gender: string;
  birthday: string;
  age?: number;
  birthPlace: string;
  contactNumber: string;
  email: string;
  address: string;
  region?: string;
  province?: string;
  city?: string;
  barangay?: string;
  zipCode?: string;
  guardianFirstName: string;
  guardianLastName: string;
  guardianMiddleInitial?: string;
  guardianContact: string;
  guardianAddress: string;
  relationship?: string;
  schoolName?: string;
  course?: string;
  yearGraduated?: string;
  howDidYouHear?: string;
  referredBy?: string;
  photo?: string;
  photoUrl?: string;
  status: string;
  createdAt: string;
  enrollments: {
    enrollmentId: string;
    reviewType: string;
    status: string;
    createdAt: string;
  }[];
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loadingStudentDetails, setLoadingStudentDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Student>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    reviewType: '',
    photo: null as string | null,
    firstName: '',
    lastName: '',
    middleInitial: '',
    gender: '',
    birthday: '',
    age: '',
    birthPlace: '',
    contactNumber: '',
    email: '',
    address: '',
    region: '',
    regionCode: '',
    province: '',
    provinceCode: '',
    city: '',
    cityCode: '',
    barangay: '',
    barangayCode: '',
    zipCode: '',
    course: '',
    schoolName: '',
    yearGraduated: '',
    guardianFirstName: '',
    guardianLastName: '',
    guardianMiddleInitial: '',
    guardianContact: '',
    guardianAddress: '',
    relationship: '',
    referredBy: '',
    howDidYouHear: ''
  });
  const [regions, setRegions] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [municipalities, setMunicipalities] = useState<any[]>([]);
  const [barangays, setBarangays] = useState<any[]>([]);
  const [locationLoading, setLocationLoading] = useState({ regions: false, provinces: false, municipalities: false, barangays: false });
  const [schoolSearch, setSchoolSearch] = useState('');
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [predefinedSchools] = useState([
    'Capiz State University Main Campus - Roxas City',
    'Capiz State University - Burias Campus (Mambusao)',
    'Filamer Christian University (Roxas City)',
    'Hercor College (Roxas City)',
    'St. Anthony College of Roxas City, Inc. (Roxas City)'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/students?limit=100');
        const data = await response.json();
        console.log('API Response:', data);
        if (data.students) {
          setStudents(data.students);
        } else if (data.error) {
          console.error('API Error:', data.error);
          setStudents([]);
        } else {
          setStudents([]);
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      setLocationLoading(prev => ({ ...prev, regions: true }));
      const response = await fetch('https://psgc.cloud/api/regions');
      if (response.ok) {
        const data = await response.json();
        setRegions(data);
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
      setRegions([
        { code: 'R6', name: 'Region VI: Western Visayas' },
        { code: 'NCR', name: 'National Capital Region' }
      ]);
    } finally {
      setLocationLoading(prev => ({ ...prev, regions: false }));
    }
  };

  const fetchProvinces = async (regionCode: string) => {
    try {
      setLocationLoading(prev => ({ ...prev, provinces: true }));
      const response = await fetch(`https://psgc.cloud/api/regions/${regionCode}/provinces`);
      if (response.ok) {
        const data = await response.json();
        setProvinces(data);
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
      if (regionCode === 'R6') {
        setProvinces([{ code: 'PH060400000', name: 'Capiz', regionCode: 'R6' }]);
      }
    } finally {
      setLocationLoading(prev => ({ ...prev, provinces: false }));
    }
  };

  const fetchMunicipalities = async (provinceCode: string) => {
    try {
      setLocationLoading(prev => ({ ...prev, municipalities: true }));
      const response = await fetch(`https://psgc.cloud/api/provinces/${provinceCode}/cities-municipalities`);
      if (response.ok) {
        const data = await response.json();
        setMunicipalities(data);
      }
    } catch (error) {
      console.error('Error fetching municipalities:', error);
      if (provinceCode === 'PH060400000') {
        setMunicipalities([{ code: 'PH060401000', name: 'Roxas City', provinceCode: 'PH060400000' }]);
      }
    } finally {
      setLocationLoading(prev => ({ ...prev, municipalities: false }));
    }
  };

  const fetchBarangays = async (municipalityCode: string) => {
    try {
      setLocationLoading(prev => ({ ...prev, barangays: true }));
      const response = await fetch(`https://psgc.cloud/api/cities-municipalities/${municipalityCode}/barangays`);
      if (response.ok) {
        const data = await response.json();
        setBarangays(data);
      }
    } catch (error) {
      console.error('Error fetching barangays:', error);
      if (municipalityCode === 'PH060401000') {
        setBarangays([{ code: 'PH060401001', name: 'Balijuagan', municipalityCode: 'PH060401000' }]);
      }
    } finally {
      setLocationLoading(prev => ({ ...prev, barangays: false }));
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleDelete = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    setDeletingId(studentId);
    try {
      const response = await fetch(`/api/admin/students?id=${studentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setStudents(students.filter(student => student.id !== studentId));
      } else {
        alert('Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Error deleting student');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let updates: any = { [name]: value };
    
    if (name === 'reviewType') {
      if (value === 'Nursing Review') {
        updates.course = 'Bachelor of Science in Nursing';
      } else if (value === 'Criminologist Review') {
        updates.course = 'Bachelor of Science in Criminology';
      } else {
        updates.course = '';
      }
    }
    
    if (name === 'regionCode') {
      const selectedRegion = regions.find(region => region.code === value);
      updates.region = selectedRegion?.name || '';
      updates.provinceCode = '';
      updates.province = '';
      updates.cityCode = '';
      updates.city = '';
      updates.barangayCode = '';
      updates.barangay = '';
      
      if (value) {
        setMunicipalities([]);
        setBarangays([]);
        fetchProvinces(value);
      } else {
        setProvinces([]);
        setMunicipalities([]);
        setBarangays([]);
      }
    }
    
    if (name === 'provinceCode') {
      const selectedProvince = provinces.find(province => province.code === value);
      updates.province = selectedProvince?.name || '';
      updates.cityCode = '';
      updates.city = '';
      updates.barangayCode = '';
      updates.barangay = '';
      
      if (value) {
        setBarangays([]);
        fetchMunicipalities(value);
      } else {
        setMunicipalities([]);
        setBarangays([]);
      }
    }
    
    if (name === 'cityCode') {
      const selectedCity = municipalities.find(municipality => municipality.code === value);
      updates.city = selectedCity?.name || '';
      updates.barangayCode = '';
      updates.barangay = '';
      
      if (value) {
        fetchBarangays(value);
      } else {
        setBarangays([]);
      }
    }
    
    if (name === 'barangayCode') {
      const selectedBarangay = barangays.find(barangay => barangay.code === value);
      updates.barangay = selectedBarangay?.name || '';
    }
    
    if (name === 'birthday' && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      updates.age = age.toString();
    }
    
    setAddFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSchoolSearch = (value: string) => {
    setSchoolSearch(value);
    setAddFormData(prev => ({ ...prev, schoolName: value }));
    setShowSchoolDropdown(true);
  };

  const handleSchoolSelect = (school: string) => {
    setAddFormData(prev => ({ ...prev, schoolName: school }));
    setSchoolSearch(school);
    setShowSchoolDropdown(false);
  };

  const filteredSchools = predefinedSchools.filter(school =>
    school.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setAddFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef) {
      fileInputRef.click();
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context?.drawImage(video, 0, 0);
        
        const dataURL = canvas.toDataURL('image/jpeg');
        setAddFormData(prev => ({ ...prev, photo: dataURL }));
        
        stream.getTracks().forEach(track => track.stop());
        setShowCamera(false);
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera');
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addFormData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Student added successfully!');
        setShowAddModal(false);
        resetAddForm();
        // Refresh students list
        const studentsResponse = await fetch('/api/admin/students');
        const studentsData = await studentsResponse.json();
        setStudents(studentsData.students || []);
      } else {
        alert(`Failed to add student: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error adding student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAddForm = () => {
    setAddFormData({
      reviewType: '',
      photo: null,
      firstName: '',
      lastName: '',
      middleInitial: '',
      gender: '',
      birthday: '',
      age: '',
      birthPlace: '',
      contactNumber: '',
      email: '',
      address: '',
      region: '',
      regionCode: '',
      province: '',
      provinceCode: '',
      city: '',
      cityCode: '',
      barangay: '',
      barangayCode: '',
      zipCode: '',
      course: '',
      schoolName: '',
      yearGraduated: '',
      guardianFirstName: '',
      guardianLastName: '',
      guardianMiddleInitial: '',
      guardianContact: '',
      guardianAddress: '',
      relationship: '',
      referredBy: '',
      howDidYouHear: ''
    });
    setSchoolSearch('');
    setShowSchoolDropdown(false);
    setProvinces([]);
    setMunicipalities([]);
    setBarangays([]);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Student Management</h1>
              <p className="text-gray-600 mt-1">Manage and monitor student information and enrollment status</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl text-sm font-medium text-gray-700 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transition-all duration-300">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-xl text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Student
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
                <p className="text-sm font-medium text-gray-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{students.length}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 rounded-full mr-2 bg-blue-500"></div>
                  <span className="text-xs font-medium text-blue-600">All registered</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Students</p>
                <p className="text-3xl font-bold text-gray-900">{students.filter(s => s.status === 'active').length}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
                  <span className="text-xs font-medium text-green-600">Currently enrolled</span>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Students</p>
                <p className="text-3xl font-bold text-gray-900">{students.filter(s => s.status === 'pending' || s.status === 'inactive').length}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 rounded-full mr-2 bg-amber-500"></div>
                  <span className="text-xs font-medium text-amber-600">Awaiting verification</span>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Graduated</p>
                <p className="text-3xl font-bold text-gray-900">{students.filter(s => s.status === 'graduated').length}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 rounded-full mr-2 bg-purple-500"></div>
                  <span className="text-xs font-medium text-purple-600">Completed program</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search students by name, ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-3 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                </select>
                <button className="inline-flex items-center px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm text-sm leading-4 font-medium rounded-xl text-gray-700 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                  </svg>
                  Filter
                </button>
              </div>
            </div>
          </div>

        {/* Table */}
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500 text-sm">Loading students...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">No students found</h3>
                        <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {student.firstName[0]}{student.lastName[0]}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.middleInitial} {student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                            <div className="text-xs text-gray-400">{student.gender} • Age {student.age}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {student.studentId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.contactNumber || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{[student.city, student.province].filter(Boolean).join(', ') || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.enrollments.length > 0 ? student.enrollments[0].reviewType : 'No enrollment'}
                        </div>
                        <div className="text-xs text-gray-500">{student.course}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={student.schoolName || 'N/A'}>
                          {student.schoolName || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">Graduated: {student.yearGraduated || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.status === 'active' ? 'bg-green-100 text-green-800' :
                          student.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          student.status === 'inactive' ? 'bg-red-100 text-red-800' :
                          student.status === 'graduated' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            student.status === 'active' ? 'bg-green-400' :
                            student.status === 'pending' ? 'bg-yellow-400' :
                            student.status === 'inactive' ? 'bg-red-400' :
                            student.status === 'graduated' ? 'bg-purple-400' :
                            'bg-gray-400'
                          }`}></div>
                          {student.status === 'active' ? 'Active' : 
                           student.status === 'pending' ? 'Pending' :
                           student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={async () => {
                              setLoadingStudentDetails(true);
                              try {
                                const response = await fetch(`/api/admin/students/${student.id}`);
                                const data = await response.json();
                                if (data.student) {
                                  setSelectedStudent(data.student);
                                  setShowModal(true);
                                } else {
                                  alert('Failed to load student details');
                                }
                              } catch (error) {
                                console.error('Error loading student details:', error);
                                alert('Error loading student details');
                              } finally {
                                setLoadingStudentDetails(false);
                              }
                            }}
                            disabled={loadingStudentDetails}
                            className="inline-flex items-center p-1 border border-transparent rounded-full text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="View Details"
                          >
                            {loadingStudentDetails ? (
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                          <button 
                            onClick={() => {
                              setEditFormData(student);
                              setShowEditModal(true);
                            }}
                            className="inline-flex items-center p-1 border border-transparent rounded-full text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            title="Edit Student"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(student.id)}
                            disabled={deletingId === student.id}
                            className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Student"
                          >
                            {deletingId === student.id ? (
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredStudents.length > studentsPerPage && (
          <div className="bg-white/70 backdrop-blur-sm border-t border-gray-200/50 px-6 py-4 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredStudents.length)}</span> of{' '}
                  <span className="font-medium">{filteredStudents.length}</span> students
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (totalPages <= 7 || page <= 3 || page >= totalPages - 2 || Math.abs(page - currentPage) <= 1) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === 4 && currentPage > 5) {
                      return (
                        <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                      );
                    } else if (page === totalPages - 3 && currentPage < totalPages - 4) {
                      return (
                        <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        </div>
      </div>

      {/* Student Details Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {(selectedStudent.photoUrl || selectedStudent.photo) ? (
                    <img 
                      src={selectedStudent.photoUrl || selectedStudent.photo} 
                      alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                      className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-white">
                      {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedStudent.firstName} {selectedStudent.middleInitial} {selectedStudent.lastName}
                    </h2>
                    <p className="text-blue-100 font-medium">{selectedStudent.studentId}</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedStudent.status === 'active' ? 'bg-green-100 text-green-800' :
                      selectedStudent.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Student Photo, QR Code, and Badge Section */}
              <div className="mb-6">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                  {/* Student Photo */}
                  <div className="text-center">
                    {(selectedStudent.photoUrl || selectedStudent.photo) ? (
                      <img 
                        src={selectedStudent.photoUrl || selectedStudent.photo} 
                        alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                        className="h-48 w-48 rounded-2xl object-cover border-4 border-blue-200 shadow-lg"
                        style={{ width: '192px', height: '192px' }}
                      />
                    ) : (
                      <div className="h-48 w-48 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl border-4 border-blue-200 shadow-lg" style={{ width: '192px', height: '192px' }}>
                        {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                      </div>
                    )}
                    <p className="mt-3 text-sm text-gray-600 font-medium">Student Photo (2x2 inches)</p>
                  </div>

                  {/* QR Code */}
                  <div className="text-center">
                    <div className="h-32 w-32 bg-white rounded-2xl border-4 border-green-200 shadow-lg flex items-center justify-center p-2">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(selectedStudent.studentId)}`}
                        alt="Student QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="mt-3 text-sm text-gray-600 font-medium">QR Code</p>
                  </div>

                  {/* Student Badge */}
                  <div className="text-center">
                    <div className="h-32 w-24 bg-gradient-to-b from-blue-600 to-indigo-700 rounded-xl shadow-lg border-4 border-yellow-300 relative overflow-hidden">
                      {/* Badge Header */}
                      <div className="bg-yellow-400 text-xs font-bold text-blue-900 py-1 text-center">
                        COEUS
                      </div>
                      
                      {/* Student Photo in Badge */}
                      <div className="flex justify-center mt-1">
                        {(selectedStudent.photoUrl || selectedStudent.photo) ? (
                          <img 
                            src={selectedStudent.photoUrl || selectedStudent.photo} 
                            alt="Badge Photo"
                            className="h-8 w-8 rounded-full object-cover border border-white"
                          />
                        ) : (
                          <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                            {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                          </div>
                        )}
                      </div>
                      
                      {/* Student Info */}
                      <div className="px-1 mt-1">
                        <div className="text-white text-xs font-semibold leading-tight">
                          {selectedStudent.firstName.split(' ')[0]} {selectedStudent.lastName.split(' ')[0]}
                        </div>
                        <div className="text-blue-200 text-xs font-mono mt-1">
                          {selectedStudent.studentId}
                        </div>
                      </div>
                      
                      {/* Badge Footer */}
                      <div className="absolute bottom-0 left-0 right-0 bg-yellow-400 text-xs font-bold text-blue-900 py-1 text-center">
                        {selectedStudent.status === 'active' ? 'ENROLLED' : selectedStudent.status.toUpperCase()}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-600 font-medium">Student Badge</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Gender:</span>
                      <span className="text-gray-900">{selectedStudent.gender || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Age:</span>
                      <span className="text-gray-900">{selectedStudent.age || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Birthday:</span>
                      <span className="text-gray-900">{selectedStudent.birthday ? new Date(selectedStudent.birthday).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Birth Place:</span>
                      <span className="text-gray-900">{selectedStudent.birthPlace || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Phone:</span>
                      <span className="text-gray-900">{selectedStudent.contactNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Email:</span>
                      <span className="text-gray-900 break-all">{selectedStudent.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium block mb-1">Address:</span>
                      <span className="text-gray-900">
                        {[selectedStudent.address, selectedStudent.barangay, selectedStudent.city, selectedStudent.province, selectedStudent.zipCode].filter(Boolean).join(', ') || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Guardian Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Guardian Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Name:</span>
                      <span className="text-gray-900">
                        {[selectedStudent.guardianFirstName, selectedStudent.guardianMiddleInitial, selectedStudent.guardianLastName].filter(Boolean).join(' ') || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Relationship:</span>
                      <span className="text-gray-900">{selectedStudent.relationship || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Contact:</span>
                      <span className="text-gray-900">{selectedStudent.guardianContact || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium block mb-1">Address:</span>
                      <span className="text-gray-900">{selectedStudent.guardianAddress || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Educational Background */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Educational Background
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">School:</span>
                      <span className="text-gray-900 text-right">{selectedStudent.schoolName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Course:</span>
                      <span className="text-gray-900">{selectedStudent.course || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Year Graduated:</span>
                      <span className="text-gray-900">{selectedStudent.yearGraduated || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enrollment Information */}
              {selectedStudent.enrollments.length > 0 && (
                <div className="mt-6 bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Enrollment History
                  </h3>
                  <div className="space-y-3">
                    {selectedStudent.enrollments.map((enrollment, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-gray-900">{enrollment.reviewType}</span>
                            <p className="text-sm text-gray-600">ID: {enrollment.enrollmentId}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              enrollment.status === 'active' ? 'bg-green-100 text-green-800' :
                              enrollment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {enrollment.status}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(enrollment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="mt-6 bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">How did you hear about us:</span>
                    <span className="text-gray-900">{selectedStudent.howDidYouHear || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Referred by:</span>
                    <span className="text-gray-900">{selectedStudent.referredBy || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Registration Date:</span>
                    <span className="text-gray-900">{selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end space-x-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setEditFormData(selectedStudent);
                  setShowModal(false);
                  setShowEditModal(true);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Edit Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {editFormData.photoUrl ? (
                    <img 
                      src={editFormData.photoUrl} 
                      alt={`${editFormData.firstName} ${editFormData.lastName}`}
                      className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-white">
                      {editFormData.firstName?.[0]}{editFormData.lastName?.[0]}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-white">Edit Student Information</h2>
                    <p className="text-green-100 font-medium">{editFormData.studentId}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission here
              console.log('Updated student data:', editFormData);
              setShowEditModal(false);
              // You can add API call to update student here
            }}>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            value={editFormData.firstName || ''}
                            onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            value={editFormData.lastName || ''}
                            onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Middle Initial</label>
                          <input
                            type="text"
                            maxLength={1}
                            value={editFormData.middleInitial || ''}
                            onChange={(e) => setEditFormData({...editFormData, middleInitial: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                          <select
                            value={editFormData.gender || ''}
                            onChange={(e) => setEditFormData({...editFormData, gender: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                          <input
                            type="number"
                            value={editFormData.age || ''}
                            onChange={(e) => setEditFormData({...editFormData, age: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place</label>
                        <input
                          type="text"
                          value={editFormData.birthPlace || ''}
                          onChange={(e) => setEditFormData({...editFormData, birthPlace: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={editFormData.contactNumber || ''}
                          onChange={(e) => setEditFormData({...editFormData, contactNumber: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={editFormData.email || ''}
                          onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                          value={editFormData.address || ''}
                          onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            value={editFormData.city || ''}
                            onChange={(e) => setEditFormData({...editFormData, city: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                          <input
                            type="text"
                            value={editFormData.province || ''}
                            onChange={(e) => setEditFormData({...editFormData, province: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Guardian Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Guardian Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Guardian First Name</label>
                          <input
                            type="text"
                            value={editFormData.guardianFirstName || ''}
                            onChange={(e) => setEditFormData({...editFormData, guardianFirstName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Last Name</label>
                          <input
                            type="text"
                            value={editFormData.guardianLastName || ''}
                            onChange={(e) => setEditFormData({...editFormData, guardianLastName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                          <select
                            value={editFormData.relationship || ''}
                            onChange={(e) => setEditFormData({...editFormData, relationship: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="">Select Relationship</option>
                            <option value="Parent">Parent</option>
                            <option value="Sibling">Sibling</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Relative">Other Relative</option>
                            <option value="Friend">Friend</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Contact</label>
                          <input
                            type="tel"
                            value={editFormData.guardianContact || ''}
                            onChange={(e) => setEditFormData({...editFormData, guardianContact: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Educational Background */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Educational Background
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                        <input
                          type="text"
                          value={editFormData.schoolName || ''}
                          onChange={(e) => setEditFormData({...editFormData, schoolName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                        <input
                          type="text"
                          value={editFormData.course || ''}
                          onChange={(e) => setEditFormData({...editFormData, course: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year Graduated</label>
                        <input
                          type="text"
                          value={editFormData.yearGraduated || ''}
                          onChange={(e) => setEditFormData({...editFormData, yearGraduated: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Add New Student</h2>
                  <p className="text-blue-100 mt-1">Enter student information and enrollment details</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:rotate-90"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddStudent}>
              <div className="p-6 space-y-6">
                {/* Photo Upload Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Student Photo
                  </h3>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border-4 border-blue-200 shadow-lg">
                      {addFormData.photo ? (
                        <img 
                          src={addFormData.photo} 
                          alt="Student" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      >
                        Select Photo
                      </button>
                      <button
                        type="button"
                        onClick={handleCameraCapture}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      >
                        Take Photo
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 bg-white/70 px-3 py-1 rounded-full">2x2 ID picture format (recommended)</p>
                    <input
                      ref={(ref) => setFileInputRef(ref)}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Review Type *</label>
                      <select
                        name="reviewType"
                        value={addFormData.reviewType}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select review program</option>
                        <option value="Nursing Review">Nursing Review</option>
                        <option value="Criminologist Review">Criminology Review</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                      <input
                        type="text"
                        name="course"
                        value={addFormData.course}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        placeholder="Auto-filled based on review type"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={addFormData.firstName}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={addFormData.lastName}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Middle Initial</label>
                      <input
                        type="text"
                        name="middleInitial"
                        value={addFormData.middleInitial}
                        onChange={handleAddFormChange}
                        maxLength={1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                      <select
                        name="gender"
                        value={addFormData.gender}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Birthday *</label>
                      <input
                        type="date"
                        name="birthday"
                        value={addFormData.birthday}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="text"
                        name="age"
                        value={addFormData.age}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        placeholder="Auto-calculated"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place *</label>
                      <input
                        type="text"
                        name="birthPlace"
                        value={addFormData.birthPlace}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={addFormData.contactNumber}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={addFormData.email}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                      <textarea
                        name="address"
                        value={addFormData.address}
                        onChange={handleAddFormChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Region *</label>
                      <select
                        name="regionCode"
                        value={addFormData.regionCode}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={locationLoading.regions}
                      >
                        <option value="">Select Region</option>
                        {regions.map(region => (
                          <option key={region.code} value={region.code}>{region.name}</option>
                        ))}
                      </select>
                      {locationLoading.regions && <p className="text-xs text-blue-500 mt-1">Loading regions...</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                      <select
                        name="provinceCode"
                        value={addFormData.provinceCode}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={!addFormData.regionCode || locationLoading.provinces}
                      >
                        <option value="">Select Province</option>
                        {provinces.map(province => (
                          <option key={province.code} value={province.code}>{province.name}</option>
                        ))}
                      </select>
                      {locationLoading.provinces && <p className="text-xs text-blue-500 mt-1">Loading provinces...</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City/Municipality *</label>
                      <select
                        name="cityCode"
                        value={addFormData.cityCode}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={!addFormData.provinceCode || locationLoading.municipalities}
                      >
                        <option value="">Select City/Municipality</option>
                        {municipalities.map(municipality => (
                          <option key={municipality.code} value={municipality.code}>{municipality.name}</option>
                        ))}
                      </select>
                      {locationLoading.municipalities && <p className="text-xs text-blue-500 mt-1">Loading cities...</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Barangay *</label>
                      <select
                        name="barangayCode"
                        value={addFormData.barangayCode}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={!addFormData.cityCode || locationLoading.barangays}
                      >
                        <option value="">Select Barangay</option>
                        {barangays.map(barangay => (
                          <option key={barangay.code} value={barangay.code}>{barangay.name}</option>
                        ))}
                      </select>
                      {locationLoading.barangays && <p className="text-xs text-blue-500 mt-1">Loading barangays...</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={addFormData.zipCode}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Educational Background */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Educational Background
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">School Name *</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={schoolSearch || addFormData.schoolName}
                          onChange={(e) => handleSchoolSearch(e.target.value)}
                          onFocus={() => setShowSchoolDropdown(true)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                          placeholder="Search for your school..."
                          required
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        
                        {showSchoolDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredSchools.length > 0 ? (
                              filteredSchools.map((school, index) => (
                                <div
                                  key={index}
                                  onClick={() => handleSchoolSelect(school)}
                                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="text-sm font-medium text-gray-900">{school}</div>
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-sm text-gray-500">
                                No schools found matching your search.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year Graduated *</label>
                      <input
                        type="text"
                        name="yearGraduated"
                        value={addFormData.yearGraduated}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us? *</label>
                      <select
                        name="howDidYouHear"
                        value={addFormData.howDidYouHear}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select an option</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Friend/Relative">Friend/Relative</option>
                        <option value="Website">Website</option>
                        <option value="School">School</option>
                        <option value="Advertisement">Advertisement</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Referred By</label>
                      <input
                        type="text"
                        name="referredBy"
                        value={addFormData.referredBy}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Guardian Information */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Guardian Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guardian First Name *</label>
                      <input
                        type="text"
                        name="guardianFirstName"
                        value={addFormData.guardianFirstName}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Last Name *</label>
                      <input
                        type="text"
                        name="guardianLastName"
                        value={addFormData.guardianLastName}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Middle Initial</label>
                      <input
                        type="text"
                        name="guardianMiddleInitial"
                        value={addFormData.guardianMiddleInitial}
                        onChange={handleAddFormChange}
                        maxLength={1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
                      <select
                        name="relationship"
                        value={addFormData.relationship}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select relationship</option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Relative">Other Relative</option>
                        <option value="Friend">Friend</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Contact *</label>
                      <input
                        type="tel"
                        name="guardianContact"
                        value={addFormData.guardianContact}
                        onChange={handleAddFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Address *</label>
                      <textarea
                        name="guardianAddress"
                        value={addFormData.guardianAddress}
                        onChange={handleAddFormChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 rounded-b-3xl flex justify-end space-x-3 border-t border-gray-200/50">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-xl hover:bg-white/90 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </div>
                  ) : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
