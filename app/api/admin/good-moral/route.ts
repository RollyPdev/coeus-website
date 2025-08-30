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

export async function POST(request: Request) {
  try {
    const { studentId, purpose, remarks, issuedBy } = await request.json();
    
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certificateNumber = `GM-${year}-${random}`;
    
    const goodMoral = await prisma.goodMoral.create({
      data: {
        certificateNumber,
        studentId,
        purpose,
        issuedDate: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'active',
        issuedBy,
        remarks
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            studentId: true
          }
        }
      }
    });

    return NextResponse.json(goodMoral);
  } catch (error) {
    console.error('Error creating good moral certificate:', error);
    return NextResponse.json(
      { error: 'Failed to create good moral certificate' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    
    const updatedGoodMoral = await prisma.goodMoral.update({
      where: { id },
      data: { status },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            studentId: true
          }
        }
      }
    });

    return NextResponse.json(updatedGoodMoral);
  } catch (error) {
    console.error('Error updating good moral certificate:', error);
    return NextResponse.json(
      { error: 'Failed to update good moral certificate' },
      { status: 500 }
    );
  }
}