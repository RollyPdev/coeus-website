import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalStudents,
      activeStudents,
      pendingStudents,
      graduatedStudents,
      totalEnrollments,
      activeEnrollments,
      totalPayments,
      recentStudents,
      recentEnrollments
    ] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { status: 'active' } }),
      prisma.student.count({ where: { status: { in: ['pending', 'inactive'] } } }),
      prisma.student.count({ where: { status: 'graduated' } }),
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { status: 'active' } }),
      prisma.payment.count({ where: { status: 'completed' } }),
      prisma.student.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          status: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.enrollment.findMany({
        select: {
          id: true,
          reviewType: true,
          status: true,
          createdAt: true,
          student: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    const stats = {
      students: {
        total: totalStudents,
        active: activeStudents,
        pending: pendingStudents,
        graduated: graduatedStudents
      },
      enrollments: {
        total: totalEnrollments,
        active: activeEnrollments
      },
      payments: {
        total: totalPayments
      },
      recent: {
        students: recentStudents,
        enrollments: recentEnrollments
      }
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}