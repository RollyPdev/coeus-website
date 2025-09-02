import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const lecturer = await prisma.lecturer.findUnique({
      where: { id },
      select: {
        photo: true
      }
    });

    if (!lecturer) {
      return NextResponse.json(
        { error: 'Lecturer not found' },
        { status: 404 }
      );
    }

    // If lecturer has uploaded photo (base64 data), serve it as image
    if (lecturer.photo && lecturer.photo.startsWith('data:')) {
      let base64Data = lecturer.photo.split(',')[1];
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

    // If it's a URL, redirect to it or return the URL
    if (lecturer.photo && (lecturer.photo.startsWith('http') || lecturer.photo.startsWith('/'))) {
      return NextResponse.json({
        photoUrl: lecturer.photo
      });
    }

    return NextResponse.json(
      { error: 'No photo found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching lecturer photo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { photo } = await request.json();

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo data is required' },
        { status: 400 }
      );
    }

    // Validate base64 photo data
    if (!photo.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid photo format. Please upload a valid image.' },
        { status: 400 }
      );
    }

    // Update lecturer with photo
    const lecturer = await prisma.lecturer.update({
      where: { id },
      data: { photo },
      select: {
        id: true,
        name: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Photo uploaded successfully',
      lecturer
    });
  } catch (error) {
    console.error('Error uploading lecturer photo:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    );
  }
}