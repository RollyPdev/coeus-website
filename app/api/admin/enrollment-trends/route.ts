import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const db = prisma as any;

interface TrendDataPoint {
  date: string;
  label: string;
  completed: number;
  pending: number;
  total: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';
    
    let days: number;
    let groupByFormat: string;
    
    switch (period) {
      case '7d':
        days = 7;
        groupByFormat = 'day';
        break;
      case '30d':
        days = 30;
        groupByFormat = 'day';
        break;
      case '90d':
        days = 90;
        groupByFormat = 'week';
        break;
      default:
        days = 7;
        groupByFormat = 'day';
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get enrollment data grouped by date
    const enrollments = await db.enrollment.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      select: {
        id: true,
        createdAt: true,
        status: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Process data by time periods
    const trendsData: TrendDataPoint[] = [];
    const today = new Date();
    
    if (groupByFormat === 'day') {
      // Group by day
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);
        
        const dayEnrollments = enrollments.filter(enrollment => {
          const enrollmentDate = new Date(enrollment.createdAt);
          return enrollmentDate >= date && enrollmentDate < nextDate;
        });
        
        const completedCount = dayEnrollments.filter(e => e.status === 'COMPLETED').length;
        const pendingCount = dayEnrollments.filter(e => e.status === 'PENDING').length;
        const totalCount = dayEnrollments.length;
        
        trendsData.push({
          date: date.toISOString().split('T')[0],
          label: period === '7d' ? 
            date.toLocaleDateString('en-US', { weekday: 'short' }) : 
            date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          completed: completedCount,
          pending: pendingCount,
          total: totalCount
        });
      }
    } else {
      // Group by week for 90-day view
      const weeksCount = Math.ceil(days / 7);
      for (let i = weeksCount - 1; i >= 0; i--) {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - (i * 7) - 6);
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        
        const weekEnrollments = enrollments.filter(enrollment => {
          const enrollmentDate = new Date(enrollment.createdAt);
          return enrollmentDate >= weekStart && enrollmentDate < weekEnd;
        });
        
        const completedCount = weekEnrollments.filter(e => e.status === 'COMPLETED').length;
        const pendingCount = weekEnrollments.filter(e => e.status === 'PENDING').length;
        const totalCount = weekEnrollments.length;
        
        trendsData.push({
          date: weekStart.toISOString().split('T')[0],
          label: `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          completed: completedCount,
          pending: pendingCount,
          total: totalCount
        });
      }
    }

    // Calculate summary statistics
    const totalEnrollments = trendsData.reduce((sum, day) => sum + day.total, 0);
    const totalCompleted = trendsData.reduce((sum, day) => sum + day.completed, 0);
    const totalPending = trendsData.reduce((sum, day) => sum + day.pending, 0);
    const completionRate = totalEnrollments > 0 ? ((totalCompleted / totalEnrollments) * 100).toFixed(1) : '0';
    
    // Calculate growth rate (comparing first half with second half of period)
    const halfPoint = Math.floor(trendsData.length / 2);
    const firstHalf = trendsData.slice(0, halfPoint);
    const secondHalf = trendsData.slice(halfPoint);
    
    const firstHalfTotal = firstHalf.reduce((sum, day) => sum + day.total, 0);
    const secondHalfTotal = secondHalf.reduce((sum, day) => sum + day.total, 0);
    const growthRate = firstHalfTotal > 0 ? 
      (((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100).toFixed(1) : '0';

    const response = {
      period,
      data: trendsData,
      summary: {
        totalEnrollments,
        totalCompleted,
        totalPending,
        completionRate: parseFloat(completionRate),
        growthRate: parseFloat(growthRate)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching enrollment trends:', error);
    return NextResponse.json({
      period: '7d',
      data: [],
      summary: {
        totalEnrollments: 0,
        totalCompleted: 0,
        totalPending: 0,
        completionRate: 0,
        growthRate: 0
      }
    }, { status: 500 });
  }
}