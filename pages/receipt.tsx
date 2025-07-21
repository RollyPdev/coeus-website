import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import '../styles/receipt-styles.css';

const ReceiptPage = () => {
  const router = useRouter();
  const [receipt, setReceipt] = useState(null);
  const [formData, setFormData] = useState<any>(null);
  const [barcodeDataUrl, setBarcodeDataUrl] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get receipt and form data from localStorage
    const receiptData = window.localStorage.getItem('enrollmentReceipt');
    const formDataData = window.localStorage.getItem('enrollmentFormData');
    if (!receiptData) {
      setLoading(false);
      setReceipt(null);
      return;
    }
    setReceipt(JSON.parse(receiptData));
    if (formDataData) setFormData(JSON.parse(formDataData));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (receipt && receipt.studentId && receipt.enrollmentId) {
      // Barcode
      const barcodeCanvas = document.createElement('canvas');
      JsBarcode(barcodeCanvas, receipt.studentId, { format: 'CODE128', width: 2, height: 40, displayValue: false });
      setBarcodeDataUrl(barcodeCanvas.toDataURL('image/png'));
      // QR Code
      QRCode.toDataURL(`${receipt.studentId}-${receipt.enrollmentId}`, { width: 128, margin: 1 }).then(setQrDataUrl);
    }
  }, [receipt]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    
    setDownloading(true);
    try {
      // Create a clone of the receipt element to avoid modifying the visible one
      const receiptClone = receiptRef.current.cloneNode(true) as HTMLElement;
      receiptClone.classList.add('receipt-container');
      
      // Temporarily append the clone to the document
      receiptClone.style.position = 'absolute';
      receiptClone.style.left = '-9999px';
      receiptClone.style.top = '-9999px';
      document.body.appendChild(receiptClone);
      
      // Remove any print-only styles for the PDF
      const printHiddenElements = receiptClone.querySelectorAll('.print\\:hidden');
      printHiddenElements.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      
      const canvas = await html2canvas(receiptClone, {
        scale: 3, // Higher resolution for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        removeContainer: true
      });
      
      // Remove the clone from the document
      document.body.removeChild(receiptClone);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate dimensions to center the receipt on the page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Center the image on the page
      const x = 10; // 10mm from left edge
      const y = (pdfHeight - imgHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`COEUS_Receipt_${receipt.studentId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!receipt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">No Receipt Found</h2>
        <p className="mb-6">You must complete an enrollment to view your receipt.</p>
        <button onClick={() => window.close()} className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium">Close</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 print:bg-white">
      <div ref={receiptRef} className="bg-white rounded-xl shadow-lg max-w-lg w-full p-8 print:shadow-none print:max-w-full print:p-4">
        <div className="text-center mb-6">
          <div className="logo mx-auto mb-2 w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-2xl">CR</div>
          <h1 className="text-2xl font-bold text-blue-900">COEUS REVIEW CENTER</h1>
          <div className="text-sm text-blue-700">Official Enrollment Receipt</div>
        </div>
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="font-semibold text-gray-500">Student ID:</span> {receipt.studentId}</div>
            <div><span className="font-semibold text-gray-500">Enrollment ID:</span> {receipt.enrollmentId}</div>
            <div><span className="font-semibold text-gray-500">Date:</span> {receipt.date}</div>
            <div><span className="font-semibold text-gray-500">Program:</span> {receipt.reviewType}</div>
          </div>
        </div>
        <div className="mb-4">
          <div className="font-semibold text-blue-800 mb-1">Student Details</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-gray-500">Full Name:</span> {receipt.name}</div>
            <div><span className="text-gray-500">Contact:</span> {formData?.contactNumber || 'N/A'}</div>
            <div><span className="text-gray-500">Email:</span> {formData?.email || 'N/A'}</div>
            <div><span className="text-gray-500">Schedule:</span> {formData?.programSchedule || 'Standard'}</div>
          </div>
        </div>
        <div className="mb-4">
          <div className="font-semibold text-blue-800 mb-1">Payment</div>
          <div className="flex justify-between text-sm">
            <span>Initial Payment</span>
            <span className="font-bold text-blue-900">₱{parseFloat(receipt.amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>Total Program Fee: ₱25,000.00</span>
            <span>Method: {formData?.paymentMethod || 'Cash'}</span>
          </div>
        </div>
        <div className="flex justify-center items-center space-x-8 my-6">
          {barcodeDataUrl && (
            <div className="text-center">
              <img src={barcodeDataUrl} alt="Barcode" width={150} height={40} className="mx-auto bg-white rounded" />
              <div className="text-xs font-mono mt-1 text-gray-600">{receipt.studentId}</div>
            </div>
          )}
          {qrDataUrl && (
            <div className="text-center">
              <img src={qrDataUrl} alt="QR Code" width={63} height={63} className="mx-auto bg-white rounded" />
            </div>
          )}
        </div>
        <div className="text-center mt-6 print:hidden">
          <div className="flex justify-center space-x-4 mb-4">
            <button onClick={handlePrint} className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium">Print Receipt</button>
            <button 
              onClick={handleDownload} 
              disabled={downloading}
              className={`px-6 py-3 ${downloading ? 'bg-green-500' : 'bg-green-700'} text-white rounded-lg font-medium flex items-center justify-center min-w-[160px]`}
            >
              {downloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Download Receipt'}
            </button>
          </div>
          <button onClick={() => window.close()} className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage; 