import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const certificate = await prisma.goodMoral.findUnique({
      where: { id: params.id },
      include: {
        student: {
          include: {
            enrollments: {
              select: {
                reviewType: true
              }
            }
          }
        }
      }
    });

    if (!certificate) {
      return new NextResponse('Certificate not found', { status: 404 });
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Good Moral Certificate</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman:wght@400;700&family=Arial:wght@400;500;600&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    @page {
      size: A4 portrait;
      margin: 0;
    }
    
    html, body {
      font-family: 'Times New Roman', serif;
      background: white;
      width: 210mm;
      height: 297mm;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      overflow: hidden;
    }
    
    .certificate {
      width: 210mm;
      height: 297mm;
      position: relative;
      background: 
        repeating-linear-gradient(
          45deg,
          transparent,
          transparent 2mm,
          #f5f5f5 2mm,
          #f5f5f5 2.5mm
        ),
        repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 2mm,
          #f5f5f5 2mm,
          #f5f5f5 2.5mm
        );
      border: 15px solid #8B4513;
      overflow: hidden;
    }
    
    .watermark {
      position: absolute;
      width: 40mm;
      height: 40mm;
      opacity: 0.1;
      transform: rotate(-45deg);
      background-image: url('/logo.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      pointer-events: none;
    }
    
    .watermark-1 { top: 50mm; left: 30mm; }
    .watermark-2 { top: 50mm; right: 30mm; }
    .watermark-3 { top: 120mm; left: 60mm; }
    .watermark-4 { top: 180mm; left: 30mm; }
    .watermark-5 { top: 180mm; right: 30mm; }
    
    .ornamental-border {
      position: absolute;
      top: 8mm;
      left: 8mm;
      right: 8mm;
      bottom: 8mm;
      border: 3px solid #DAA520;
      border-image: repeating-linear-gradient(
        45deg,
        #8B4513,
        #8B4513 5mm,
        #DAA520 5mm,
        #DAA520 10mm
      ) 3;
    }
    
    .inner-border {
      position: absolute;
      top: 10mm;
      left: 10mm;
      right: 10mm;
      bottom: 10mm;
      border: 5px solid #8B4513;
    }
    
    .content {
      position: relative;
      z-index: 10;
      padding: 12mm 12mm;
      font-size: 8pt;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .header {
      text-align: center;
      margin-bottom: 5mm;
    }
    
    .logo {
      width: 25mm;
      height: 25mm;
      margin: 0 auto 8mm;
      border: 2px solid #8B4513;
      border-radius: 50%;
      padding: 2mm;
      background: white;
    }
    
    .logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 50%;
    }
    
    .company-name {
      font-size: 14pt;
      font-weight: bold;
      color: #000;
      margin-bottom: 1mm;
      letter-spacing: 1px;
    }
    
    .company-address {
      font-size: 12pt;
      color: #000;
      margin-bottom: 2mm;
    }
    
    .company-website {
      font-size: 11pt;
      color: #000;
      margin-bottom: 8mm;
    }
    
    .cert-title {
      font-size: 15pt;
      font-weight: bold;
      color: #000;
      letter-spacing: 1px;
      margin-bottom: 3mm;
    }
    
    .body-content {
      flex: 1;
      text-align: justify;
      line-height: 1.2;
      font-size: 7pt;
      color: #000;
      margin: 0 8mm;
    }
    
    .to-whom {
      font-weight: bold;
      margin-bottom: 3mm;
      text-align: left;
      font-size: 12pt;
    }
    
    .certify-text {
      margin-bottom: 3mm;
      font-size: 12pt;
    }
    
    .student-name {
      font-size: 25pt;
      font-weight: bold;
      text-transform: uppercase;
      text-align: center;
      color: #000;
      margin: 3mm 0;
      text-decoration: underline;
      letter-spacing: 1px;
    }
    
    .program-text {
      margin-bottom: 2mm;
      font-size: 12pt;
      text-indent: 10mm;
    }
    
    .moral-character-text {
      margin-bottom: 2mm;
      text-indent: 15mm;
      font-size: 12pt;
    }
    
    .attestation-text {
      margin-bottom: 2mm;
      text-indent: 15mm;
      font-size: 12pt;
    }
    
    .purpose-text {
      margin-bottom: 5mm;
      font-size: 12pt;
    }
    
    .signature-section {
      margin-top: 5mm;
      margin: 5mm 8mm 0 8mm;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 12pt;
    }
    
    .date-section {
      text-align: left;
    }
    
    .signature-block {
      text-align: center;
    }
    
    .signatory-name {
      font-weight: bold;
      font-size: 11pt;
      margin-bottom: 0.5mm;
      text-decoration: underline;
    }
    
    .signatory-title {
      font-size: 10pt;
      color: #000;
    }
    
    .footer {
      margin-top: 8mm;
      text-align: center;
      border-top: 1px solid #ccc;
      padding-top: 3mm;
    }
    
    .footer-company {
      font-weight: bold;
      font-size: 11pt;
      color: #000;
      margin-bottom: 2mm;
    }
    
    .footer-address {
      font-size: 10pt;
      color: #000;
      margin-bottom: 2mm;
    }
    
    .footer-disclaimer {
      font-size: 9pt;
      color: #000;
      font-style: italic;
    }
    
    .codes-section {
      position: absolute;
      top: 15mm;
      right: 15mm;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3mm;
    }
    
    .barcode {
      text-align: center;
    }
    
    .qr-code {
      text-align: center;
    }
    
    .barcode-text {
      font-size: 6pt;
      color: #000;
      margin-top: 1mm;
      font-family: 'Courier New', monospace;
    }
    
    @media print {
      html, body {
        width: 210mm !important;
        height: 297mm !important;
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        overflow: hidden !important;
      }
      
      .certificate {
        width: 210mm !important;
        height: 297mm !important;
        box-shadow: none !important;
        page-break-inside: avoid !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      .barcode svg {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      .barcode svg rect {
        fill: #000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="ornamental-border"></div>
    <div class="inner-border"></div>
    
    <!-- Watermarks -->
    <div class="watermark watermark-1"></div>
    <div class="watermark watermark-2"></div>
    <div class="watermark watermark-3"></div>
    <div class="watermark watermark-4"></div>
    <div class="watermark watermark-5"></div>
    
    <!-- Barcode Section -->
    <div class="codes-section">
      <div class="barcode">
        <svg width="120" height="30">
          <rect width="2" height="30" x="0" fill="#000"/>
          <rect width="1" height="30" x="3" fill="#000"/>
          <rect width="2" height="30" x="5" fill="#000"/>
          <rect width="1" height="30" x="8" fill="#000"/>
          <rect width="3" height="30" x="10" fill="#000"/>
          <rect width="1" height="30" x="14" fill="#000"/>
          <rect width="2" height="30" x="16" fill="#000"/>
          <rect width="1" height="30" x="19" fill="#000"/>
          <rect width="2" height="30" x="21" fill="#000"/>
          <rect width="1" height="30" x="24" fill="#000"/>
          <rect width="3" height="30" x="26" fill="#000"/>
          <rect width="1" height="30" x="30" fill="#000"/>
          <rect width="2" height="30" x="32" fill="#000"/>
          <rect width="1" height="30" x="35" fill="#000"/>
          <rect width="2" height="30" x="37" fill="#000"/>
          <rect width="1" height="30" x="40" fill="#000"/>
          <rect width="3" height="30" x="42" fill="#000"/>
          <rect width="1" height="30" x="46" fill="#000"/>
          <rect width="2" height="30" x="48" fill="#000"/>
          <rect width="1" height="30" x="51" fill="#000"/>
          <rect width="2" height="30" x="53" fill="#000"/>
          <rect width="1" height="30" x="56" fill="#000"/>
          <rect width="3" height="30" x="58" fill="#000"/>
          <rect width="1" height="30" x="62" fill="#000"/>
          <rect width="2" height="30" x="64" fill="#000"/>
          <rect width="1" height="30" x="67" fill="#000"/>
          <rect width="2" height="30" x="69" fill="#000"/>
          <rect width="1" height="30" x="72" fill="#000"/>
          <rect width="3" height="30" x="74" fill="#000"/>
          <rect width="1" height="30" x="78" fill="#000"/>
          <rect width="2" height="30" x="80" fill="#000"/>
          <rect width="1" height="30" x="83" fill="#000"/>
          <rect width="2" height="30" x="85" fill="#000"/>
          <rect width="1" height="30" x="88" fill="#000"/>
          <rect width="3" height="30" x="90" fill="#000"/>
          <rect width="1" height="30" x="94" fill="#000"/>
          <rect width="2" height="30" x="96" fill="#000"/>
          <rect width="1" height="30" x="99" fill="#000"/>
          <rect width="2" height="30" x="101" fill="#000"/>
          <rect width="1" height="30" x="104" fill="#000"/>
          <rect width="3" height="30" x="106" fill="#000"/>
          <rect width="1" height="30" x="110" fill="#000"/>
          <rect width="2" height="30" x="112" fill="#000"/>
          <rect width="1" height="30" x="115" fill="#000"/>
          <rect width="2" height="30" x="117" fill="#000"/>
        </svg>
        <div class="barcode-text">${certificate.certificateNumber}</div>
      </div>
    </div>
    
    <div class="content">
      <!-- Header Section -->
      <div class="header">
        <div class="logo">
          <img src="/logo.png" alt="Coeus Review Center Logo">
        </div>
        <div class="company-name">COEUS REVIEW AND TRAININGS SPECIALIST, INC.</div>
        <div class="company-address">Brgy. Punta Tabuc, Roxas City, Capiz, Philippines</div>
        <div class="company-website">Website: coeus-incorporated.com</div>
        <div class="cert-title">CERTIFICATE OF GOOD MORAL CHARACTER</div>
      </div>
      
      <!-- Body Content -->
      <div class="body-content">
        <div class="to-whom">TO WHOM IT MAY CONCERN:</div>
        
        <div class="certify-text">This is to certify that:</div>
        
        <div class="student-name">${certificate.student.firstName} ${certificate.student.middleInitial ? certificate.student.middleInitial + '. ' : ''}${certificate.student.lastName}</div>
        
        <div class="program-text">was enrolled as a review student at Coeus Review and Trainings Specialist, Inc. for the <strong>${certificate.student.enrollments?.[0]?.reviewType || 'Review Program'}</strong> preparatory course.</div>
        
        <div class="moral-character-text">During the period of enrollment, the above-named student has consistently demonstrated exemplary moral character and personal integrity. They have shown respectful and courteous behavior toward instructors and fellow students, maintaining honest conduct in all academic activities and assessments. The student has adhered to the review center's code of conduct and regulations while making positive contributions to the learning environment, with no record of disciplinary action or misconduct.</div>
        
        <div class="attestation-text">Based on our records and observations, we can attest that <strong>${certificate.student.firstName.toUpperCase()} ${certificate.student.middleInitial ? certificate.student.middleInitial.toUpperCase() + '. ' : ''}${certificate.student.lastName.toUpperCase()}</strong> has maintained high moral standards and has conducted themselves in a manner that reflects good character throughout their enrollment period.</div>
        
        <div class="purpose-text">This certificate is issued upon request for whatever legal or professional purpose it may serve.</div>
      </div>
      
      <!-- Signature Section -->
      <div class="signature-section">
        <div class="date-section">
          <strong>Date Issued:</strong> ${new Date(certificate.issuedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        
        <div class="signature-block">
          <div class="signatory-name">MELQUIADES A. JOLO, RN, RM, LPT</div>
          <div class="signatory-title">CEO/President</div>
        </div>
      </div>
      
      <!-- Footer Section -->
      <div class="footer">
        <div class="footer-company">COEUS REVIEW AND TRAININGS SPECIALIST, INC.</div>
        <div class="footer-address">Brgy. Punta Tabuc, Roxas City, Capiz, Philippines</div>
        <div class="footer-address">Website: coeus-incorporated.com</div>
        <div class="footer-disclaimer">This certificate is issued based on available student records and behavioral observations during the period of enrollment at our review center.</div>
  </div>
  
  <script>window.print();</script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error) {
    console.error('Error fetching certificate for print:', error);
    return new NextResponse('Failed to fetch certificate', { status: 500 });
  }
}