import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const goodMoral = await prisma.goodMoral.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            studentId: true,
            email: true,
            contactNumber: true
          }
        }
      }
    });

    if (!goodMoral) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(goodMoral);
  } catch (error) {
    console.error('Error fetching good moral certificate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificate' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { purpose, remarks, validUntil, status } = await request.json();
    
    const updatedGoodMoral = await prisma.goodMoral.update({
      where: { id },
      data: {
        purpose,
        remarks,
        validUntil: validUntil ? new Date(validUntil) : undefined,
        status
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

    return NextResponse.json(updatedGoodMoral);
  } catch (error) {
    console.error('Error updating good moral certificate:', error);
    return NextResponse.json(
      { error: 'Failed to update certificate' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.goodMoral.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting good moral certificate:', error);
    return NextResponse.json(
      { error: 'Failed to delete certificate' },
      { status: 500 }
    );
  }
}