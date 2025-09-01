import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test the enrollments relation
    const students = await prisma.student.findMany({
      take: 5,
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        status: true,
        enrollments: {
          select: {
            enrollmentId: true,
            reviewType: true,
            status: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        lastName: 'asc'
      }
    });

    return NextResponse.json({ 
      success: true,
      count: students.length,
      students 
    });
  } catch (error: any) {
    console.error('Error fetching students with enrollments:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      stack: error.stack
    }, { status: 500 });
  }
}