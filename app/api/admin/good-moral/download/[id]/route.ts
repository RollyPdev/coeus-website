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

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Add ornamental border
    pdf.setLineWidth(3);
    pdf.setDrawColor(139, 69, 19); // Brown color
    pdf.rect(8, 8, pageWidth - 16, pageHeight - 16);
    
    // Add inner border
    pdf.setLineWidth(5);
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
    
    // Add logo circle
    pdf.setLineWidth(2);
    pdf.circle(pageWidth / 2, 35, 12);
    
    // Header
    pdf.setFontSize(14);
    pdf.setFont('times', 'bold');
    pdf.text('COEUS REVIEW AND TRAININGS SPECIALIST, INC.', pageWidth / 2, 55, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont('times', 'normal');
    pdf.text('CL Business Center, 2nd Floor, Highway, Brgy. Punta Tabuc, Roxas City, Capiz, Philippines', pageWidth / 2, 62, { align: 'center' });
    pdf.text('Website: coeus-incorporated.com', pageWidth / 2, 68, { align: 'center' });
    
    // Certificate Title
    pdf.setFontSize(15);
    pdf.setFont('times', 'bold');
    pdf.text('CERTIFICATE OF GOOD MORAL CHARACTER', pageWidth / 2, 80, { align: 'center' });
    
    // Barcode area (simplified)
    pdf.setFontSize(6);
    pdf.text(certificate.certificateNumber, pageWidth - 25, 20, { align: 'center' });
    
    // Main content
    pdf.setFontSize(12);
    pdf.setFont('times', 'bold');
    pdf.text('TO WHOM IT MAY CONCERN:', 20, 100);
    
    pdf.setFontSize(12);
    pdf.setFont('times', 'normal');
    pdf.text('This is to certify that:', 20, 110);
    
    // Student name (large and bold)
    pdf.setFontSize(25);
    pdf.setFont('times', 'bold');
    const studentName = `${certificate.student.firstName} ${certificate.student.middleInitial ? certificate.student.middleInitial + '. ' : ''}${certificate.student.lastName}`;
    pdf.text(studentName.toUpperCase(), pageWidth / 2, 125, { align: 'center' });
    
    // Main body text
    pdf.setFontSize(12);
    pdf.setFont('times', 'normal');
    const reviewType = certificate.student.enrollments?.[0]?.reviewType || 'Review Program';
    pdf.text(`was enrolled as a review student at Coeus Review and Trainings Specialist, Inc. for the ${reviewType}`, 20, 140, { maxWidth: pageWidth - 40 });
    pdf.text('preparatory course.', 20, 148);
    
    pdf.text('During the period of enrollment, the above-named student has consistently demonstrated', 20, 160, { maxWidth: pageWidth - 40 });
    pdf.text('exemplary moral character and personal integrity. They have shown respectful and courteous', 20, 168, { maxWidth: pageWidth - 40 });
    pdf.text('behavior toward instructors and fellow students, maintaining honest conduct in all academic', 20, 176, { maxWidth: pageWidth - 40 });
    pdf.text('activities and assessments. The student has adhered to the review center\'s code of conduct', 20, 184, { maxWidth: pageWidth - 40 });
    pdf.text('and regulations while making positive contributions to the learning environment, with no', 20, 192, { maxWidth: pageWidth - 40 });
    pdf.text('record of disciplinary action or misconduct.', 20, 200);
    
    pdf.text(`Based on our records and observations, we can attest that ${studentName.toUpperCase()}`, 20, 212, { maxWidth: pageWidth - 40 });
    pdf.text('has maintained high moral standards and has conducted themselves in a manner that reflects', 20, 220, { maxWidth: pageWidth - 40 });
    pdf.text('good character throughout their enrollment period.', 20, 228);
    
    pdf.text('This certificate is issued upon request for whatever legal or professional purpose it may serve.', 20, 240, { maxWidth: pageWidth - 40 });
    
    // Date and signature section
    pdf.setFont('times', 'bold');
    pdf.text(`Date Issued: ${new Date(certificate.issuedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 20, 260);
    
    // Add CEO signature image
    try {
      const signatureResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/ceo_signature.png`);
      if (signatureResponse.ok) {
        const signatureBuffer = await signatureResponse.arrayBuffer();
        const signatureBase64 = Buffer.from(signatureBuffer).toString('base64');
        pdf.addImage(`data:image/png;base64,${signatureBase64}`, 'PNG', 130, 255, 40, 15);
      }
    } catch (error) {
      console.log('Signature image not found, continuing without it');
    }
    
    pdf.setFont('times', 'bold');
    pdf.text('MELQUIADES A. JOLO, RN, RM, LPT', 150, 275);
    pdf.setFont('times', 'normal');
    pdf.text('CEO/President', 150, 282);
    
    // Footer
    pdf.setLineWidth(0.5);
    pdf.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);
    
    pdf.setFontSize(11);
    pdf.setFont('times', 'bold');
    pdf.text('COEUS REVIEW AND TRAININGS SPECIALIST, INC.', pageWidth / 2, pageHeight - 22, { align: 'center' });
    pdf.setFont('times', 'normal');
    pdf.text('CL Business Center, 2nd Floor, Highway, Brgy. Punta Tabuc, Roxas City, Capiz, Philippines', pageWidth / 2, pageHeight - 18, { align: 'center' });
    pdf.text('Website: coeus-incorporated.com', pageWidth / 2, pageHeight - 14, { align: 'center' });
    
    pdf.setFontSize(9);
    pdf.setFont('times', 'italic');
    pdf.text('This certificate is issued based on available student records and behavioral observations during the period of enrollment at our review center.', pageWidth / 2, pageHeight - 8, { align: 'center', maxWidth: pageWidth - 40 });
    
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