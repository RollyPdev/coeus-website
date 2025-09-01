import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    await prisma.$connect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
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
          birthday: true,
          age: true,
          contactNumber: true,
          email: true,
          city: true,
          province: true,
          schoolName: true,
          course: true,
          yearGraduated: true,
          status: true,
          createdAt: true
        },
        orderBy: {
          lastName: 'asc'
        },
        skip,
        take: limit
      }),
      prisma.student.count()
    ]);

    return NextResponse.json({ 
      students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching students:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return NextResponse.json(
      { error: 'Failed to fetch students', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
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