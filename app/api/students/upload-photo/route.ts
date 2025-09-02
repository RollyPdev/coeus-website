import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}