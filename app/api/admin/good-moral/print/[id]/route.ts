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
        student: true
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
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: bold; color: #d97706; }
    .title { font-size: 28px; font-weight: bold; margin: 20px 0; }
    .content { line-height: 1.8; font-size: 16px; }
    .cert-number { font-weight: bold; color: #059669; }
    .footer { margin-top: 60px; text-align: center; font-size: 14px; color: #666; }
    @media print { body { margin: 0; padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">COEUS REVIEW & TRAINING SPECIALIST, INC.</div>
    <div>Roxas City, Capiz</div>
    <div class="title">GOOD MORAL CERTIFICATE</div>
  </div>
  
  <div class="content">
    <p><strong>Certificate Number:</strong> <span class="cert-number">${certificate.certificateNumber}</span></p>
    <p><strong>Date Issued:</strong> ${new Date(certificate.issuedDate).toLocaleDateString()}</p>
    
    <p style="margin: 30px 0;">This is to certify that <strong>${certificate.student.firstName} ${certificate.student.lastName}</strong> (Student ID: <strong>${certificate.student.studentId}</strong>) has demonstrated good moral character during their enrollment at Coeus Review & Training Specialist, Inc.</p>
    
    <p><strong>Purpose:</strong> ${certificate.purpose}</p>
    <p><strong>Valid Until:</strong> ${new Date(certificate.validUntil).toLocaleDateString()}</p>
    <p><strong>Status:</strong> ${certificate.status.toUpperCase()}</p>
    ${certificate.remarks ? `<p><strong>Remarks:</strong> ${certificate.remarks}</p>` : ''}
    
    <p style="margin-top: 40px;"><strong>Issued by:</strong> ${certificate.issuedBy}</p>
  </div>
  
  <div class="footer">
    <p>This certificate is valid for official use.</p>
    <p>Coeus Review & Training Specialist, Inc. | Roxas City, Capiz</p>
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