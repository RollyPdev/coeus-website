import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [total, byCategory, recentlyAdded] = await Promise.all([
      // Total lecturers
      prisma.lecturer.count(),
      
      // By category
      prisma.lecturer.groupBy({
        by: ['category'],
        _count: {
          category: true
        }
      }),
      
      // Recently added (last 30 days)
      prisma.lecturer.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Format category data
    const categoryStats = {
      criminology: 0,
      nursing: 0,
      cpd: 0
    };

    byCategory.forEach(item => {
      if (item.category in categoryStats) {
        categoryStats[item.category as keyof typeof categoryStats] = item._count.category;
      }
    });

    return NextResponse.json({
      total,
      byCategory: categoryStats,
      recentlyAdded
    });
  } catch (error) {
    console.error('Error fetching lecturer stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lecturer statistics' },
      { status: 500 }
    );
  }
}