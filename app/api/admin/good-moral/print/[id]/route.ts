import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const certificate = await prisma.goodMoral.findUnique({
      where: { id: params.id },
      include: {
        student: true
      }
    });

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // TODO: Generate PDF certificate
    return NextResponse.json(certificate);
  } catch (error) {
    console.error('Error fetching certificate for print:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificate' },
      { status: 500 }
    );
  }
}