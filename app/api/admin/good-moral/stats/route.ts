import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [total, byStatus, recentlyIssued, expiringThisMonth] = await Promise.all([
      // Total certificates
      prisma.goodMoral.count(),
      
      // By status
      prisma.goodMoral.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      }),
      
      // Recently issued (last 30 days)
      prisma.goodMoral.count({
        where: {
          issuedDate: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Expiring this month
      prisma.goodMoral.count({
        where: {
          validUntil: {
            gte: new Date(),
            lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
          },
          status: 'active'
        }
      })
    ]);

    // Format status data
    const statusStats = {
      active: 0,
      expired: 0,
      revoked: 0
    };

    byStatus.forEach(item => {
      if (item.status in statusStats) {
        statusStats[item.status as keyof typeof statusStats] = item._count.status;
      }
    });

    return NextResponse.json({
      total,
      byStatus: statusStats,
      recentlyIssued,
      expiringThisMonth
    });
  } catch (error) {
    console.error('Error fetching good moral stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}