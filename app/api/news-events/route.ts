import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const newsEvents = await prisma.newsEvent.findMany({
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(newsEvents);
  } catch (error) {
    console.error('Error fetching news events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const newsEvent = await prisma.newsEvent.create({
      data: {
        title: data.title,
        content: data.content,
        summary: data.summary,
        image: data.image,
        date: new Date(data.date),
        category: data.category,
        featured: data.featured || false
      }
    });

    return NextResponse.json(newsEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating news event:', error);
    return NextResponse.json(
      { error: 'Failed to create news event' },
      { status: 500 }
    );
  }
}