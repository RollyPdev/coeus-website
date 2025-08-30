import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const studentId = searchParams.get('studentId');
    
    if (studentId) {
      // Search by specific student ID (for QR code)
      const student = await prisma.student.findFirst({
        where: {
          OR: [
            { studentId: studentId },
            { id: studentId }
          ]
        },
        select: {
          id: true,
          studentId: true,
          firstName: true,
          lastName: true,
          photoUrl: true
        }
      });
      
      return NextResponse.json({ student });
    }
    
    if (!query || query.length < 2) {
      return NextResponse.json({ students: [] });
    }

    const students = await prisma.student.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            lastName: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            studentId: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ],
        status: 'active'
      },
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        photoUrl: true
      },
      take: 10,
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' }
      ]
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Error searching students:', error);
    return NextResponse.json(
      { error: 'Failed to search students' },
      { status: 500 }
    );
  }
}