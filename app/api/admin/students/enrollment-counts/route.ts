import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentIds = searchParams.get('ids')?.split(',') || [];

    if (studentIds.length === 0) {
      return NextResponse.json({ counts: {} });
    }

    const enrollmentCounts = await prisma.student.findMany({
      where: {
        id: { in: studentIds }
      },
      select: {
        id: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    const counts = enrollmentCounts.reduce((acc, student) => {
      acc[student.id] = student._count.enrollments;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({ counts });
  } catch (error) {
    console.error('Error fetching enrollment counts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollment counts' },
      { status: 500 }
    );
  }
}