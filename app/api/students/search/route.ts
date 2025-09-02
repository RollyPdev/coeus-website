import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const studentId = searchParams.get('studentId');

    if (!query && !studentId) {
      return NextResponse.json({ error: 'Search query or studentId required' }, { status: 400 });
    }

    // Input validation
    if (query && query.length > 100) {
      return NextResponse.json({ error: 'Search query too long' }, { status: 400 });
    }
    
    if (studentId && studentId.length > 50) {
      return NextResponse.json({ error: 'Student ID too long' }, { status: 400 });
    }


    
    if (studentId) {
      // QR code search - exact match using unique index
      const student = await prisma.student.findUnique({
        where: { studentId: studentId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          studentId: true,
          photoUrl: true
        }
      });
      
      return NextResponse.json({ student });
    } else {
      // Optimized search - prioritize exact matches first, then partial matches
      const trimmedQuery = query.trim();
      
      // First try exact studentId match (fastest)
      let students = await prisma.student.findMany({
        where: {
          studentId: { equals: trimmedQuery, mode: 'insensitive' },
          status: 'active'
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          studentId: true,
          photoUrl: true
        },
        take: 5
      });

      // If no exact match, do partial search but limit scope
      if (students.length === 0 && trimmedQuery.length >= 2) {
        students = await prisma.student.findMany({
          where: {
            AND: [
              { status: 'active' },
              {
                OR: [
                  { firstName: { startsWith: trimmedQuery, mode: 'insensitive' } },
                  { lastName: { startsWith: trimmedQuery, mode: 'insensitive' } },
                  { studentId: { contains: trimmedQuery, mode: 'insensitive' } }
                ]
              }
            ]
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentId: true,
            photoUrl: true
          },
          orderBy: [
            { lastName: 'asc' },
            { firstName: 'asc' }
          ],
          take: 8
        });
      }

      return NextResponse.json({ students });
    }
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}