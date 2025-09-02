import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const program = await prisma.program.findUnique({
      where: { id },
      select: {
        image: true
      }
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // If program has uploaded photo (base64 data), serve it as image
    if (program.image && program.image.startsWith('data:')) {
      let base64Data = program.image.split(',')[1];
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
          { error: 'Invalid image data' },
          { status: 400 }
        );
      }
    }

    // If it's a URL, redirect to it or return the URL
    if (program.image && (program.image.startsWith('http') || program.image.startsWith('/'))) {
      return NextResponse.json({
        imageUrl: program.image
      });
    }

    return NextResponse.json(
      { error: 'No image found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching program image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to upload images' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Validate base64 image data
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format. Please upload a valid image.' },
        { status: 400 }
      );
    }

    // Check file size (limit to ~2MB base64 encoded)
    const base64Data = image.split(',')[1];
    const sizeInBytes = (base64Data.length * 3) / 4;
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (sizeInBytes > maxSize) {
      return NextResponse.json(
        { error: 'Image size too large. Please upload an image smaller than 2MB.' },
        { status: 400 }
      );
    }

    // Update program with image
    const program = await prisma.program.update({
      where: { id },
      data: { image },
      select: {
        id: true,
        title: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      program
    });
  } catch (error) {
    console.error('Error uploading program image:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}