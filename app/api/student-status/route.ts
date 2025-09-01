import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ students: [] });
    }

    const students = await prisma.student.findMany({
      where: {
        OR: [
          { firstName: { contains: name, mode: 'insensitive' } },
          { lastName: { contains: name, mode: 'insensitive' } }
        ]
      },
      select: {
        firstName: true,
        lastName: true,
        middleInitial: true,
        status: true,
        enrollments: {
          select: {
            status: true,
            reviewType: true
          },
          take: 1
        }
      },
      take: 10
    });

    console.log('Search query:', name);
    console.log('Students found:', students.length);

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Error searching students:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}