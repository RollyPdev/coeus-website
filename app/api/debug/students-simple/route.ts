import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Try a simple query first
    const students = await prisma.student.findMany({
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        status: true,
        createdAt: true
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
      code: error.code,
      stack: error.stack
    }, { status: 500 });
  }
}