"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


interface Region {
  code: string;
  name: string;
}

interface Province {
  code: string;
  name: string;
  regionCode: string;
}

interface Municipality {
  code: string;
  name: string;
  provinceCode: string;
}

interface Barangay {
  code: string;
  name: string;
  municipalityCode: string;
}

interface FormData {
  reviewType: string;
  photo: string | null;
  firstName: string;
  lastName: string;
  middleInitial: string;
  gender: string;
  birthday: string;
  age: string;
  birthPlace: string;
  contactNumber: string;
  email: string;
  address: string;
  region: string;
  regionCode: string;
  province: string;
  provinceCode: string;
  city: string;
  cityCode: string;
  barangay: string;
  barangayCode: string;
  zipCode: string;
  course: string;
  schoolName: string;
  yearGraduated: string;
  guardianFirstName: string;
  guardianLastName: string;
  guardianMiddleInitial: string;
  guardianContact: string;
  guardianAddress: string;
  relationship: string;
  referredBy: string;
  howDidYouHear: string;
  agreeToTerms: boolean;
  amount?: string;
  paymentMethod?: string;
}
const EnrollmentForm = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // School dropdown states
  const [schoolSearch, setSchoolSearch] = useState('');
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  
  // Predefined schools list
  const predefinedSchools = [
    'Capiz State University Main Campus - Roxas City',
    'Capiz State University - Burias Campus (Mambusao)',
    'Capiz State University - Dayao Campus (Roxas City)',
    'Capiz State University - Dumarao Campus (Dumarao)',
    'Capiz State University - Pilar Campus (Pilar)',
    'Capiz State University - Poblacion Campus (Mambusao)',
    'Capiz State University - Pontevedra Campus (Pontevedra)',
    'Capiz State University - Sapian Campus (Sapian)',
    'Capiz State University - Sigma Campus (Sigma)',
    'Capiz State University - Tapaz Campus (Tapaz)',
    'Colegio de la Purisima Concepcion (Roxas City)',
    'Filamer Christian University (Roxas City)',
    'Hercor College (Roxas City)',
    'St. Anthony College of Roxas City, Inc. (Roxas City)',
    'College of St. John-Roxas (Roxas City)'
  ];
  
  const [customSchools, setCustomSchools] = useState<string[]>([]);
  
  // Combined schools list
  const allSchools = [...predefinedSchools, ...customSchools];
  
  // Filtered schools based on search
  const filteredSchools = allSchools.filter(school =>
    school.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  
  const [formData, setFormData] = useState<FormData>({
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
    howDidYouHear: '',
    agreeToTerms: false
  });
  
  const [regions, setRegions] = useState<Region[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [loading, setLoading] = useState({
    regions: false,
    provinces: false,
    municipalities: false,
    barangays: false
  });
  // Default regions in case API fails
  const defaultRegionData = [
    { code: 'NCR', name: 'National Capital Region' },
    { code: 'CAR', name: 'Cordillera Administrative Region' },
    { code: 'R1', name: 'Region I: Ilocos Region' },
    { code: 'R2', name: 'Region II: Cagayan Valley' },
    { code: 'R3', name: 'Region III: Central Luzon' },
    { code: 'R4A', name: 'Region IV-A: CALABARZON' },
    { code: 'R4B', name: 'Region IV-B: MIMAROPA' },
    { code: 'R5', name: 'Region V: Bicol Region' },
    { code: 'R6', name: 'Region VI: Western Visayas' },
    { code: 'R7', name: 'Region VII: Central Visayas' },
    { code: 'R8', name: 'Region VIII: Eastern Visayas' },
    { code: 'R9', name: 'Region IX: Zamboanga Peninsula' },
    { code: 'R10', name: 'Region X: Northern Mindanao' },
    { code: 'R11', name: 'Region XI: Davao Region' },
    { code: 'R12', name: 'Region XII: SOCCSKSARGEN' },
    { code: 'R13', name: 'Region XIII: Caraga' },
    { code: 'BARMM', name: 'Bangsamoro Autonomous Region in Muslim Mindanao' }
  ];
  
  // Fetch regions on component mount
  useEffect(() => {
    const initializeForm = async () => {
      await fetchRegions();
      setIsLoading(false);
    };
    initializeForm();
  }, []);
  
  // Fetch regions from PSGC Cloud API
  const fetchRegions = async () => {
    try {
      setLoading(prev => ({ ...prev, regions: true }));
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('https://psgc.cloud/api/regions', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setRegions(data.map(region => ({
          code: region.code,
          name: region.name
        })));
      } else {
        console.warn('API returned empty or invalid data, using fallback');
        setRegions(defaultRegionData);
      }
    } catch (error) {
      console.warn('Failed to fetch regions from API, using fallback data:', error.message);
      setRegions(defaultRegionData);
    } finally {
      setLoading(prev => ({ ...prev, regions: false }));
    }
  };

  // Default provinces for common regions
  const defaultProvinceData = {
    'NCR': [
      { code: 'PH133900000', name: 'Metro Manila', regionCode: 'NCR' }
    ],
    'R6': [
      { code: 'PH060400000', name: 'Capiz', regionCode: 'R6' },
      { code: 'PH060500000', name: 'Iloilo', regionCode: 'R6' },
      { code: 'PH060600000', name: 'Negros Occidental', regionCode: 'R6' },
      { code: 'PH060200000', name: 'Antique', regionCode: 'R6' },
      { code: 'PH060300000', name: 'Aklan', regionCode: 'R6' },
      { code: 'PH061900000', name: 'Guimaras', regionCode: 'R6' }
    ]
  };
  
  // Fetch provinces from PSGC Cloud API
  const fetchProvinces = async (regionCode: string) => {
    setLoading(prev => ({ ...prev, provinces: true }));
    try {
      // Try to get provinces from API
      const response = await fetch(`https://psgc.cloud/api/regions/${regionCode}/provinces`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setProvinces(data.map(province => ({
          code: province.code,
          name: province.name,
          regionCode: regionCode
        })));
      } else {
        // Fallback to default data if available
        const defaultProvinces = defaultProvinceData[regionCode as keyof typeof defaultProvinceData] || [];
        setProvinces(defaultProvinces);
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
      // Fallback to default data if available
      const defaultProvinces = defaultProvinceData[regionCode as keyof typeof defaultProvinceData] || [];
      setProvinces(defaultProvinces);
    } finally {
      setLoading(prev => ({ ...prev, provinces: false }));
    }
  };

  // Default municipalities for common provinces
  const defaultMunicipalityData = {
    'PH060400000': [
      { code: 'PH060401000', name: 'Roxas City', provinceCode: 'PH060400000' },
      { code: 'PH060402000', name: 'Cuartero', provinceCode: 'PH060400000' },
      { code: 'PH060403000', name: 'Dao', provinceCode: 'PH060400000' },
      { code: 'PH060404000', name: 'Dumalag', provinceCode: 'PH060400000' },
      { code: 'PH060405000', name: 'Dumarao', provinceCode: 'PH060400000' },
      { code: 'PH060406000', name: 'Ivisan', provinceCode: 'PH060400000' },
      { code: 'PH060407000', name: 'Jamindan', provinceCode: 'PH060400000' },
      { code: 'PH060408000', name: 'Ma-ayon', provinceCode: 'PH060400000' },
      { code: 'PH060409000', name: 'Mambusao', provinceCode: 'PH060400000' },
      { code: 'PH060410000', name: 'Panay', provinceCode: 'PH060400000' },
      { code: 'PH060411000', name: 'Panitan', provinceCode: 'PH060400000' },
      { code: 'PH060412000', name: 'Pilar', provinceCode: 'PH060400000' },
      { code: 'PH060413000', name: 'Pontevedra', provinceCode: 'PH060400000' },
      { code: 'PH060414000', name: 'President Roxas', provinceCode: 'PH060400000' },
      { code: 'PH060415000', name: 'Sapian', provinceCode: 'PH060400000' },
      { code: 'PH060416000', name: 'Sigma', provinceCode: 'PH060400000' },
      { code: 'PH060417000', name: 'Tapaz', provinceCode: 'PH060400000' }
    ]
  };
  
  // Fetch municipalities from PSGC Cloud API
  const fetchMunicipalities = async (provinceCode: string) => {
    setLoading(prev => ({ ...prev, municipalities: true }));
    try {
      // Try to get municipalities from API
      const response = await fetch(`https://psgc.cloud/api/provinces/${provinceCode}/cities-municipalities`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setMunicipalities(data.map(municipality => ({
          code: municipality.code,
          name: municipality.name,
          provinceCode: provinceCode
        })));
      } else {
        // Fallback to default data if available
        const defaultMunicipalities = defaultMunicipalityData[provinceCode as keyof typeof defaultMunicipalityData] || [];
        setMunicipalities(defaultMunicipalities);
      }
    } catch (error) {
      console.error('Error fetching municipalities:', error);
      // Fallback to default data if available
      const defaultMunicipalities = defaultMunicipalityData[provinceCode as keyof typeof defaultMunicipalityData] || [];
      setMunicipalities(defaultMunicipalities);
    } finally {
      setLoading(prev => ({ ...prev, municipalities: false }));
    }
  };

  // Default barangays for Roxas City
  const defaultBarangayData = {
    'PH060401000': [
      { code: 'PH060401001', name: 'Balijuagan', municipalityCode: 'PH060401000' },
      { code: 'PH060401002', name: 'Banica', municipalityCode: 'PH060401000' },
      { code: 'PH060401003', name: 'Bolo', municipalityCode: 'PH060401000' },
      { code: 'PH060401004', name: 'Culajao', municipalityCode: 'PH060401000' },
      { code: 'PH060401005', name: 'Punta Tabuc', municipalityCode: 'PH060401000' },
      { code: 'PH060401006', name: 'Tiza', municipalityCode: 'PH060401000' },
      { code: 'PH060401007', name: 'Baybay', municipalityCode: 'PH060401000' }
    ]
  };
  
  // Fetch barangays from PSGC Cloud API
  const fetchBarangays = async (municipalityCode: string) => {
    setLoading(prev => ({ ...prev, barangays: true }));
    try {
      // Try to get barangays from API
      const response = await fetch(`https://psgc.cloud/api/cities-municipalities/${municipalityCode}/barangays`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setBarangays(data.map(barangay => ({
          code: barangay.code,
          name: barangay.name,
          municipalityCode: municipalityCode
        })));
      } else {
        // Fallback to default data if available
        const defaultBarangays = defaultBarangayData[municipalityCode as keyof typeof defaultBarangayData] || [];
        setBarangays(defaultBarangays);
      }
    } catch (error) {
      console.error('Error fetching barangays:', error);
      // Fallback to default data if available
      const defaultBarangays = defaultBarangayData[municipalityCode as keyof typeof defaultBarangayData] || [];
      setBarangays(defaultBarangays);
    } finally {
      setLoading(prev => ({ ...prev, barangays: false }));
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      let updates: Partial<FormData> = { [name]: value };
      
      // Update course based on reviewType
      if (name === 'reviewType') {
        if (value === 'Nursing Review') {
          updates.course = 'Bachelor of Science in Nursing';
        } else if (value === 'Review for Criminology Licensure Examination') {
          updates.course = 'Bachelor of Science in Criminology';
        } else {
          updates.course = '';
        }
      }
      

      
      // Handle location selection
      if (name === 'regionCode') {
        const selectedRegion = regions.find(region => region.code === value);
        updates.region = selectedRegion?.name || '';
        updates.provinceCode = '';
        updates.province = '';
        updates.cityCode = '';
        updates.city = '';
        updates.barangayCode = '';
        updates.barangay = '';
        
        // Get provinces for the selected region
        if (value) {
          // Clear dependent dropdowns
          setMunicipalities([]);
          setBarangays([]);
          // Fetch provinces from API
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
        
        // Get municipalities for the selected province
        if (value) {
          // Clear barangays
          setBarangays([]);
          // Fetch municipalities from API
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
        
        // Get barangays for the selected municipality
        if (value) {
          // Fetch barangays from API
          fetchBarangays(value);
        } else {
          setBarangays([]);
        }
      }
      
      if (name === 'barangayCode') {
        const selectedBarangay = barangays.find(barangay => barangay.code === value);
        updates.barangay = selectedBarangay?.name || '';
      }
      
      // Calculate age when birthday changes
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
      
      setFormData(prev => ({ ...prev, ...updates }));
    }
  };

  // Handle school search input
  const handleSchoolSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSchoolSearch(value);
    setFormData(prev => ({ ...prev, schoolName: value }));
    setShowSchoolDropdown(true);
  };

  // Handle school selection from dropdown
  const handleSchoolSelect = (school: string) => {
    setFormData(prev => ({ ...prev, schoolName: school }));
    setSchoolSearch(school);
    setShowSchoolDropdown(false);
  };

  // Handle adding new school
  const handleAddNewSchool = () => {
    if (newSchoolName.trim() && !allSchools.includes(newSchoolName.trim())) {
      setCustomSchools(prev => [...prev, newSchoolName.trim()]);
      setFormData(prev => ({ ...prev, schoolName: newSchoolName.trim() }));
      setSchoolSearch(newSchoolName.trim());
      setNewSchoolName('');
      setShowAddSchoolModal(false);
      setShowSchoolDropdown(false);
    }
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.school-dropdown-container')) {
      setShowSchoolDropdown(false);
    }
  };
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    // Check if current step's required fields are filled
    let canProceed = true;
    
    if (currentStep === 1) {
      // Check Personal Information fields
      if (!formData.reviewType || !formData.photo || !formData.firstName || !formData.lastName || 
          !formData.gender || !formData.birthday || !formData.birthPlace || 
          !formData.contactNumber || !formData.email || !formData.address || 
          !formData.regionCode || !formData.provinceCode || !formData.cityCode || !formData.barangayCode || !formData.zipCode) {
        canProceed = false;
        alert('Please fill in all required fields before proceeding.');
      }
    } else if (currentStep === 2) {
      // Check Educational Background fields
      if (!formData.schoolName || !formData.yearGraduated || !formData.howDidYouHear) {
        canProceed = false;
        alert('Please fill in all required fields before proceeding.');
      }
    } else if (currentStep === 3) {
      // Check Guardian Information fields
      if (!formData.guardianFirstName || !formData.guardianLastName || 
          !formData.relationship || !formData.guardianContact || !formData.guardianAddress) {
        canProceed = false;
        alert('Please fill in all required fields before proceeding.');
      }
    }
    
    if (canProceed) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };
  const generateReceipt = () => {
    // Create a simple receipt object
    return {
      studentId,
      enrollmentId,
      name: `${formData.firstName} ${formData.lastName}`,
      reviewType: formData.reviewType,
      amount: formData.amount,
      date: new Date().toLocaleDateString()
    };
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Final validation
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms and Conditions before submitting.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Submit to database
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Build the receipt using the IDs from database
        const receipt = {
          studentId: result.studentId,
          enrollmentId: result.enrollmentId,
          name: `${formData.firstName} ${formData.lastName}`,
          reviewType: formData.reviewType,
          date: new Date().toLocaleDateString()
        };
        
        // Save receipt for reference
        window.localStorage.setItem('enrollmentReceipt', JSON.stringify(receipt));
        window.localStorage.setItem('enrollmentFormData', JSON.stringify(formData));
        
        // Set the IDs in state for UI
        setEnrollmentId(result.enrollmentId);
        setStudentId(result.studentId);
        
        // Show success modal
        setShowSuccessModal(true);
      } else {
        console.error('API Error:', result);
        alert(`Failed to submit enrollment: ${result.message || 'Unknown error'}. Please try again.`);
      }
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      alert('Network error occurred while submitting your enrollment. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const [barcodeDataUrl, setBarcodeDataUrl] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  // Generate barcode and QR code data URLs in real time when IDs change
  useEffect(() => {
    const generateImages = async () => {
      if (studentId && enrollmentId) {
        // Barcode
        const barcodeCanvas = document.createElement('canvas');
        JsBarcode(barcodeCanvas, studentId, { format: 'CODE128', width: 2, height: 40, displayValue: false });
        setBarcodeDataUrl(barcodeCanvas.toDataURL('image/png'));
        // QR Code
        const qr = await QRCode.toDataURL(`${studentId}-${enrollmentId}`, { width: 128, margin: 1 });
        setQrDataUrl(qr);
      }
    };
    generateImages();
  }, [studentId, enrollmentId]);
  const handleDownloadPDF = async () => {
    const receiptData = window.localStorage.getItem('enrollmentReceipt');
    const formDataData = window.localStorage.getItem('enrollmentFormData');
    if (receiptData) {
      const receipt = JSON.parse(receiptData);
      const formData = formDataData ? JSON.parse(formDataData) : {};
      if (!receipt.studentId || !receipt.enrollmentId) {
        // Clear invalid data and prompt user
        window.localStorage.removeItem('enrollmentReceipt');
        window.localStorage.removeItem('enrollmentFormData');
        alert("Your previous receipt data was invalid or incomplete. Please re-enroll to generate a valid receipt.");
        return;
      }
      
      // Generate barcode and QR code PNGs
      const barcodeCanvas = document.createElement('canvas');
      JsBarcode(barcodeCanvas, receipt.studentId, { format: 'CODE128', width: 2, height: 40, displayValue: false });
      const barcodeUrl = barcodeCanvas.toDataURL('image/png');
      const qrUrl = await QRCode.toDataURL(`${receipt.studentId}-${receipt.enrollmentId}`, { width: 128, margin: 1 });

      // Create PDF with premium design
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Premium color palette
      const primary = '#1e3a8a'; // Blue 900
      const secondary = '#3b82f6'; // Blue 500
      const accent = '#10b981'; // Emerald 500
      const gray = '#64748b'; // Slate 500
      const darkGray = '#1e293b'; // Slate 800
      const lightGray = '#f8fafc'; // Slate 50
      const white = '#ffffff';
      
      // Premium gradient background
      pdf.setFillColor(248, 250, 252);
      pdf.rect(0, 0, 210, 297, 'F');
      
      // Add subtle pattern overlay
      for (let i = 0; i < 210; i += 20) {
        for (let j = 0; j < 297; j += 20) {
          pdf.setFillColor(255, 255, 255, 0.3);
          pdf.circle(i, j, 0.5, 'F');
        }
      }
      
      // Premium header with gradient effect
      pdf.setFillColor(30, 58, 138);
      pdf.rect(0, 0, 210, 50, 'F');
      
      // Add header accent line
      pdf.setFillColor(16, 185, 129);
      pdf.rect(0, 45, 210, 5, 'F');
      
      // Company logo area with premium styling
      pdf.setFillColor(255, 255, 255, 0.15);
      pdf.roundedRect(20, 10, 50, 30, 5, 5, 'F');
      pdf.setDrawColor(255, 255, 255, 0.3);
      pdf.setLineWidth(1);
      pdf.roundedRect(20, 10, 50, 30, 5, 5, 'S');
      
      // Premium logo design
      pdf.setFillColor(255, 255, 255);
      pdf.circle(45, 25, 8, 'F');
      pdf.setTextColor(30, 58, 138);
      pdf.setFontSize(16);
      pdf.text('CR', 45, 28, { align: 'center' });
      
      // Company name with premium typography
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.text('COEUS REVIEW CENTER', 105, 22, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text('Excellence in Professional Review Education', 105, 32, { align: 'center' });
      
      // Premium content card
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(15, 60, 180, 220, 8, 8, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(15, 60, 180, 220, 8, 8, 'S');
      
      // Add subtle shadow effect
      pdf.setFillColor(0, 0, 0, 0.05);
      pdf.roundedRect(16, 61, 180, 220, 8, 8, 'F');
      
      // Receipt title with premium styling
      pdf.setFillColor(240, 249, 255);
      pdf.roundedRect(25, 70, 160, 25, 5, 5, 'F');
      pdf.setDrawColor(59, 130, 246);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(25, 70, 160, 25, 5, 5, 'S');
      
      pdf.setTextColor(30, 58, 138);
      pdf.setFontSize(18);
      pdf.text('OFFICIAL ENROLLMENT RECEIPT', 105, 85, { align: 'center' });
      
      // Premium enrollment info section
      pdf.setFillColor(249, 250, 251);
      pdf.roundedRect(25, 105, 160, 35, 5, 5, 'F');
      
      // Three-column layout for IDs
      const colWidth = 50;
      const startX = 30;
      
      // Student ID
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text('STUDENT ID', startX, 115);
      pdf.setFontSize(12);
      pdf.setTextColor(30, 41, 59);
      pdf.text(receipt.studentId, startX, 122);
      
      // Enrollment ID
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text('ENROLLMENT ID', startX + colWidth, 115);
      pdf.setFontSize(12);
      pdf.setTextColor(30, 41, 59);
      pdf.text(receipt.enrollmentId, startX + colWidth, 122);
      
      // Date
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text('DATE ENROLLED', startX + (colWidth * 2), 115);
      pdf.setFontSize(12);
      pdf.setTextColor(30, 41, 59);
      pdf.text(receipt.date, startX + (colWidth * 2), 122);
      
      // Status badge
      pdf.setFillColor(245, 158, 11);
      pdf.roundedRect(140, 125, 40, 12, 6, 6, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text('PENDING', 160, 133, { align: 'center' });
      
      // Student details section with premium grid
      pdf.setTextColor(30, 58, 138);
      pdf.setFontSize(14);
      pdf.text('Student Information', 105, 155, { align: 'center' });
      
      // Decorative line
      pdf.setDrawColor(59, 130, 246);
      pdf.setLineWidth(1);
      pdf.line(70, 158, 140, 158);
      
      // Premium info grid
      const infoY = 170;
      const rowHeight = 18;
      
      // Row 1
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(25, infoY, 160, rowHeight, 3, 3, 'F');
      
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text('FULL NAME', 30, infoY + 6);
      pdf.setFontSize(11);
      pdf.setTextColor(30, 41, 59);
      pdf.text(receipt.name, 30, infoY + 12);
      
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text('PROGRAM', 110, infoY + 6);
      pdf.setFontSize(11);
      pdf.setTextColor(30, 41, 59);
      pdf.text(receipt.reviewType, 110, infoY + 12);
      
      // Row 2
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(25, infoY + rowHeight + 2, 160, rowHeight, 3, 3, 'F');
      
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text('CONTACT', 30, infoY + rowHeight + 8);
      pdf.setFontSize(11);
      pdf.setTextColor(30, 41, 59);
      pdf.text(formData.contactNumber || 'N/A', 30, infoY + rowHeight + 14);
      
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text('EMAIL', 110, infoY + rowHeight + 8);
      pdf.setFontSize(11);
      pdf.setTextColor(30, 41, 59);
      pdf.text(formData.email || 'N/A', 110, infoY + rowHeight + 14);
      
      // Row 3
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(25, infoY + (rowHeight + 2) * 2, 160, rowHeight, 3, 3, 'F');
      
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text('SCHOOL', 30, infoY + (rowHeight + 2) * 2 + 6);
      pdf.setFontSize(11);
      pdf.setTextColor(30, 41, 59);
      pdf.text(formData.schoolName || 'N/A', 30, infoY + (rowHeight + 2) * 2 + 12);
      
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text('YEAR GRADUATED', 110, infoY + (rowHeight + 2) * 2 + 6);
      pdf.setFontSize(11);
      pdf.setTextColor(30, 41, 59);
      pdf.text(formData.yearGraduated || 'N/A', 110, infoY + (rowHeight + 2) * 2 + 12);
      
      // Premium codes section
      pdf.setFillColor(240, 249, 255);
      pdf.roundedRect(25, 240, 160, 30, 5, 5, 'F');
      pdf.setDrawColor(59, 130, 246);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(25, 240, 160, 30, 5, 5, 'S');
      
      // Barcode container with premium styling
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(30, 245, 85, 20, 3, 3, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(30, 245, 85, 20, 3, 3, 'S');
      pdf.addImage(barcodeUrl, 'PNG', 35, 248, 75, 14);
      
      // QR code container with premium styling
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(125, 245, 25, 20, 3, 3, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(125, 245, 25, 20, 3, 3, 'S');
      pdf.addImage(qrUrl, 'PNG', 128, 247, 19, 16);
      
      // Verification badge
      pdf.setFillColor(30, 58, 138);
      pdf.roundedRect(155, 245, 25, 20, 3, 3, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.text('VERIFIED', 167.5, 252, { align: 'center' });
      pdf.setFontSize(6);
      pdf.text(new Date().getFullYear().toString(), 167.5, 258, { align: 'center' });
      
      // Premium footer
      pdf.setFillColor(30, 58, 138);
      pdf.rect(0, 280, 210, 17, 'F');
      
      // Footer content with better spacing
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.text('Thank you for choosing Coeus Review & Training Specialist, Inc.', 105, 287, { align: 'center' });
      
      pdf.setFontSize(8);
      pdf.text('Roxas City, Capiz  •  (036) 621-0000  •  info@coeusreview.com', 105, 293, { align: 'center' });
      
      // Add watermark
      pdf.setTextColor(0, 0, 0, 0.05);
      pdf.setFontSize(60);
      pdf.text('COEUS', 105, 150, { align: 'center', angle: 45 });
      
      // Save the PDF with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      pdf.save(`Coeus-Receipt-${receipt.studentId}-${timestamp}.pdf`);
    }
  };

  // Helper function to escape HTML to prevent XSS
  const escapeHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const handlePrintReceipt = async () => {
    const receiptData = window.localStorage.getItem('enrollmentReceipt');
    const formDataData = window.localStorage.getItem('enrollmentFormData');
    if (receiptData) {
      const receipt = JSON.parse(receiptData);
      const formData = formDataData ? JSON.parse(formDataData) : {};
      if (!receipt.studentId || !receipt.enrollmentId) {
        // Clear invalid data and prompt user
        window.localStorage.removeItem('enrollmentReceipt');
        window.localStorage.removeItem('enrollmentFormData');
        alert("Your previous receipt data was invalid or incomplete. Please re-enroll to generate a valid receipt.");
        return;
      }
      // Generate barcode and QR code PNGs
      const barcodeCanvas = document.createElement('canvas');
      JsBarcode(barcodeCanvas, receipt.studentId, { format: 'CODE128', width: 2, height: 40, displayValue: false });
      const barcodeUrl = barcodeCanvas.toDataURL('image/png');
      const qrUrl = await QRCode.toDataURL(`${receipt.studentId}-${receipt.enrollmentId}`, { width: 128, margin: 1 });

      // Open a new window for printing
      const printWindow = window.open('', '_blank', 'width=800,height=1000');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Coeus Receipt - ${escapeHtml(receipt.studentId)}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #f9fafb; color: #333; font-size: 12px; line-height: 1.5; }
              .receipt-container { max-width: 800px; margin: 20px auto; background: white; page-break-inside: avoid; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }
              .receipt-header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 25px 20px; text-align: center; position: relative; }
              .logo { width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 24px; font-weight: 700; border: 2px solid rgba(255,255,255,0.3); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
              .company-name { font-size: 24px; font-weight: 700; margin-bottom: 5px; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .receipt-title { font-size: 14px; font-weight: 400; opacity: 0.9; }
              .receipt-body { padding: 30px; }
              .section { margin-bottom: 25px; }
              .section-title { font-size: 16px; font-weight: 600; color: #1e3a8a; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; position: relative; }
              .section-title:after { content: ''; position: absolute; bottom: -2px; left: 0; width: 60px; height: 2px; background: #3b82f6; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
              .info-item { background: #f0f7ff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.03); transition: all 0.2s ease; }
              .info-item:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
              .info-label { font-size: 10px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
              .info-value { font-size: 14px; font-weight: 600; color: #1e293b; }
              .payment-section { background: linear-gradient(to right, #f0f9ff, #e0f2fe); padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #bfdbfe; }
              .payment-total { display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: 700; color: #1e3a8a; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #93c5fd; }
              .payment-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
              .codes-section { text-align: center; margin: 25px 0; padding: 20px; background: #f8fafc; border-radius: 10px; border: 1px dashed #cbd5e1; display: flex; justify-content: space-around; align-items: center; }
              .barcode-container { text-align: center; }
              .barcode { background: white; padding: 12px; border-radius: 8px; display: inline-block; margin-bottom: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
              .barcode-text { font-family: 'Courier New', monospace; font-size: 12px; font-weight: 600; color: #64748b; letter-spacing: 1px; text-align: center; margin-top: 5px; }
              .qr-container { text-align: center; }
              .qr-code { background: white; padding: 10px; border-radius: 8px; display: inline-block; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
              .footer { text-align: center; padding: 20px; background: #1e3a8a; color: white; margin-top: 25px; }
              .footer-message { font-size: 14px; color: white; margin-bottom: 10px; font-weight: 500; }
              .contact-info { font-size: 12px; color: rgba(255,255,255,0.8); margin-bottom: 15px; display: flex; justify-content: center; gap: 20px; }
              .contact-item { display: inline-block; }
              .verification-code { background: rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 20px; font-family: 'Courier New', monospace; font-size: 12px; font-weight: 600; letter-spacing: 1px; display: inline-block; }
              .decorative-line { height: 3px; background: linear-gradient(to right, #3b82f6, #93c5fd); margin: 15px 0; border-radius: 3px; }
              @media print { body { background: white; padding: 0; margin: 0; } .receipt-container { box-shadow: none; border-radius: 0; max-width: 100%; margin: 0; padding: 0; } @page { margin: 0.5in; size: A4; } }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              <div class="receipt-header">
                <div class="logo">CR</div>
                <div class="company-name">COEUS REVIEW CENTER</div>
                <div class="receipt-title">Official Enrollment Receipt</div>
              </div>
              <div class="receipt-body">
                <div class="section">
                  <div class="section-title">Enrollment Information</div>
                  <div class="info-grid">
                    <div class="info-item">
                      <div class="info-label">Student ID</div>
                      <div class="info-value">${escapeHtml(receipt.studentId)}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Enrollment ID</div>
                      <div class="info-value">${escapeHtml(receipt.enrollmentId)}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Date Enrolled</div>
                      <div class="info-value">${escapeHtml(receipt.date)}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Program Type</div>
                      <div class="info-value">${escapeHtml(receipt.reviewType)}</div>
                    </div>
                  </div>
                </div>
                <div class="decorative-line"></div>
                <div class="section">
                  <div class="section-title">Student Details</div>
                  <div class="info-grid">
                    <div class="info-item">
                      <div class="info-label">Full Name</div>
                      <div class="info-value">${escapeHtml(receipt.name)}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Contact Number</div>
                      <div class="info-value">${escapeHtml(formData.contactNumber || 'N/A')}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Email Address</div>
                      <div class="info-value">${escapeHtml(formData.email || 'N/A')}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">School</div>
                      <div class="info-value">${escapeHtml(formData.schoolName || 'N/A')}</div>
                    </div>
                  </div>
                </div>
                <div class="decorative-line"></div>
                <div class="payment-section">
                  <div class="payment-total">
                    <span>Application Status</span>
                    <span style="color: #f59e0b; font-weight: bold;">PENDING</span>
                  </div>
                  <div class="payment-details">
                    <div class="info-item">
                      <div class="info-label">Year Graduated</div>
                      <div class="info-value">${escapeHtml(formData.yearGraduated || 'N/A')}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Guardian</div>
                      <div class="info-value">${escapeHtml(formData.guardianFirstName)} ${escapeHtml(formData.guardianLastName)}</div>
                    </div>
                  </div>
                </div>
                <div class="codes-section">
                  <div class="barcode-container">
                    <div class="barcode">
                      <img src="${barcodeUrl}" alt="Barcode" width="180" height="40" />
                      <div class="barcode-text">${escapeHtml(receipt.studentId)}</div>
                    </div>
                  </div>
                  <div class="qr-container">
                    <div class="qr-code">
                      <img src="${qrUrl}" alt="QR Code" width="80" height="80" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="footer">
                <div class="footer-message">
                  Thank you for choosing Coeus Review & Training Specialist, Inc.
                </div>
                <div class="contact-info">
                  <span class="contact-item">Address: Roxas City, Capiz</span>
                  <span class="contact-item">Phone: (036) 621-0000</span>
                  <span class="contact-item">Email: info@coeusreview.com</span>
                </div>
                <div class="verification-code">
                  VERIFICATION: ${escapeHtml(receipt.studentId)}-${new Date().getFullYear()}
                </div>
              </div>
            </div>
            <script>
              window.onload = function() {
                setTimeout(() => {
                  window.print();
                }, 500);
              };
            </script>
          </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading enrollment form...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4 text-center">Enrollment Form</h2>
      
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="text-xs font-medium text-gray-500">
              Step {step}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="font-medium text-blue-700">
            {currentStep === 1 ? 'Personal Information' : 
             currentStep === 2 ? 'Educational Background' : 
             currentStep === 3 ? 'Guardian Information' : 
             'Payment Details'}
          </span>
          <span className="text-gray-500">{currentStep} of {totalSteps}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-sm text-gray-500 mb-4">Fields marked with <span className="text-red-500">*</span> are required</p>
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-800">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-end">
              <div className="flex flex-col justify-end">
                <label htmlFor="reviewType" className="block text-sm font-medium text-gray-700 mb-1">
                  What are you enrolling for? <span className="text-red-500">*</span>
                </label>
                <select
                  id="reviewType"
                  name="reviewType"
                  value={formData.reviewType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">Select a review program</option>
                  <option value="Nursing Review">Nursing Review</option>
                  <option value="Review for Criminology Licensure Examination">Review for Criminology Licensure Examination</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Your Photo (2x2) <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-md overflow-hidden bg-gray-100 border-2 border-blue-500 mb-3">
                    {formData.photo ? (
                      <img 
                        src={formData.photo} 
                        alt="Student" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-32"
                  >
                    Select Photo
                  </button>
                  <p className="text-xs text-gray-500 mt-1">2x2 ID picture format</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="middleInitial" className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Initial
                </label>
                <input
                  type="text"
                  id="middleInitial"
                  name="middleInitial"
                  value={formData.middleInitial}
                  onChange={handleChange}
                  maxLength={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday
                </label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  value={formData.age}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  placeholder="Age will be calculated automatically"
                />
              </div>
              
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700 mb-1">
                  Birth Place
                </label>
                <input
                  type="text"
                  id="birthPlace"
                  name="birthPlace"
                  value={formData.birthPlace}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="regionCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Region <span className="text-red-500">*</span>
                </label>
                <select
                  id="regionCode"
                  name="regionCode"
                  value={formData.regionCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  disabled={loading.regions}
                >
                  <option value="">Select Region</option>
                  {Array.isArray(regions) && regions.map(region => (
                    <option key={region.code} value={region.code}>{region.name}</option>
                  ))}
                </select>
                {loading.regions && <p className="text-xs text-blue-500 mt-1">Loading regions...</p>}
              </div>
              
              <div>
                <label htmlFor="provinceCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Province <span className="text-red-500">*</span>
                </label>
                <select
                  id="provinceCode"
                  name="provinceCode"
                  value={formData.provinceCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  disabled={!formData.regionCode || loading.provinces}
                >
                  <option value="">Select Province</option>
                  {Array.isArray(provinces) && provinces.map(province => (
                    <option key={province.code} value={province.code}>{province.name}</option>
                  ))}
                </select>
                {loading.provinces && <p className="text-xs text-blue-500 mt-1">Loading provinces...</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cityCode" className="block text-sm font-medium text-gray-700 mb-1">
                  City/Municipality <span className="text-red-500">*</span>
                </label>
                <select
                  id="cityCode"
                  name="cityCode"
                  value={formData.cityCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  disabled={!formData.provinceCode || loading.municipalities}
                >
                  <option value="">Select City/Municipality</option>
                  {Array.isArray(municipalities) && municipalities.map(municipality => (
                    <option key={municipality.code} value={municipality.code}>{municipality.name}</option>
                  ))}
                </select>
                {loading.municipalities && <p className="text-xs text-blue-500 mt-1">Loading cities/municipalities...</p>}
              </div>
              
              <div>
                <label htmlFor="barangayCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Barangay <span className="text-red-500">*</span>
                </label>
                <select
                  id="barangayCode"
                  name="barangayCode"
                  value={formData.barangayCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  disabled={!formData.cityCode || loading.barangays}
                >
                  <option value="">Select Barangay</option>
                  {Array.isArray(barangays) && barangays.map(barangay => (
                    <option key={barangay.code} value={barangay.code}>{barangay.name}</option>
                  ))}
                </select>
                {loading.barangays && <p className="text-xs text-blue-500 mt-1">Loading barangays...</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Educational Background */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-800">Educational Background</h3>
            

            
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <input
                type="text"
                id="course"
                name="course"
                value={formData.course}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
              {!formData.course && (
                <p className="text-xs text-amber-600 mt-1">This field will be automatically filled based on your selected review program.</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="school-dropdown-container relative">
                <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">
                  School Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="schoolName"
                    name="schoolName"
                    value={schoolSearch || formData.schoolName}
                    onChange={handleSchoolSearch}
                    onFocus={() => setShowSchoolDropdown(true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                    placeholder="Search for your school..."
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  {/* Dropdown */}
                  {showSchoolDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredSchools.length > 0 ? (
                        <>
                          {filteredSchools.map((school, index) => (
                            <div
                              key={index}
                              onClick={() => handleSchoolSelect(school)}
                              className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="text-sm font-medium text-gray-900">{school}</div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No schools found matching your search.
                        </div>
                      )}
                      
                      {/* Add new school option */}
                      <div
                        onClick={() => setShowAddSchoolModal(true)}
                        className="px-4 py-2 hover:bg-green-50 cursor-pointer border-t border-gray-200 bg-green-25"
                      >
                        <div className="flex items-center text-sm font-medium text-green-700">
                          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add a new school
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="yearGraduated" className="block text-sm font-medium text-gray-700 mb-1">
                  Year Graduated
                </label>
                <input
                  type="text"
                  id="yearGraduated"
                  name="yearGraduated"
                  value={formData.yearGraduated}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="howDidYouHear" className="block text-sm font-medium text-gray-700 mb-1">
                How did you hear about us?
              </label>
              <select
                id="howDidYouHear"
                name="howDidYouHear"
                value={formData.howDidYouHear}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              <label htmlFor="referredBy" className="block text-sm font-medium text-gray-700 mb-1">
                Referred By <span className="text-xs text-gray-500">(optional)</span>
              </label>
              <input
                type="text"
                id="referredBy"
                name="referredBy"
                value={formData.referredBy}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Guardian Information */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-800">Guardian/Emergency Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="guardianFirstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="guardianFirstName"
                  name="guardianFirstName"
                  value={formData.guardianFirstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="guardianLastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="guardianLastName"
                  name="guardianLastName"
                  value={formData.guardianLastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="guardianMiddleInitial" className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Initial
                </label>
                <input
                  type="text"
                  id="guardianMiddleInitial"
                  name="guardianMiddleInitial"
                  value={formData.guardianMiddleInitial}
                  onChange={handleChange}
                  maxLength={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship to Student
                </label>
                <select
                  id="relationship"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                <label htmlFor="guardianContact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="guardianContact"
                  name="guardianContact"
                  value={formData.guardianContact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="guardianAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                id="guardianAddress"
                name="guardianAddress"
                value={formData.guardianAddress}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              ></textarea>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800 mb-2 font-medium">Important Note:</p>
              <p className="text-sm text-blue-700">
                In case of emergency, the person listed above will be contacted. Please ensure all information is accurate and up-to-date.
              </p>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {/* Step 4: Student Information Summary */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-800">Student Information Summary</h3>
            <p className="text-sm text-gray-600 mb-6">Please review all your information before submitting your enrollment.</p>
            
            {/* Personal Information Summary */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-3">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                  <input type="text" value={`${formData.firstName} ${formData.middleInitial} ${formData.lastName}`} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Review Type</label>
                  <input type="text" value={formData.reviewType} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
                  <input type="text" value={formData.gender} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Age</label>
                  <input type="text" value={formData.age} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Birthday</label>
                  <input type="text" value={formData.birthday} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Birth Place</label>
                  <input type="text" value={formData.birthPlace} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
              </div>
            </div>
            
            {/* Contact Information Summary */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h4 className="font-semibold text-green-800 mb-3">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Contact Number</label>
                  <input type="text" value={formData.contactNumber} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
                  <input type="text" value={formData.email} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Complete Address</label>
                  <input type="text" value={`${formData.address}, ${formData.barangay}, ${formData.city}, ${formData.province}, ${formData.region} ${formData.zipCode}`} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
              </div>
            </div>
            
            {/* Educational Background Summary */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h4 className="font-semibold text-purple-800 mb-3">Educational Background</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Course</label>
                  <input type="text" value={formData.course} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Year Graduated</label>
                  <input type="text" value={formData.yearGraduated} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">School Name</label>
                  <input type="text" value={formData.schoolName} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">How did you hear about us?</label>
                  <input type="text" value={formData.howDidYouHear} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Referred By</label>
                  <input type="text" value={formData.referredBy || 'N/A'} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
              </div>
            </div>
            
            {/* Guardian Information Summary */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <h4 className="font-semibold text-orange-800 mb-3">Guardian/Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Guardian Name</label>
                  <input type="text" value={`${formData.guardianFirstName} ${formData.guardianMiddleInitial} ${formData.guardianLastName}`} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Relationship</label>
                  <input type="text" value={formData.relationship} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Contact Number</label>
                  <input type="text" value={formData.guardianContact} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
                  <input type="text" value={formData.guardianAddress} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white" />
                </div>
              </div>
            </div>
            
            {/* Student ID (read-only, auto-generated) */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={studentId || 'Will be generated after enrollment'}
                readOnly
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                tabIndex={-1}
              />
              <p className="text-xs text-gray-500 mt-1">This will be generated after you enroll and will appear on your receipt.</p>
            </div>
            
            <div className="flex items-start space-x-2 mt-6">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1"
                required
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>. I understand that my personal information will be processed in accordance with Coeus Review Center's privacy practices.
              </label>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={!formData.agreeToTerms || isSubmitting}
                className={`px-6 py-3 ${formData.agreeToTerms && !isSubmitting ? 'bg-blue-700 hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed'} text-white font-medium rounded-lg transition-colors flex items-center justify-center`}
              >
                {isSubmitting && (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                {isSubmitting ? 'Enrolling...' : 'Enroll Now'}
              </button>
            </div>
          </div>
        )}
      </form>
      
      {/* Add School Modal */}
      {showAddSchoolModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleClickOutside}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New School</h3>
              <div className="mb-4">
                <label htmlFor="newSchoolName" className="block text-sm font-medium text-gray-700 mb-2">
                  School Name
                </label>
                <input
                  type="text"
                  id="newSchoolName"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter the full school name..."
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddSchoolModal(false);
                    setNewSchoolName('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddNewSchool}
                  disabled={!newSchoolName.trim()}
                  className={`px-4 py-2 ${newSchoolName.trim() ? 'bg-blue-700 hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed'} text-white rounded-lg transition-colors`}
                >
                  Add School
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl overflow-hidden shadow-xl max-w-md w-full">
            <div className="bg-blue-700 p-6 text-white">
              <div className="flex items-center">
                <div className="bg-white rounded-full h-12 w-12 flex items-center justify-center mr-4">
                  <span className="text-blue-700 font-bold text-xl">CR</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Enrollment Successful!</h3>
                  <p className="text-blue-100 text-sm">Your application has been received</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Thank you for enrolling with Coeus Review Center. Please print your enrollment receipt and present it to our staff for verification.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Student ID</p>
                      <p className="text-blue-700 font-semibold">{studentId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Enrollment ID</p>
                      <p className="text-blue-700 font-semibold">{enrollmentId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Program</p>
                      <p className="font-medium">{formData.reviewType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="font-medium text-yellow-600">PENDING</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mb-4 space-x-4">
                  {barcodeDataUrl && (
                  <div className="bg-gray-100 rounded-lg p-3 inline-block">
                      <img src={barcodeDataUrl} alt="Barcode" width={150} height={40} />
                    <div className="text-center text-xs font-mono mt-1 text-gray-600">{studentId}</div>
                  </div>
                  )}
                  {qrDataUrl && (
                    <div className="bg-gray-100 rounded-lg p-3 inline-block">
                      <img src={qrDataUrl} alt="QR Code" width={63} height={63} />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handlePrintReceipt}
                  className={`w-full px-4 py-3 bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center ${(!studentId || !enrollmentId) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'}`}
                  disabled={!studentId || !enrollmentId}
                  title={!studentId || !enrollmentId ? 'Complete enrollment to enable printing.' : ''}
                  tabIndex={(!studentId || !enrollmentId) ? -1 : 0}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                  </svg>
                  Print Receipt
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className={`w-full px-4 py-3 bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors text-center ${(!studentId || !enrollmentId) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-200'}`}
                  title={!studentId || !enrollmentId ? 'Complete enrollment to enable downloading receipt.' : ''}
                  disabled={!studentId || !enrollmentId}
                  tabIndex={(!studentId || !enrollmentId) ? -1 : 0}
                >
                  Download Receipt
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentForm;
