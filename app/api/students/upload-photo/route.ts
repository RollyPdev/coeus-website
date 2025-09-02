import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { studentId, photo } = await request.json();

    if (!studentId || !photo) {
      return NextResponse.json({ error: 'Student ID and photo required' }, { status: 400 });
    }

    const student = await prisma.student.update({
      where: { id: studentId },
      data: { photo }
    });

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error('Upload error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}