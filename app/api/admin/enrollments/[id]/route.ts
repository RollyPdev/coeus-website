import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: params.id },
      include: {
        student: true,
        program: true,
        payments: true
      }
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error('Error fetching enrollment details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollment details' },
      { status: 500 }
    );
  }
}