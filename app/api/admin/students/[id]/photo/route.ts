import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const student = await prisma.student.findUnique({
      where: { id },
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

    if (student.photoUrl && student.photoUrl.startsWith('data:')) {
      // Only serve base64 data URLs (real photos), ignore placeholder paths
      let base64Data = student.photoUrl.split(',')[1];
      try {
        const buffer = Buffer.from(base64Data, 'base64');
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      } catch (error) {
        console.error('Error decoding base64 photoUrl:', error);
      }
    }

    if (student.photo) {
      // Handle both base64 with and without data URL prefix
      let base64Data = student.photo;
      if (base64Data.startsWith('data:')) {
        base64Data = base64Data.split(',')[1];
      }
      
      try {
        const buffer = Buffer.from(base64Data, 'base64');
        
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      } catch (error) {
        console.error('Error decoding base64 photo:', error);
        return NextResponse.json(
          { error: 'Invalid photo data' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'No photo found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching student photo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo' },
      { status: 500 }
    );
  }
}