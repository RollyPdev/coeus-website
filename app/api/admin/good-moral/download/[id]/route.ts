import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jsPDF from 'jspdf';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const certificate = await prisma.goodMoral.findUnique({
      where: { id },
      include: {
        student: true
      }
    });

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set up the certificate design
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Add border
    pdf.setLineWidth(2);
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
    
    // Add inner border
    pdf.setLineWidth(0.5);
    pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);
    
    // Header
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('COEUS REVIEW & TRAINING SPECIALIST, INC.', pageWidth / 2, 35, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('CL Business Center, 2nd Floor, Highway, Brgy. Punta Tabuc, Roxas City, Capiz, Philippines', pageWidth / 2, 45, { align: 'center' });
    
    // Certificate Title
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CERTIFICATE OF GOOD MORAL CHARACTER', pageWidth / 2, 70, { align: 'center' });
    
    // Certificate Number
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Certificate No: ${certificate.certificateNumber}`, pageWidth / 2, 85, { align: 'center' });
    
    // Main content
    pdf.setFontSize(14);
    pdf.text('This is to certify that', pageWidth / 2, 110, { align: 'center' });
    
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${certificate.student.firstName} ${certificate.student.lastName}`, pageWidth / 2, 125, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Student ID: ${certificate.student.studentId}`, pageWidth / 2, 135, { align: 'center' });
    
    pdf.setFontSize(14);
    const mainText = `has demonstrated good moral character and conduct during their\nenrollment at Coeus Review & Training Specialist, Inc.`;
    pdf.text(mainText, pageWidth / 2, 155, { align: 'center' });
    
    // Purpose
    pdf.setFontSize(12);
    pdf.text(`Purpose: ${certificate.purpose}`, pageWidth / 2, 180, { align: 'center' });
    
    // Remarks if any
    if (certificate.remarks) {
      pdf.text(`Remarks: ${certificate.remarks}`, pageWidth / 2, 190, { align: 'center' });
    }
    
    // Dates and status
    pdf.text(`Date Issued: ${new Date(certificate.issuedDate).toLocaleDateString()}`, pageWidth / 2, 210, { align: 'center' });
    pdf.text(`Valid Until: ${new Date(certificate.validUntil).toLocaleDateString()}`, pageWidth / 2, 220, { align: 'center' });
    pdf.text(`Status: ${certificate.status.toUpperCase()}`, pageWidth / 2, 230, { align: 'center' });
    
    // Signature section
    pdf.setFontSize(12);
    pdf.text('Issued by:', 40, 260);
    
    // Add CEO signature image
    try {
      const signatureResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/ceo_signature.png`);
      if (signatureResponse.ok) {
        const signatureBuffer = await signatureResponse.arrayBuffer();
        const signatureBase64 = Buffer.from(signatureBuffer).toString('base64');
        pdf.addImage(`data:image/png;base64,${signatureBase64}`, 'PNG', 35, 265, 40, 15);
      }
    } catch (error) {
      console.log('Signature image not found, continuing without it');
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('MELQUIADES A. JOLO, RN, RM, LPT', 40, 285);
    pdf.setFont('helvetica', 'normal');
    pdf.text('CEO/President', 40, 295);
    
    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="good-moral-${certificate.certificateNumber}.pdf"`
      }
    });
  } catch (error) {
    console.error('Error generating PDF certificate:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF certificate' },
      { status: 500 }
    );
  }
}