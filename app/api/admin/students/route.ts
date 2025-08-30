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
        lastName: true,
        photoUrl: true
      },
      orderBy: {
        lastName: 'asc'
      }
    });

    return NextResponse.json({ students });
  } catch (error) {
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