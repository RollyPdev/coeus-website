"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  programSchedule: string;
  paymentMethod: string;
  paymentPlan: string;
  amount: string;
  agreeToTerms: boolean;
}

const EnrollmentForm = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState('');
  const [studentId, setStudentId] = useState('');

  
  const [formData, setFormData] = useState<FormData>({
    reviewType: '',
    photo: null,
    firstName: '',
    lastName: '',
    middleInitial: '',
    gender: '',
    birthday: '',
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
    programSchedule: '',
    paymentMethod: '',
    paymentPlan: '',
    amount: '',
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

  // Fetch regions on component mount
  useEffect(() => {
    fetchRegions();
  }, []);

  // Fetch regions
  const fetchRegions = async () => {
    try {
      setLoading(prev => ({ ...prev, regions: true }));
      const response = await fetch('https://psgc.vercel.app/api/region');
      const data = await response.json();
      setRegions(data);
    } catch (error) {
      console.error('Error fetching regions:', error);
    } finally {
      setLoading(prev => ({ ...prev, regions: false }));
    }
  };

  // Fetch provinces based on selected region
  const fetchProvinces = async (regionCode: string) => {
    try {
      setLoading(prev => ({ ...prev, provinces: true }));
      const response = await fetch(`https://psgc.vercel.app/api/region/${regionCode}/province`);
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    } finally {
      setLoading(prev => ({ ...prev, provinces: false }));
    }
  };

  // Fetch municipalities based on selected province
  const fetchMunicipalities = async (provinceCode: string) => {
    try {
      setLoading(prev => ({ ...prev, municipalities: true }));
      const response = await fetch(`https://psgc.vercel.app/api/province/${provinceCode}/municipality`);
      const data = await response.json();
      setMunicipalities(data);
    } catch (error) {
      console.error('Error fetching municipalities:', error);
    } finally {
      setLoading(prev => ({ ...prev, municipalities: false }));
    }
  };

  // Fetch barangays based on selected municipality
  const fetchBarangays = async (municipalityCode: string) => {
    try {
      setLoading(prev => ({ ...prev, barangays: true }));
      const response = await fetch(`https://psgc.vercel.app/api/municipality/${municipalityCode}/barangay`);
      const data = await response.json();
      setBarangays(data);
    } catch (error) {
      console.error('Error fetching barangays:', error);
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
      let updates = { [name]: value };
      
      // Update course based on reviewType
      if (name === 'reviewType') {
        if (value === 'Nursing Review') {
          updates.course = 'Bachelor of Science in Nursing';
        } else if (value === 'Criminologist Review') {
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
        
        // Fetch provinces for the selected region
        if (value) {
          fetchProvinces(value);
        } else {
          setProvinces([]);
        }
        setMunicipalities([]);
        setBarangays([]);
      }
      
      if (name === 'provinceCode') {
        const selectedProvince = provinces.find(province => province.code === value);
        updates.province = selectedProvince?.name || '';
        updates.cityCode = '';
        updates.city = '';
        updates.barangayCode = '';
        updates.barangay = '';
        
        // Fetch municipalities for the selected province
        if (value) {
          fetchMunicipalities(value);
        } else {
          setMunicipalities([]);
        }
        setBarangays([]);
      }
      
      if (name === 'cityCode') {
        const selectedCity = municipalities.find(municipality => municipality.code === value);
        updates.city = selectedCity?.name || '';
        updates.barangayCode = '';
        updates.barangay = '';
        
        // Fetch barangays for the selected municipality
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
      
      setFormData(prev => ({ ...prev, ...updates }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation for payment details
    if (!formData.programSchedule || !formData.paymentPlan || 
        !formData.paymentMethod || !formData.amount || !formData.agreeToTerms) {
      alert('Please fill in all required fields before submitting.');
      return;
    }
    
    // For demo purposes, generate IDs locally
    const studentId = `STU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const enrollmentId = `ENR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    // Set the IDs
    setEnrollmentId(enrollmentId);
    setStudentId(studentId);
    
    // Generate receipt
    const receipt = generateReceipt();
    
    // Save receipt for reference
    window.localStorage.setItem('enrollmentReceipt', JSON.stringify(receipt));
    
    // Show success modal
    setShowSuccessModal(true);
  };

  const handlePrintReceipt = () => {
    const receiptData = window.localStorage.getItem('enrollmentReceipt');
    if (receiptData) {
      const receipt = JSON.parse(receiptData);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Coeus Receipt</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                @page {
                  size: 210mm 148.5mm; /* Half A4 size */
                  margin: 0;
                }
              </style>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
                
                body { 
                  font-family: 'Poppins', sans-serif; 
                  margin: 0; 
                  padding: 0; 
                  background-color: #f9fafb; 
                  color: #1f2937;
                }
                
                .container {
                  position: relative;
                  width: 210mm; /* A4 width */
                  height: 148.5mm; /* Half of A4 height */
                  margin: 0 auto;
                  background-color: white;
                  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                  border-radius: 16px;
                  overflow: hidden;
                  page-break-after: always;
                }
                
                .container::after {
                  content: 'COEUS REVIEW';
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) rotate(-45deg);
                  font-size: 40px;
                  font-weight: bold;
                  color: rgba(59, 130, 246, 0.07);
                  white-space: nowrap;
                  pointer-events: none;
                  z-index: 1;
                }
                

                
                .receipt-header {
                  background: linear-gradient(135deg, #1e40af, #3b82f6);
                  color: white;
                  padding: 15px;
                  text-align: center;
                  position: relative;
                }
                
                .receipt-header h1 {
                  margin: 0;
                  font-size: 20px;
                  font-weight: 700;
                  letter-spacing: 1px;
                }
                
                .receipt-header h2 {
                  margin: 5px 0 0;
                  font-size: 14px;
                  font-weight: 500;
                  opacity: 0.9;
                }
                
                .receipt-header .logo {
                  position: absolute;
                  top: 10px;
                  left: 10px;
                  width: 40px;
                  height: 40px;
                  background-color: white;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  color: #1e40af;
                  font-size: 14px;
                }
                
                .receipt-body {
                  padding: 15px;
                  font-size: 12px;
                }
                
                .receipt-section {
                  margin-bottom: 12px;
                }
                
                .receipt-section h3 {
                  color: #1e40af;
                  font-size: 14px;
                  margin-bottom: 8px;
                  padding-bottom: 4px;
                  border-bottom: 1px solid #e5e7eb;
                }
                
                .receipt-section .grid {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 8px;
                }
                
                .receipt-section .item {
                  margin-bottom: 5px;
                }
                
                .receipt-section .label {
                  font-size: 10px;
                  color: #6b7280;
                  margin-bottom: 2px;
                }
                
                .receipt-section .value {
                  font-size: 12px;
                  font-weight: 500;
                }
                
                .id-value {
                  color: #1e40af;
                  font-weight: 600;
                  letter-spacing: 0.5px;
                }
                
                .receipt-footer {
                  background-color: #f3f4f6;
                  padding: 8px 15px;
                  text-align: center;
                  font-size: 10px;
                  color: #4b5563;
                }
                
                .barcode-container {
                  text-align: center;
                  margin: 10px 0;
                }
                
                .barcode {
                  padding: 15px;
                  background-color: #f3f4f6;
                  border-radius: 8px;
                  display: inline-block;
                }
                
                .barcode-text {
                  font-family: monospace;
                  font-size: 14px;
                  letter-spacing: 5px;
                  margin-top: 8px;
                  color: #1e40af;
                }
                
                .payment-info {
                  background-color: #f0f9ff;
                  border-left: 3px solid #3b82f6;
                  padding: 8px;
                  border-radius: 4px;
                }
                
                .payment-amount {
                  font-size: 16px;
                  font-weight: 700;
                  color: #1e40af;
                  margin-top: 3px;
                }
                
                .payment-method {
                  display: inline-block;
                  background-color: #dbeafe;
                  color: #1e40af;
                  padding: 4px 10px;
                  border-radius: 20px;
                  font-size: 14px;
                  margin-top: 10px;
                }
                
                .verification-note {
                  margin-top: 10px;
                  padding: 8px;
                  background-color: #fffbeb;
                  border: 1px dashed #fbbf24;
                  border-radius: 6px;
                  font-size: 10px;
                  text-align: center;
                }
                
                @media print {
                  body {
                    background-color: white;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    margin: 0;
                    padding: 0;
                  }
                  .container {
                    box-shadow: none;
                    margin: 0 auto;
                    width: 210mm;
                    height: 148.5mm;
                    page-break-inside: avoid;
                    page-break-after: always;
                  }
                  .container::after {
                    color: rgba(59, 130, 246, 0.07) !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  .receipt-header {
                    background: linear-gradient(135deg, #1e40af, #3b82f6) !important;
                    color: white !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  .payment-info,
                  .verification-note,
                  .barcode,
                  .receipt-footer {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                  }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="receipt-header">
                  <div class="logo">CR</div>
                  <h1>COEUS REVIEW CENTER</h1>
                  <h2>Enrollment Receipt</h2>
                </div>
                
                <div class="receipt-body">
                  <div class="receipt-section">
                    <h3>Enrollment Details</h3>
                    <div class="grid">
                      <div class="item">
                        <div class="label">Student ID</div>
                        <div class="value id-value">${receipt.studentId}</div>
                      </div>
                      <div class="item">
                        <div class="label">Enrollment ID</div>
                        <div class="value id-value">${receipt.enrollmentId}</div>
                      </div>
                      <div class="item">
                        <div class="label">Date</div>
                        <div class="value">${receipt.date}</div>
                      </div>
                      <div class="item">
                        <div class="label">Program</div>
                        <div class="value">${receipt.reviewType}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="receipt-section">
                    <h3>Student Information</h3>
                    <div class="grid">
                      <div class="item">
                        <div class="label">Full Name</div>
                        <div class="value">${receipt.name}</div>
                      </div>
                      <div class="item">
                        <div class="label">Email</div>
                        <div class="value">${formData.email}</div>
                      </div>
                      <div class="item">
                        <div class="label">Contact Number</div>
                        <div class="value">${formData.contactNumber}</div>
                      </div>
                      <div class="item">
                        <div class="label">Gender</div>
                        <div class="value">${formData.gender}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="receipt-section">
                    <h3>Address Information</h3>
                    <div class="grid">
                      <div class="item">
                        <div class="label">Address</div>
                        <div class="value">${formData.address}</div>
                      </div>
                      <div class="item">
                        <div class="label">Barangay</div>
                        <div class="value">${formData.barangay}</div>
                      </div>
                      <div class="item">
                        <div class="label">City/Municipality</div>
                        <div class="value">${formData.city}</div>
                      </div>
                      <div class="item">
                        <div class="label">Province</div>
                        <div class="value">${formData.province}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="receipt-section">
                    <h3>Guardian Information</h3>
                    <div class="grid">
                      <div class="item">
                        <div class="label">Guardian Name</div>
                        <div class="value">${formData.guardianFirstName} ${formData.guardianLastName}</div>
                      </div>
                      <div class="item">
                        <div class="label">Contact Number</div>
                        <div class="value">${formData.guardianContact}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="receipt-section">
                    <h3>Program Details</h3>
                    <div class="grid">
                      <div class="item">
                        <div class="label">Program Type</div>
                        <div class="value">${receipt.reviewType}</div>
                      </div>
                      <div class="item">
                        <div class="label">Schedule</div>
                        <div class="value">${formData.programSchedule || 'Standard Schedule'}</div>
                      </div>
                      <div class="item">
                        <div class="label">Start Date</div>
                        <div class="value">${new Date().toLocaleDateString()}</div>
                      </div>
                      <div class="item">
                        <div class="label">Duration</div>
                        <div class="value">6 months</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="receipt-section">
                    <h3>Educational Background</h3>
                    <div class="grid">
                      <div class="item">
                        <div class="label">Course</div>
                        <div class="value">${formData.course}</div>
                      </div>
                      <div class="item">
                        <div class="label">School</div>
                        <div class="value">${formData.schoolName}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="receipt-section">
                    <h3>Payment Details</h3>
                    <div class="payment-info">
                      <div class="label">Program Fee</div>
                      <div class="payment-amount">PHP 25,000.00</div>
                      <div class="grid" style="margin-top: 15px;">
                        <div class="item">
                          <div class="label">Payment Plan</div>
                          <div class="value">${formData.paymentPlan}</div>
                        </div>
                        <div class="item">
                          <div class="label">Payment Method</div>
                          <div class="value">${formData.paymentMethod}</div>
                        </div>
                        <div class="item">
                          <div class="label">Initial Payment</div>
                          <div class="value">PHP ${parseFloat(receipt.amount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="barcode-container">
                    <div class="flex justify-between items-center">
                      <div class="barcode">
                        <svg width="120" height="30">
                          <!-- Simple barcode representation -->
                          ${Array.from({length: 30}, (_, i) => 
                            `<rect x="${i * 6}" y="0" width="${Math.random() > 0.3 ? 3 : 1}" height="50" fill="#000"></rect>`
                          ).join('')}
                        </svg>
                        <div class="barcode-text">${receipt.studentId}</div>
                      </div>
                      
                      <div class="qr-code">
                        <svg width="60" height="60" viewBox="0 0 100 100">
                          <!-- Simple QR code representation -->
                          <rect x="0" y="0" width="100" height="100" fill="white" />
                          ${Array.from({length: 8}, (_, i) => 
                            Array.from({length: 8}, (_, j) => 
                              Math.random() > 0.7 ? 
                                `<rect x="${i * 10 + 10}" y="${j * 10 + 10}" width="10" height="10" fill="black" />` : ''
                            ).join('')
                          ).join('')}
                          <!-- Position markers -->
                          <rect x="10" y="10" width="30" height="30" fill="black" />
                          <rect x="15" y="15" width="20" height="20" fill="white" />
                          <rect x="20" y="20" width="10" height="10" fill="black" />
                          
                          <rect x="60" y="10" width="30" height="30" fill="black" />
                          <rect x="65" y="15" width="20" height="20" fill="white" />
                          <rect x="70" y="20" width="10" height="10" fill="black" />
                          
                          <rect x="10" y="60" width="30" height="30" fill="black" />
                          <rect x="15" y="65" width="20" height="20" fill="white" />
                          <rect x="20" y="70" width="10" height="10" fill="black" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div class="verification-note">
                    Please present this receipt to our staff for verification.
                  </div>
                </div>
                
                <div class="receipt-footer">
                  <p>Coeus Review & Training Specialist, Inc. | Contact: (02) 8123-4567</p>
                </div>
              </div>
              
              <script>
                window.onload = function() { 
                  document.title = 'Coeus Receipt - ${receipt.studentId}';
                  window.print(); 
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
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
                  <option value="Criminologist Review">Criminology Review</option>
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {regions.map(region => (
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
                  {provinces.map(province => (
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
                  {municipalities.map(municipality => (
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
                  {barangays.map(barangay => (
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
              <div>
                <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  id="schoolName"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
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
        
        {/* Step 4: Program and Payment Information */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-800">Program and Payment Information</h3>
            
            <div>
              <label htmlFor="programSchedule" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Schedule
              </label>
              <select
                id="programSchedule"
                name="programSchedule"
                value={formData.programSchedule}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Select preferred schedule</option>
                <option value="Weekday - Morning">Weekday - Morning (8:00 AM - 12:00 PM)</option>
                <option value="Weekday - Afternoon">Weekday - Afternoon (1:00 PM - 5:00 PM)</option>
                <option value="Weekend - Full Day">Weekend - Full Day (8:00 AM - 5:00 PM)</option>
                <option value="Online - Self-paced">Online - Self-paced</option>
              </select>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">Program Fee</h4>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{formData.reviewType} Review Program</span>
                <span className="font-bold text-blue-800">PHP 25,000.00</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Includes review materials, mock exams, and access to online resources
              </div>
            </div>
            
            <div>
              <label htmlFor="paymentPlan" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Plan
              </label>
              <select
                id="paymentPlan"
                name="paymentPlan"
                value={formData.paymentPlan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Select payment plan</option>
                <option value="Full Payment">Full Payment (5% discount)</option>
                <option value="Installment - 2 Payments">Installment - 2 Payments</option>
                <option value="Installment - 3 Payments">Installment - 3 Payments</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Select payment method</option>
                <option value="GCash">GCash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="PayPal">PayPal</option>
                <option value="Credit/Debit Card">Credit/Debit Card</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Initial Payment Amount (PHP)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
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
                disabled={!formData.agreeToTerms}
                className={`px-6 py-3 ${formData.agreeToTerms ? 'bg-blue-700 hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed'} text-white font-medium rounded-lg transition-colors`}
              >
                Enroll Now
              </button>
            </div>
          </div>
        )}
      </form>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl overflow-hidden shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white">
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
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="font-medium">PHP {parseFloat(formData.amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 rounded-lg p-3 inline-block">
                    <svg width="150" height="40">
                      {/* Simple barcode representation */}
                      {Array.from({length: 25}, (_, i) => 
                        <rect key={i} x={i * 6} y="0" width={Math.random() > 0.3 ? 3 : 1} height="40" fill="#000"></rect>
                      )}
                    </svg>
                    <div className="text-center text-xs font-mono mt-1 text-gray-600">{studentId}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handlePrintReceipt}
                  className="w-full px-4 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                  </svg>
                  Print Receipt
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    router.push('/');
                  }}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Return to Home
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