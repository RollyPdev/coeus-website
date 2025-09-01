import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Use direct Prisma client for photo status to bypass Accelerate limits
const directPrisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentIds = searchParams.get('ids')?.split(',') || [];

    if (studentIds.length === 0) {
      return NextResponse.json({ photoStatus: {} });
    }

    // Use raw query to check photo existence efficiently
    const results = await directPrisma.$queryRaw`
      SELECT id, 
             CASE WHEN photo IS NOT NULL AND photo != '' THEN true ELSE false END as has_photo,
             CASE WHEN "photoUrl" IS NOT NULL AND "photoUrl" != '' THEN true ELSE false END as has_photo_url
      FROM "Student" 
      WHERE id = ANY(${studentIds})
    ` as Array<{id: string, has_photo: boolean, has_photo_url: boolean}>;

    const photoStatus = results.reduce((acc, row) => {
      acc[row.id] = row.has_photo || row.has_photo_url;
      return acc;
    }, {} as Record<string, boolean>);

    return NextResponse.json({ photoStatus });
  } catch (error) {
    console.error('Error fetching photo status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo status' },
      { status: 500 }
    );
  }
}