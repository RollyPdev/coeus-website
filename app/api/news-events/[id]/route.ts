import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newsEvent = await prisma.newsEvent.findUnique({
      where: { id: params.id }
    });

    if (!newsEvent) {
      return NextResponse.json({ error: 'News event not found' }, { status: 404 });
    }

    return NextResponse.json(newsEvent);
  } catch (error) {
    console.error('Error fetching news event:', error);
    return NextResponse.json({ error: 'Failed to fetch news event' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // If setting as featured, remove featured from all other items
    if (data.featured === true) {
      await prisma.newsEvent.updateMany({
        where: { NOT: { id: params.id } },
        data: { featured: false }
      });
    }

    const updateData = {
      ...data,
      ...(data.date && { date: new Date(data.date) })
    };

    const newsEvent = await prisma.newsEvent.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json(newsEvent);
  } catch (error) {
    console.error('Error updating news event:', error);
    return NextResponse.json({ error: 'Failed to update news event' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.newsEvent.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news event:', error);
    return NextResponse.json({ error: 'Failed to delete news event' }, { status: 500 });
  }
}