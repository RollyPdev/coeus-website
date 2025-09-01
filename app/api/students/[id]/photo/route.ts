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
        photo: true,
        photoUrl: true
      }
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      photo: student.photo,
      photoUrl: student.photoUrl
    });
  } catch (error) {
    console.error('Error fetching student photo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student photo' },
      { status: 500 }
    );
  }
}