import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { field, value } = await request.json();
    
    if (!field || !value) {
      return NextResponse.json({ exists: false });
    }
    
    // Check for existing student with the specified field
    const whereClause = field === 'email' 
      ? { email: value }
      : { contactNumber: value };
    
    const existingStudent = await prisma.student.findFirst({
      where: whereClause,
      select: {
        studentId: true,
        firstName: true,
        lastName: true,
        email: true,
        contactNumber: true,
        status: true
      }
    });
    
    if (existingStudent) {
      return NextResponse.json({
        exists: true,
        studentId: existingStudent.studentId,
        name: `${existingStudent.firstName} ${existingStudent.lastName}`,
        status: existingStudent.status
      });
    }
    
    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error('Error checking duplicate student:', error);
    return NextResponse.json(
      { error: 'Failed to check duplicate' },
      { status: 500 }
    );
  }
}