import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const db = prisma as any;

export async function GET() {
  try {
    const students = await db.student.findMany({
      where: {
        status: 'active' // Only show active students (approved enrollments)
      },
      include: {
        enrollments: {
          select: {
            enrollmentId: true,
            reviewType: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
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

    // Delete related records first to avoid foreign key constraints
    await db.$transaction(async (tx: any) => {
      // Delete good moral certificates
      await tx.goodMoral.deleteMany({
        where: { studentId: id }
      });
      
      // Delete enrollments
      await tx.enrollment.deleteMany({
        where: { studentId: id }
      });
      
      // Finally delete the student
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
