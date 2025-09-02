import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const studentId = searchParams.get('studentId');

    if (!query && !studentId) {
      return NextResponse.json({ error: 'Search query or studentId required' }, { status: 400 });
    }

    let studentsData;
    
    if (studentId) {
      // QR code search - exact match
      const student = await prisma.student.findFirst({
        where: { studentId: studentId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          studentId: true,
          email: true,
          photo: true,
          photoUrl: true
        }
      });
      
      if (student) {
        const formattedStudent = {
          ...student,
          photoUrl: (student.photo && student.photo.startsWith('data:')) ? student.photo : null
        };
        return NextResponse.json({ student: formattedStudent });
      } else {
        return NextResponse.json({ student: null });
      }
    } else {
      // Regular search
      studentsData = await prisma.student.findMany({
        where: {
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { studentId: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          studentId: true,
          email: true,
          photo: true,
          photoUrl: true
        },
        take: 10
      });

      const students = studentsData.map(student => ({
        ...student,
        photoUrl: (student.photo && student.photo.startsWith('data:')) ? student.photo : null
      }));

      return NextResponse.json({ students });
    }
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}