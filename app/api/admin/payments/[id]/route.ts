import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { amount, paymentMethod, status, notes, promoAvails, paymentStatus } = await request.json();

    if (amount && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const updateData: any = {};
    if (amount) updateData.amount = parseFloat(amount);
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    updateData.updatedAt = new Date();
    
    // Store paymentStatus in notes if field doesn't exist
    if (paymentStatus && notes !== undefined) {
      const cleanNotes = notes.replace(/\s*\|\s*Payment Status: [^|]+/g, '').trim();
      updateData.notes = cleanNotes ? `${cleanNotes} | Payment Status: ${paymentStatus.replace('_', ' ')}` : `Payment Status: ${paymentStatus.replace('_', ' ')}`;
    }

    const updatedPayment = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id },
        data: updateData,
        include: {
          enrollment: {
            include: {
              student: true,
              payments: { select: { amount: true, status: true } }
            }
          }
        }
      });

      // Recalculate enrollment totals - promo avails is the total value, payments subtract from it
      const allPayments = await tx.payment.findMany({
        where: { enrollmentId: payment.enrollmentId },
        select: { amount: true, status: true, promoAvails: true }
      });
      
      const totalPaid = allPayments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
      
      // Use promo avails from any payment as the total enrollment value
      const promoAvailsTotal = allPayments.find(p => p.promoAvails && p.promoAvails > 0)?.promoAvails || payment.enrollment.amount;
      const remainingBalance = Math.max(0, promoAvailsTotal - totalPaid);
      
      let enrollmentPaymentStatus = 'pending';
      if (remainingBalance === 0) enrollmentPaymentStatus = 'paid';
      else if (totalPaid > 0) enrollmentPaymentStatus = 'partial';

      await tx.enrollment.update({
        where: { id: payment.enrollmentId },
        data: {
          amount: promoAvailsTotal, // Update enrollment amount to promo avails total
          totalPaid: totalPaid,
          remainingBalance: remainingBalance,
          paymentStatus: enrollmentPaymentStatus
        }
      });

      return payment;
    });

    return NextResponse.json({ 
      payment: updatedPayment,
      message: 'Payment updated successfully' 
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const deletedPayment = await prisma.$transaction(async (tx) => {
      // Get payment details before deletion
      const payment = await tx.payment.findUnique({
        where: { id },
        include: {
          enrollment: {
            include: {
              payments: { select: { amount: true, status: true, id: true } }
            }
          }
        }
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      // Delete the payment
      await tx.payment.delete({ where: { id } });

      // Recalculate enrollment totals after deletion
      const remainingPayments = payment.enrollment.payments.filter(p => p.id !== id);
      const totalPaid = remainingPayments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const remainingBalance = Math.max(0, payment.enrollment.amount - totalPaid);
      
      let paymentStatus = 'pending';
      if (remainingBalance === 0) paymentStatus = 'paid';
      else if (totalPaid > 0) paymentStatus = 'partial';

      // Update enrollment
      await tx.enrollment.update({
        where: { id: payment.enrollmentId },
        data: {
          totalPaid: totalPaid,
          remainingBalance: remainingBalance,
          paymentStatus: paymentStatus
        }
      });

      return payment;
    });

    return NextResponse.json({ 
      message: 'Payment deleted successfully',
      payment: deletedPayment
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return NextResponse.json({ error: 'Failed to delete payment' }, { status: 500 });
  }
}