import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'enrollment';
    const format = searchParams.get('format') || 'csv';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      };
    }

    let data: any[];
    let filename: string;
    let headers: string[];

    switch (reportType) {
      case 'enrollment':
        data = await getEnrollmentData(dateFilter);
        headers = ['Enrollment ID', 'Student Name', 'Student ID', 'Program', 'Status', 'Payment Status', 'Amount', 'Date', 'Batch'];
        filename = `enrollment-report-${new Date().toISOString().split('T')[0]}`;
        break;
      
      case 'attendance':
        data = await getAttendanceData(dateFilter);
        headers = ['Student Name', 'Student ID', 'Date', 'Status', 'Remarks', 'Program'];
        filename = `attendance-report-${new Date().toISOString().split('T')[0]}`;
        break;
      
      case 'financial':
        data = await getFinancialData(dateFilter);
        headers = ['Transaction ID', 'Student Name', 'Amount', 'Payment Method', 'Status', 'Date', 'Receipt Number', 'Program'];
        filename = `financial-report-${new Date().toISOString().split('T')[0]}`;
        break;
      
      case 'student':
        data = await getStudentData(dateFilter);
        headers = ['Student ID', 'Name', 'Email', 'Contact', 'Status', 'Program', 'Registration Date', 'Attendance Rate'];
        filename = `student-report-${new Date().toISOString().split('T')[0]}`;
        break;
      
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    if (format === 'json') {
      return NextResponse.json({
        data,
        headers,
        metadata: {
          reportType,
          generatedAt: new Date().toISOString(),
          totalRecords: data.length,
          dateRange: startDate && endDate ? { startDate, endDate } : null
        }
      });
    }

    // Generate CSV
    const csvContent = generateCSV(data, headers);
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}.csv"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Error exporting report:', error);
    return NextResponse.json(
      { error: 'Failed to export report' },
      { status: 500 }
    );
  }
}

async function getEnrollmentData(dateFilter: any) {
  const enrollments = await prisma.enrollment.findMany({
    where: dateFilter,
    include: {
      student: {
        select: {
          firstName: true,
          lastName: true,
          studentId: true
        }
      },
      program: {
        select: {
          title: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return enrollments.map(enrollment => [
    enrollment.enrollmentId,
    `${enrollment.student.firstName} ${enrollment.student.lastName}`,
    enrollment.student.studentId,
    enrollment.program?.title || enrollment.reviewType,
    enrollment.status,
    enrollment.paymentStatus,
    enrollment.amount,
    enrollment.createdAt.toLocaleDateString(),
    enrollment.batch || 'N/A'
  ]);
}

async function getAttendanceData(dateFilter: any) {
  const attendances = await prisma.attendance.findMany({
    where: dateFilter,
    include: {
      student: {
        select: {
          firstName: true,
          lastName: true,
          studentId: true,
          enrollments: {
            select: { reviewType: true },
            take: 1
          }
        }
      }
    },
    orderBy: { date: 'desc' }
  });

  return attendances.map(attendance => [
    `${attendance.student.firstName} ${attendance.student.lastName}`,
    attendance.student.studentId,
    attendance.date.toLocaleDateString(),
    attendance.status,
    attendance.remarks || 'N/A',
    attendance.student.enrollments[0]?.reviewType || 'N/A'
  ]);
}

async function getFinancialData(dateFilter: any) {
  const payments = await prisma.payment.findMany({
    where: { ...dateFilter },
    include: {
      enrollment: {
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              studentId: true
            }
          },
          program: {
            select: {
              title: true
            }
          }
        }
      }
    },
    orderBy: { paymentDate: 'desc' }
  });

  return payments.map(payment => [
    payment.transactionId,
    `${payment.enrollment.student.firstName} ${payment.enrollment.student.lastName}`,
    payment.amount,
    payment.paymentMethod,
    payment.status,
    payment.paymentDate.toLocaleDateString(),
    payment.receiptNumber || 'N/A',
    payment.enrollment.program?.title || payment.enrollment.reviewType
  ]);
}

async function getStudentData(dateFilter: any) {
  const students = await prisma.student.findMany({
    where: dateFilter,
    include: {
      enrollments: {
        select: {
          reviewType: true,
          program: {
            select: { title: true }
          }
        },
        take: 1
      },
      attendances: {
        select: { status: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return students.map(student => {
    const attendanceRate = student.attendances.length > 0 
      ? ((student.attendances.filter(a => a.status === 'present').length / student.attendances.length) * 100).toFixed(1)
      : 'N/A';

    return [
      student.studentId,
      `${student.firstName} ${student.lastName}`,
      student.email,
      student.contactNumber,
      student.status,
      student.enrollments[0]?.program?.title || student.enrollments[0]?.reviewType || 'N/A',
      student.createdAt.toLocaleDateString(),
      attendanceRate + '%'
    ];
  });
}

function generateCSV(data: any[][], headers: string[]): string {
  const csvRows = [headers];
  csvRows.push(...data);
  
  return csvRows
    .map(row => 
      row.map(field => {
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        const fieldStr = String(field || '');
        if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
          return `"${fieldStr.replace(/"/g, '""')}"`;
        }
        return fieldStr;
      }).join(',')
    )
    .join('\n');
}