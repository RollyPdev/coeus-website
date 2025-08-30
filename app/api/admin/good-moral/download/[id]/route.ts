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
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    const certificateContent = `
GOOD MORAL CERTIFICATE

Certificate Number: ${certificate.certificateNumber}
Date Issued: ${new Date(certificate.issuedDate).toLocaleDateString()}

This is to certify that ${certificate.student.firstName} ${certificate.student.lastName} 
(Student ID: ${certificate.student.studentId}) has demonstrated good moral character 
during their enrollment at Coeus Review & Training Specialist, Inc.

Purpose: ${certificate.purpose}
Valid Until: ${new Date(certificate.validUntil).toLocaleDateString()}
Status: ${certificate.status.toUpperCase()}

${certificate.remarks ? `Remarks: ${certificate.remarks}` : ''}

Issued by: ${certificate.issuedBy}
Coeus Review & Training Specialist, Inc.
Roxas City, Capiz
    `.trim();

    return new NextResponse(certificateContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="good-moral-${certificate.certificateNumber}.txt"`
      }
    });
  } catch (error) {
    console.error('Error downloading certificate:', error);
    return NextResponse.json(
      { error: 'Failed to download certificate' },
      { status: 500 }
    );
  }
}