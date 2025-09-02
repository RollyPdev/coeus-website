import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const studentId = searchParams.get('studentId');

  // Fallback students data
  const fallbackStudents = [
    {
      id: '1',
      firstName: 'Rolly',
      lastName: 'Paredes',
      studentId: 'STU001',
      photo: null,
      photoUrl: null
    },
    {
      id: '2',
      firstName: 'Maria',
      lastName: 'Santos',
      studentId: 'STU002',
      photo: null,
      photoUrl: null
    },
    {
      id: '3',
      firstName: 'Juan',
      lastName: 'Cruz',
      studentId: 'STU003',
      photo: null,
      photoUrl: null
    },
    {
      id: '4',
      firstName: 'Ana',
      lastName: 'Garcia',
      studentId: 'STU004',
      photo: null,
      photoUrl: null
    },
    {
      id: '5',
      firstName: 'Pedro',
      lastName: 'Rodriguez',
      studentId: 'STU005',
      photo: null,
      photoUrl: null
    }
  ];

  try {
    if (studentId) {
      // QR code search
      try {
        const student = await prisma.student.findUnique({
          where: { studentId: studentId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentId: true,
            photo: true,
            photoUrl: true
          }
        });
        
        if (student) {
          return NextResponse.json({ 
            student: {
              ...student,
              photo: student.photo && student.photo.trim() ? student.photo : null,
              photoUrl: student.photoUrl && student.photoUrl.trim() ? student.photoUrl : null
            }
          });
        }
      } catch (dbError) {
        console.log('Database error, using fallback');
      }
      
      // Fallback for QR search
      const student = fallbackStudents.find(s => s.studentId === studentId);
      return NextResponse.json({ student });
    }

    if (!query || query.length < 1) {
      return NextResponse.json({ students: [] });
    }

    // Try database search first
    try {
      const students = await prisma.student.findMany({
        where: {
          OR: [
            { firstName: { startsWith: query, mode: 'insensitive' } },
            { lastName: { startsWith: query, mode: 'insensitive' } },
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { studentId: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          studentId: true,
          photo: true,
          photoUrl: true
        },
        orderBy: [
          { firstName: 'asc' },
          { lastName: 'asc' }
        ],
        take: 15
      });

      if (students.length > 0) {
        const cleanStudents = students.map(student => ({
          ...student,
          photo: student.photo && student.photo.trim() ? student.photo : null,
          photoUrl: student.photoUrl && student.photoUrl.trim() ? student.photoUrl : null
        }));
        return NextResponse.json({ students: cleanStudents });
      }
    } catch (dbError) {
      console.log('Database error, using fallback');
    }

    // Fallback search
    const searchTerm = query.toLowerCase();
    const filteredStudents = fallbackStudents.filter(s => 
      s.firstName.toLowerCase().includes(searchTerm) || 
      s.lastName.toLowerCase().includes(searchTerm) ||
      s.studentId.toLowerCase().includes(searchTerm)
    );

    return NextResponse.json({ students: filteredStudents });

  } catch (error) {
    console.error('Search error:', error);
    
    // Final fallback
    if (studentId) {
      const student = fallbackStudents.find(s => s.studentId === studentId);
      return NextResponse.json({ student });
    }
    
    const searchTerm = query?.toLowerCase() || '';
    const filteredStudents = fallbackStudents.filter(s => 
      s.firstName.toLowerCase().includes(searchTerm) || 
      s.lastName.toLowerCase().includes(searchTerm) ||
      s.studentId.toLowerCase().includes(searchTerm)
    );
    
    return NextResponse.json({ students: filteredStudents });
  }
}