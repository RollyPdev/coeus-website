import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('paymentMethod');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'paymentDate';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (status) where.status = status;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (dateFrom || dateTo) {
      where.paymentDate = {};
      if (dateFrom) where.paymentDate.gte = new Date(dateFrom);
      if (dateTo) where.paymentDate.lte = new Date(dateTo);
    }
    if (search) {
      where.OR = [
        { transactionId: { contains: search, mode: 'insensitive' } },
        { receiptNumber: { contains: search, mode: 'insensitive' } },
        { enrollment: { student: { firstName: { contains: search, mode: 'insensitive' } } } },
        { enrollment: { student: { lastName: { contains: search, mode: 'insensitive' } } } },
        { enrollment: { student: { studentId: { contains: search, mode: 'insensitive' } } } }
      ];
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
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
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit
      }),
      prisma.payment.count({ where })
    ]);

    // Get analytics data
    const analytics = await getPaymentAnalytics();

    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      transactionId: payment.transactionId,
      studentName: `${payment.enrollment.student.firstName} ${payment.enrollment.student.lastName}`,
      studentId: payment.enrollment.student.studentId,
      studentEmail: payment.enrollment.student.email,
      studentContact: payment.enrollment.student.contactNumber,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentDate: payment.paymentDate.toISOString(),
      status: payment.status,
      receiptNumber: payment.receiptNumber,
      notes: payment.notes,
      enrollmentId: payment.enrollmentId,
      enrollment: {
        id: payment.enrollment.id,
        reviewType: payment.enrollment.reviewType,
        batch: payment.enrollment.batch,
        startDate: payment.enrollment.startDate?.toISOString(),
        student: payment.enrollment.student
      },
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString()
    }));

    return NextResponse.json({ 
      payments: formattedPayments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      analytics
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

async function getPaymentAnalytics() {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const [totalRevenue, monthlyRevenue, yearlyRevenue, statusCounts, methodCounts] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: 'completed' },
      _sum: { amount: true }
    }),
    prisma.payment.aggregate({
      where: { 
        status: 'completed',
        paymentDate: { gte: startOfMonth }
      },
      _sum: { amount: true }
    }),
    prisma.payment.aggregate({
      where: { 
        status: 'completed',
        paymentDate: { gte: startOfYear }
      },
      _sum: { amount: true }
    }),
    prisma.payment.groupBy({
      by: ['status'],
      _count: { status: true }
    }),
    prisma.payment.groupBy({
      by: ['paymentMethod'],
      _count: { paymentMethod: true }
    })
  ]);

  return {
    totalRevenue: totalRevenue._sum.amount || 0,
    monthlyRevenue: monthlyRevenue._sum.amount || 0,
    yearlyRevenue: yearlyRevenue._sum.amount || 0,
    statusDistribution: statusCounts,
    methodDistribution: methodCounts
  };
}

export async function POST(request: Request) {
  try {
    const { 
      studentId, 
      enrollmentId, 
      amount, 
      paymentMethod, 
      paymentGateway,
      dueDate,
      discount = 0,
      tax = 0,
      notes,
      installmentPlan
    } = await request.json();

    // Convert amount to number and validate required fields
    const numericAmount = parseFloat(amount);
    if (!studentId || !amount || isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: 'Missing required fields or invalid amount' },
        { status: 400 }
      );
    }

    // Get student info
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        firstName: true,
        lastName: true,
        studentId: true,
        email: true,
        contactNumber: true
      }
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Handle enrollment - create if not provided
    let finalEnrollmentId = enrollmentId;
    if (!enrollmentId) {
      // Generate unique enrollment ID
      const enrollmentIdStr = `ENR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Create a default enrollment for the student
      const enrollment = await prisma.enrollment.create({
        data: {
          enrollmentId: enrollmentIdStr,
          studentId,
          reviewType: 'Criminology Review',
          batch: 'Default',
          startDate: new Date(),
          paymentMethod: paymentMethod || 'cash',
          amount: numericAmount,
          paymentStatus: 'pending',
          status: 'pending'
        }
      });
      finalEnrollmentId = enrollment.id;
    }

    // Calculate final amount with discount and tax
    const discountAmount = (numericAmount * discount) / 100;
    const taxAmount = ((numericAmount - discountAmount) * tax) / 100;
    const finalAmount = numericAmount - discountAmount + taxAmount;

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Create payment record with transaction
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          transactionId,
          enrollmentId: finalEnrollmentId,
          amount: finalAmount,
          paymentMethod: paymentMethod || 'cash',
          paymentDate: new Date(),
          status: 'completed',
          receiptNumber: `RCT-${Date.now()}`,
          notes: notes || null
        }
      });

      // Update enrollment payment status
      await tx.enrollment.update({
        where: { id: finalEnrollmentId },
        data: {
          paymentStatus: 'paid'
        }
      });

      return payment;
    });

    // Fetch complete payment data
    const payment = await prisma.payment.findUnique({
      where: { id: result.id },
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
      }
    });

    if (!payment) {
      throw new Error('Payment not found after creation');
    }

    const formattedPayment = {
      id: payment.id,
      transactionId: payment.transactionId,
      studentName: `${payment.enrollment.student.firstName} ${payment.enrollment.student.lastName}`,
      studentId: payment.enrollment.student.studentId,
      studentEmail: payment.enrollment.student.email,
      studentContact: payment.enrollment.student.contactNumber,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentDate: payment.paymentDate.toISOString(),
      status: payment.status,
      receiptNumber: payment.receiptNumber,
      notes: payment.notes,
      enrollmentId: payment.enrollmentId,
      enrollment: {
        id: payment.enrollment.id,
        reviewType: payment.enrollment.reviewType,
        batch: payment.enrollment.batch,
        startDate: payment.enrollment.startDate?.toISOString(),
        student: payment.enrollment.student
      },
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString()
    };

    return NextResponse.json({ 
      payment: formattedPayment,
      message: 'Payment created successfully' 
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}