import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';
import JSZip from 'jszip';

// Use direct Prisma client for photo queries
const directPrisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'zip';
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { studentId: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const students = await prisma.student.findMany({
      where,
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        middleInitial: true,
        gender: true,
        age: true,
        birthday: true,
        birthPlace: true,
        contactNumber: true,
        email: true,
        address: true,
        region: true,
        province: true,
        city: true,
        barangay: true,
        zipCode: true,
        guardianFirstName: true,
        guardianLastName: true,
        guardianContact: true,
        guardianAddress: true,
        relationship: true,
        schoolName: true,
        course: true,
        yearGraduated: true,
        howDidYouHear: true,
        referredBy: true,
        status: true,
        createdAt: true,
        photo: true,
        photoUrl: true,
        enrollments: {
          select: {
            enrollmentId: true,
            reviewType: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: { lastName: 'asc' }
    });

    if (format === 'csv') {
      const csvHeaders = [
        'Student ID',
        'First Name',
        'Last Name',
        'Middle Initial',
        'Gender',
        'Age',
        'Birthday',
        'Birth Place',
        'Contact Number',
        'Email',
        'Address',
        'Region',
        'Province',
        'City',
        'Barangay',
        'Zip Code',
        'Guardian First Name',
        'Guardian Last Name',
        'Guardian Contact',
        'Guardian Address',
        'Relationship',
        'School Name',
        'Course',
        'Year Graduated',
        'How Did You Hear',
        'Referred By',
        'Status',
        'Registration Date',
        'Enrollments'
      ];

      const csvRows = students.map(student => [
        student.studentId,
        student.firstName,
        student.lastName,
        student.middleInitial || '',
        student.gender || '',
        student.age || '',
        student.birthday ? new Date(student.birthday).toISOString().split('T')[0] : '',
        student.birthPlace || '',
        student.contactNumber || '',
        student.email || '',
        student.address || '',
        student.region || '',
        student.province || '',
        student.city || '',
        student.barangay || '',
        student.zipCode || '',
        student.guardianFirstName || '',
        student.guardianLastName || '',
        student.guardianContact || '',
        student.guardianAddress || '',
        student.relationship || '',
        student.schoolName || '',
        student.course || '',
        student.yearGraduated || '',
        student.howDidYouHear || '',
        student.referredBy || '',
        student.status,
        student.createdAt.toISOString().split('T')[0],
        student.enrollments.map(e => `${e.reviewType} (${e.status})`).join('; ')
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="students-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    if (format === 'zip') {
      const zip = new JSZip();
      
      // Create CSV file
      const csvHeaders = [
        'Student ID',
        'First Name',
        'Last Name',
        'Middle Initial',
        'Gender',
        'Age',
        'Birthday',
        'Birth Place',
        'Contact Number',
        'Email',
        'Address',
        'Region',
        'Province',
        'City',
        'Barangay',
        'Zip Code',
        'Guardian First Name',
        'Guardian Last Name',
        'Guardian Contact',
        'Guardian Address',
        'Relationship',
        'School Name',
        'Course',
        'Year Graduated',
        'How Did You Hear',
        'Referred By',
        'Status',
        'Registration Date',
        'Enrollments',
        'Photo File',
        'QR Code File'
      ];

      const csvRows = students.map(student => [
        student.studentId,
        student.firstName,
        student.lastName,
        student.middleInitial || '',
        student.gender || '',
        student.age || '',
        student.birthday ? new Date(student.birthday).toISOString().split('T')[0] : '',
        student.birthPlace || '',
        student.contactNumber || '',
        student.email || '',
        student.address || '',
        student.region || '',
        student.province || '',
        student.city || '',
        student.barangay || '',
        student.zipCode || '',
        student.guardianFirstName || '',
        student.guardianLastName || '',
        student.guardianContact || '',
        student.guardianAddress || '',
        student.relationship || '',
        student.schoolName || '',
        student.course || '',
        student.yearGraduated || '',
        student.howDidYouHear || '',
        student.referredBy || '',
        student.status,
        student.createdAt.toISOString().split('T')[0],
        student.enrollments.map(e => `${e.reviewType} (${e.status})`).join('; '),
        `photos/${student.studentId}_photo.jpg`,
        `qr-codes/${student.studentId}_qr.png`
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      zip.file('students_data.csv', csvContent);

      // Create README file
      const readmeContent = `COEUS STUDENT DATA EXPORT
========================

Export Date: ${new Date().toISOString()}
Total Students: ${students.length}
Filters Applied: ${status && status !== 'all' ? `Status: ${status}` : 'None'}${search ? `, Search: "${search}"` : ''}

FILE STRUCTURE:
--------------
📄 students_data.csv - Complete student information in CSV format
📁 photos/ - Student photos (JPG format)
   - [StudentID]_photo.jpg - Student photo
   - [StudentID]_no_photo.txt - Placeholder for missing photos
📁 qr-codes/ - QR codes for each student (PNG format)
   - [StudentID]_qr.png - QR code containing student information
   - [StudentID]_qr_data.txt - QR data in text format (fallback)

QR CODE CONTENT:
---------------
Each QR code contains JSON data with:
- Student ID
- Full Name
- Email Address
- Course/Program

NOTES:
------
- Photos are saved in JPG format for compatibility
- QR codes are 300x300 pixels for optimal scanning
- Missing photos are indicated with text files
- All data is exported as of the export date above

For technical support, contact the system administrator.
`;
      
      zip.file('README.txt', readmeContent);

      // Create photos folder
      const photosFolder = zip.folder('photos');
      const qrFolder = zip.folder('qr-codes');

      // Process each student
      for (const student of students) {
        try {
          // Add student photo if exists
          let photoAdded = false;
          try {
            // Get photo data directly from database
            const studentPhoto = await directPrisma.student.findUnique({
              where: { id: student.id },
              select: { photo: true, photoUrl: true }
            });
            
            if (studentPhoto?.photo) {
              let photoBuffer;
              if (studentPhoto.photo.startsWith('data:')) {
                // Base64 encoded photo
                const base64Data = studentPhoto.photo.split(',')[1];
                photoBuffer = Buffer.from(base64Data, 'base64');
                photosFolder?.file(`${student.studentId}_photo.jpg`, photoBuffer);
                photoAdded = true;
              }
            }
          } catch (photoError) {
            console.warn(`Error processing photo for student ${student.studentId}:`, photoError);
          }
          
          // If no photo was added, create a placeholder
          if (!photoAdded) {
            const placeholderText = `No Photo Available\n${student.firstName} ${student.lastName}\n${student.studentId}`;
            photosFolder?.file(`${student.studentId}_no_photo.txt`, placeholderText);
          }

          // Generate and add QR code with student info
          const qrData = JSON.stringify({
            studentId: student.studentId,
            name: `${student.firstName} ${student.lastName}`,
            email: student.email,
            course: student.course
          });
          
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&data=${encodeURIComponent(qrData)}`;
          try {
            const qrResponse = await fetch(qrCodeUrl);
            if (qrResponse.ok) {
              const qrBuffer = await qrResponse.arrayBuffer();
              qrFolder?.file(`${student.studentId}_qr.png`, qrBuffer);
            } else {
              // Fallback: create a simple text file with QR data
              qrFolder?.file(`${student.studentId}_qr_data.txt`, qrData);
            }
          } catch (qrError) {
            console.warn(`Could not generate QR code for student ${student.studentId}:`, qrError);
            // Fallback: create a simple text file with QR data
            qrFolder?.file(`${student.studentId}_qr_data.txt`, qrData);
          }
        } catch (error) {
          console.error(`Error processing files for student ${student.studentId}:`, error);
        }
      }

      // Generate ZIP file
      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

      return new NextResponse(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="students-export-${new Date().toISOString().split('T')[0]}.zip"`
        }
      });
    }

    // JSON format
    return NextResponse.json({ students });
  } catch (error) {
    console.error('Error exporting students:', error);
    return NextResponse.json(
      { error: 'Failed to export students' },
      { status: 500 }
    );
  }
}