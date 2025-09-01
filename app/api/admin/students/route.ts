import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100'); // Increased default limit
    const skip = (page - 1) * limit;
    
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        select: {
          id: true,
          studentId: true,
          firstName: true,
          lastName: true,
          middleInitial: true,
          gender: true,
          contactNumber: true,
          email: true,
          course: true,
          schoolName: true,
          yearGraduated: true,
          status: true,
          createdAt: true
          // Excluding photo and photoUrl to reduce response size
        },
        orderBy: {
          lastName: 'asc'
        },
        skip,
        take: limit
      }),
      prisma.student.count()
    ]);

    const formattedStudents = students.map(student => ({
      ...student,
      hasPhoto: false, // Will be determined by photo status API
      enrollmentCount: 0 // Will be fetched separately when needed
    }));

    return NextResponse.json({ 
      students: formattedStudents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.goodMoral.deleteMany({
        where: { studentId: id }
      });
      
      await tx.enrollment.deleteMany({
        where: { studentId: id }
      });
      
      await tx.student.delete({
        where: { id }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}