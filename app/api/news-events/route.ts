import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { newsEvents } from '@/data/newsEvents';

export async function GET() {
  try {
    const newsEventsFromDB = await prisma.newsEvent.findMany({
      orderBy: { date: 'desc' }
    });
    
    // Return DB data if available, otherwise fallback
    return NextResponse.json(newsEventsFromDB.length > 0 ? newsEventsFromDB : newsEvents);
  } catch (error) {
    console.error('Error fetching news events:', error);
    // Fallback to static data on DB error
    return NextResponse.json(newsEvents);
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