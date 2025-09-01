import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { paymentId, refundAmount, refundReason } = await request.json();

    if (!paymentId || !refundAmount || refundAmount <= 0) {
      return NextResponse.json(
        { error: 'Missing required fields or invalid refund amount' },
        { status: 400 }
      );
    }

    // Get payment details
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { enrollment: true }
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status !== 'completed') {
      return NextResponse.json(
        { error: 'Can only refund completed payments' },
        { status: 400 }
      );
    }

    if (refundAmount > payment.amount) {
      return NextResponse.json(
        { error: 'Refund amount exceeds payment amount' },
        { status: 400 }
      );
    }

    // Process refund with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update payment
      const updatedPayment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: 'refunded',
          notes: `Refunded: ${refundReason}`
        }
      });

      // Update enrollment status
      await tx.enrollment.update({
        where: { id: payment.enrollmentId },
        data: {
          paymentStatus: 'pending'
        }
      });

      // Skip audit log for now

      return updatedPayment;
    });

    return NextResponse.json({
      message: 'Refund processed successfully',
      payment: result
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    );
  }
}