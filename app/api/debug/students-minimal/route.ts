import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test with minimal fields first
    const students = await prisma.student.findMany({
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        middleInitial: true,
        gender: true,
        birthday: true,
        age: true,
        contactNumber: true,
        email: true,
        status: true,
        createdAt: true,
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
    console.error('Error fetching students:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}