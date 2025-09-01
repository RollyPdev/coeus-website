import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        email: true,
        contactNumber: true,
        course: true,
        schoolName: true,
        yearGraduated: true,
        status: true,
        photoUrl: true,
        _count: {
          enrollments: true,
          payments: true
        },
        enrollments: {
          select: {
            reviewType: true,
            status: true,
            paymentStatus: true
          },
          take: 3
        }
      }
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const summary = {
      ...student,
      hasPhoto: !!student.photoUrl,
      enrollmentCount: student._count.enrollments,
      paymentCount: student._count.payments,
      recentEnrollments: student.enrollments
    };

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error fetching student summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student summary' },
      { status: 500 }
    );
  }
}