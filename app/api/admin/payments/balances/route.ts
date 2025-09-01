import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            studentId: true,
            email: true
          }
        },
        payments: {
          select: {
            amount: true,
            status: true,
            paymentDate: true
          }
        }
      }
    });

    const balances = enrollments.map(enrollment => {
      const totalPaid = enrollment.payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const totalEnrollment = enrollment.amount;
      const remainingBalance = Math.max(0, totalEnrollment - totalPaid);
      const amountAvailable = totalPaid;
      const currentBalance = remainingBalance;
      
      let paymentStatus = 'pending';
      if (remainingBalance === 0) {
        paymentStatus = 'paid';
      } else if (totalPaid > 0) {
        paymentStatus = 'partial';
      }

      return {
        enrollmentId: enrollment.id,
        studentId: enrollment.student.studentId,
        studentName: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
        studentEmail: enrollment.student.email,
        reviewType: enrollment.reviewType,
        totalEnrollment,
        totalPaid,
        remainingBalance,
        amountAvailable,
        currentBalance,
        paymentStatus,
        paymentCount: enrollment.payments.length
      };
    });

    balances.sort((a, b) => {
      if (a.remainingBalance !== b.remainingBalance) {
        return b.remainingBalance - a.remainingBalance;
      }
      return a.studentName.localeCompare(b.studentName);
    });

    const summary = {
      totalStudents: balances.length,
      totalEnrollmentAmount: balances.reduce((sum, b) => sum + b.totalEnrollment, 0),
      totalPaidAmount: balances.reduce((sum, b) => sum + b.totalPaid, 0),
      totalRemainingBalance: balances.reduce((sum, b) => sum + b.remainingBalance, 0),
      paidInFull: balances.filter(b => b.paymentStatus === 'paid').length,
      partialPayments: balances.filter(b => b.paymentStatus === 'partial').length,
      pendingPayments: balances.filter(b => b.paymentStatus === 'pending').length
    };

    return NextResponse.json({ balances, summary });
  } catch (error) {
    console.error('Error fetching student balances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student balances' },
      { status: 500 }
    );
  }
}