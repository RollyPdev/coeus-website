import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Get student count
    const studentCount = await prisma.student.count();
    
    // Get a few sample students
    const students = await prisma.student.findMany({
      take: 5,
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        status: true,
        createdAt: true
      }
    });
    
    return NextResponse.json({
      success: true,
      connection: 'OK',
      studentCount,
      sampleStudents: students,
      message: 'Database connection successful'
    });
  } catch (error: any) {
    console.error('Database debug error:', error);
    
    return NextResponse.json({
      success: false,
      connection: 'FAILED',
      error: error.message,
      code: error.code,
      message: 'Database connection failed'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}