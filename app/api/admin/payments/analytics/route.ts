import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Revenue analytics
    const [dailyRevenue, weeklyRevenue, monthlyRevenue, yearlyRevenue] = await Promise.all([
      prisma.payment.aggregate({
        where: { 
          status: 'completed',
          paymentDate: { gte: startOfDay }
        },
        _sum: { amount: true },
        _count: true
      }),
      prisma.payment.aggregate({
        where: { 
          status: 'completed',
          paymentDate: { gte: startOfWeek }
        },
        _sum: { amount: true },
        _count: true
      }),
      prisma.payment.aggregate({
        where: { 
          status: 'completed',
          paymentDate: { gte: startOfMonth }
        },
        _sum: { amount: true },
        _count: true
      }),
      prisma.payment.aggregate({
        where: { 
          status: 'completed',
          paymentDate: { gte: startOfYear }
        },
        _sum: { amount: true },
        _count: true
      })
    ]);

    // Payment status distribution
    const statusDistribution = await prisma.payment.groupBy({
      by: ['status'],
      _count: { status: true },
      _sum: { amount: true }
    });

    // Payment method distribution
    const methodDistribution = await prisma.payment.groupBy({
      by: ['paymentMethod'],
      _count: { paymentMethod: true },
      _sum: { amount: true }
    });

    // Pending payments (simplified since dueDate may not exist yet)
    const overduePayments = await prisma.payment.count({
      where: {
        status: 'pending'
      }
    });

    const analytics = {
      revenue: {
        daily: dailyRevenue._sum.amount || 0,
        weekly: weeklyRevenue._sum.amount || 0,
        monthly: monthlyRevenue._sum.amount || 0,
        yearly: yearlyRevenue._sum.amount || 0
      },
      transactions: {
        daily: dailyRevenue._count,
        weekly: weeklyRevenue._count,
        monthly: monthlyRevenue._count,
        yearly: yearlyRevenue._count
      },
      statusDistribution,
      methodDistribution,
      overduePayments
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Error fetching payment analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment analytics' },
      { status: 500 }
    );
  }
}