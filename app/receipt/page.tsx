"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import QRCode from 'qrcode';

interface PaymentReceipt {
  id: string;
  transactionId: string;
  receiptNumber: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  status: string;
  discount?: number;
  tax?: number;
  notes?: string;
  enrollment: {
    reviewType: string;
    batch?: string;
  };
}

function ReceiptContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (paymentId) {
      fetchReceipt();
    }
  }, [paymentId]);

  const fetchReceipt = async () => {
    try {
      // Try multiple search approaches
      let response = await fetch(`/api/admin/payments?search=${paymentId}&limit=1`);
      let data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch receipt');
      }
      
      let payment = data.payments?.[0];
      
      // If not found by search, try to get all payments and find by ID
      if (!payment) {
        response = await fetch('/api/admin/payments?limit=100');
        data = await response.json();
        
        if (response.ok && data.payments) {
          payment = data.payments.find(p => 
            p.id === paymentId || 
            p.transactionId === paymentId || 
            p.receiptNumber === paymentId
          );
        }
      }
      
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      setReceipt(payment);
      
      // Generate QR code with full receipt data
      const receiptData = {
        receiptNumber: payment.receiptNumber,
        transactionId: payment.transactionId,
        studentName: payment.studentName,
        studentId: payment.studentId,
        amount: payment.amount,
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        program: payment.enrollment.reviewType,
        batch: payment.enrollment.batch,
        verifyUrl: `${window.location.origin}/receipt?paymentId=${payment.transactionId}`
      };
      
      const qrCode = await QRCode.toDataURL(JSON.stringify(receiptData), {
        width: 120,
        margin: 2,
        color: {
          dark: '#1e40af',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });
      setQrCodeUrl(qrCode);
    } catch (error) {
      console.error('Error fetching receipt:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch receipt');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const receiptHTML = document.getElementById('receipt-content')?.innerHTML;
    if (receiptHTML) {
      const blob = new Blob([`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Receipt - ${receipt?.receiptNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .receipt { max-width: 600px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .details { margin: 20px 0; }
            .amount { font-size: 24px; font-weight: bold; color: #2563eb; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="receipt">
            ${receiptHTML}
          </div>
        </body>
        </html>
      `], { type: 'text/html' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${receipt?.receiptNumber}.html`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="h-12 w-12 mx-auto mb-4 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-red-600 font-medium mb-2">Receipt not found</p>
          <p className="text-gray-500 text-sm">{error || 'The requested receipt could not be found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6 flex justify-center space-x-4 print:hidden">
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🖨️ Print Receipt
          </button>
          <button
            onClick={handleDownload}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            📄 Download
          </button>
        </div>

        <div id="receipt-content" className="bg-white shadow-lg print:shadow-none relative" style={{
          width: '105mm',
          minHeight: '74mm',
          margin: '0 auto',
          padding: '6mm',
          fontSize: '7px',
          lineHeight: '1.1',
          border: '2px solid #1e40af',
          borderRadius: '4px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }}>
          {/* Security Watermark */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
            backgroundImage: 'url(/logo.png)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '60%'
          }}></div>
          
          {/* Header */}
          <div className="text-center border-b-2 border-blue-800 pb-2 mb-2 relative z-10">
            <div className="flex items-center justify-between mb-1">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
              <div className="text-right">
                <div className="text-xs font-bold text-blue-800">RECEIPT</div>
                <div className="text-xs text-gray-600">#{receipt.receiptNumber}</div>
              </div>
            </div>
            <div className="mb-1">
              <h1 className="text-sm font-bold text-blue-900 leading-tight">COEUS REVIEW & TRAINING</h1>
              <p className="text-xs text-blue-700 font-semibold leading-tight">SPECIALIST, INC.</p>
              <p className="text-xs text-gray-600 leading-tight mt-1">CL Business Center, 2nd Floor, Highway</p>
              <p className="text-xs text-gray-600 leading-tight">Brgy. Punta, Tabuc, Roxas City</p>
              <p className="text-xs text-blue-600 leading-tight font-medium">info@coeusreview.com</p>
            </div>
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-3 py-1 text-xs font-bold rounded-full inline-block">
              ✓ OFFICIAL PAYMENT RECEIPT
            </div>
          </div>

          {/* Transaction Info */}
          <div className="mb-2 bg-gray-50 p-2 rounded border relative z-10">
            <div className="grid grid-cols-3 gap-1 text-xs mb-1">
              <div>
                <span className="font-bold text-blue-800">DATE:</span>
                <div className="font-mono font-semibold">{new Date(receipt.paymentDate).toLocaleDateString('en-US', { 
                  month: '2-digit', day: '2-digit', year: 'numeric' 
                })}</div>
              </div>
              <div>
                <span className="font-bold text-blue-800">TIME:</span>
                <div className="font-mono font-semibold">{new Date(receipt.paymentDate).toLocaleTimeString('en-US', {
                  hour: '2-digit', minute: '2-digit', hour12: true
                })}</div>
              </div>
              <div className="text-right">
                <span className="font-bold text-blue-800">REF:</span>
                <div className="font-mono font-semibold text-xs">{receipt.transactionId.slice(-8)}</div>
              </div>
            </div>
            <div className="border-t border-gray-300 pt-1">
              <span className="font-bold text-xs text-blue-800">TRANSACTION ID:</span>
              <div className="font-mono text-xs break-all bg-white px-1 py-0.5 rounded border">{receipt.transactionId}</div>
            </div>
          </div>

          {/* Student Info */}
          <div className="border border-blue-200 bg-blue-50 p-2 mb-2 rounded relative z-10">
            <div className="text-xs">
              <div className="flex justify-between items-center mb-1 border-b border-blue-200 pb-1">
                <span className="font-bold text-blue-900">STUDENT INFORMATION</span>
                <span className="bg-blue-800 text-white px-2 py-0.5 rounded text-xs font-bold">{receipt.studentId}</span>
              </div>
              <div className="mb-1">
                <span className="font-bold text-blue-800">NAME:</span>
                <div className="font-semibold text-gray-900">{receipt.studentName.toUpperCase()}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-bold text-blue-800">PROGRAM:</span>
                  <div className="font-semibold text-xs">{receipt.enrollment.reviewType}</div>
                </div>
                {receipt.enrollment.batch && (
                  <div>
                    <span className="font-bold text-blue-800">BATCH:</span>
                    <div className="font-semibold text-xs">{receipt.enrollment.batch}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="border-2 border-green-600 bg-green-50 p-2 mb-2 rounded relative z-10">
            <div className="text-center mb-1">
              <span className="bg-green-600 text-white px-2 py-1 text-xs font-bold rounded">💰 PAYMENT SUMMARY</span>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between border-b border-green-200 pb-1">
                <span className="font-bold">Base Amount:</span>
                <span className="font-mono font-bold">₱{(receipt.amount + (receipt.discount || 0) - (receipt.tax || 0)).toLocaleString()}</span>
              </div>
              
              {receipt.discount && receipt.discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span className="font-semibold">💸 Discount Applied:</span>
                  <span className="font-mono font-bold">-₱{receipt.discount.toLocaleString()}</span>
                </div>
              )}
              
              {receipt.tax && receipt.tax > 0 && (
                <div className="flex justify-between text-red-700">
                  <span className="font-semibold">📊 Tax:</span>
                  <span className="font-mono font-bold">+₱{receipt.tax.toLocaleString()}</span>
                </div>
              )}
              
              <div className="border-2 border-green-600 bg-white p-1 rounded mt-2">
                <div className="flex justify-between font-bold text-sm text-green-800">
                  <span>💳 TOTAL PAID:</span>
                  <span className="font-mono text-lg">₱{receipt.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-xs text-blue-800 mt-1 pt-1 border-t border-green-200">
                  <span>💰 BALANCE:</span>
                  <span className="font-mono">
                    {/* Assuming enrollment has totalAmount and totalPaid fields */}
                    ₱{((receipt as any).enrollment?.totalAmount || receipt.amount) - ((receipt as any).enrollment?.totalPaid || receipt.amount) <= 0 ? '0.00' : 
                    (((receipt as any).enrollment?.totalAmount || receipt.amount) - ((receipt as any).enrollment?.totalPaid || receipt.amount)).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-2 pt-1 border-t border-green-200">
                <div>
                  <span className="font-bold text-green-800">METHOD:</span>
                  <div className="font-semibold capitalize text-xs">{receipt.paymentMethod.replace('_', ' ')}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-green-800">STATUS:</span>
                  <div className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${
                    receipt.status === 'completed' ? 'bg-green-600 text-white' :
                    receipt.status === 'pending' ? 'bg-yellow-500 text-white' :
                    'bg-red-600 text-white'
                  }`}>
                    ✓ {receipt.status === 'completed' ? 'PAID' : receipt.status.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code & Verification */}
          <div className="flex justify-between items-center mb-2 relative z-10">
            <div className="text-xs">
              <div className="bg-blue-800 text-white px-2 py-1 rounded font-bold mb-1">🔒 SECURE</div>
              <div className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded border">
                VER: {receipt.transactionId.slice(-6).toUpperCase()}
              </div>
            </div>
            <div className="text-center">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="Receipt QR Code" 
                  className="w-16 h-16 border border-gray-300 rounded"
                  title="Scan to view full receipt details"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-900 text-white flex items-center justify-center text-xs font-bold rounded">
                  QR
                </div>
              )}
              <div className="text-xs mt-1">Scan for Details</div>
            </div>
          </div>
          
          {receipt.notes && (
            <div className="mb-2 p-2 bg-yellow-50 border border-yellow-300 rounded text-xs relative z-10">
              <span className="font-bold text-yellow-800">📝 NOTE:</span>
              <div className="text-yellow-900">{receipt.notes}</div>
            </div>
          )}
          
          {/* Footer */}
          <div className="border-t-2 border-blue-800 pt-2 text-center relative z-10">
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-2 py-1 rounded mb-1">
              <p className="text-xs font-bold">🎉 THANK YOU FOR YOUR PAYMENT! 🎉</p>
            </div>
            <p className="text-xs font-semibold text-blue-800 mb-1">This is your OFFICIAL RECEIPT</p>
            <p className="text-xs text-gray-600 mb-1">📋 Keep this receipt for your records</p>
            <p className="text-xs text-gray-600 mb-1">📞 For support: info@coeusreview.com</p>
            
            <div className="mt-2 pt-1 border-t border-gray-300 bg-gray-50 rounded px-2 py-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Generated:</span>
                <span className="font-mono text-gray-700">{new Date().toLocaleString('en-US', {
                  month: '2-digit', day: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit', hour12: true
                })}</span>
              </div>
              <div className="text-center mt-1">
                <span className="text-xs font-bold text-blue-800">🛡️ AUTHENTIC • VERIFIED • SECURE 🛡️</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ReceiptContent />
    </Suspense>
  );
}