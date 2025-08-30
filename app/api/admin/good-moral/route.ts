import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const goodMorals = await prisma.goodMoral.findMany({
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            studentId: true
          }
        }
      },
      orderBy: {
        issuedDate: 'desc'
      }
    });

    return NextResponse.json(goodMorals);
  } catch (error) {
    console.error('Error fetching good moral certificates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch good moral certificates' },
      { status: 500 }
    );
  }
}