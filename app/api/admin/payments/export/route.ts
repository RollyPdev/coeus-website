import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const status = searchParams.get('status');

    // Build where clause
    const where: any = {};
    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.paymentDate = {};
      if (dateFrom) where.paymentDate.gte = new Date(dateFrom);
      if (dateTo) where.paymentDate.lte = new Date(dateTo);
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        enrollment: {
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                studentId: true,
                email: true,
                contactNumber: true
              }
            }
          }
        }
      },
      orderBy: { paymentDate: 'desc' }
    });

    if (format === 'csv') {
      const csvHeaders = [
        'Transaction ID',
        'Student Name',
        'Student ID',
        'Email',
        'Amount',
        'Payment Method',
        'Payment Date',
        'Status',
        'Receipt Number',
        'Review Type'
      ];

      const csvRows = payments.map(payment => [
        payment.transactionId,
        `${payment.enrollment.student.firstName} ${payment.enrollment.student.lastName}`,
        payment.enrollment.student.studentId,
        payment.enrollment.student.email,
        payment.amount,
        payment.paymentMethod,
        payment.paymentDate.toISOString().split('T')[0],
        payment.status,
        payment.receiptNumber || '',
        payment.enrollment.reviewType
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="payments-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // JSON format
    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Error exporting payments:', error);
    return NextResponse.json(
      { error: 'Failed to export payments' },
      { status: 500 }
    );
  }
}