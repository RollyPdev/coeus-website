import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    return NextResponse.json({ 
      users,
      count: users.length,
      message: users.length > 0 ? 'Admin users found' : 'No admin users found'
    });
  } catch (error) {
    console.error('Error checking admin users:', error);
    return NextResponse.json(
      { error: 'Failed to check admin users' },
      { status: 500 }
    );
  }
}