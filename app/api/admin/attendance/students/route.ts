import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      where: {
        status: 'active'
      },
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true
      },
      orderBy: {
        lastName: 'asc'
      }
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Error fetching students for attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}