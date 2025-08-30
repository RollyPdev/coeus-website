import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: true
      },
      take: 1
    });

    return NextResponse.json({
      raw: enrollments,
      student: enrollments[0]?.student
    });
  } catch (error) {
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 });
  }
}