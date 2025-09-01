import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Use raw SQL to get users
    const users = await prisma.$queryRaw`
      SELECT id, email, name, role, status, "lastLogin", "createdAt", "updatedAt"
      FROM "User"
      ORDER BY "createdAt" DESC
      LIMIT ${limit} OFFSET ${skip}
    `;

    const totalResult = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM "User"
    `;
    const total = Number(totalResult[0].count);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUsers = await prisma.$queryRaw`
      SELECT id FROM "User" WHERE email = ${email}
    `;
    const existingUser = existingUsers.length > 0 ? existingUsers[0] : null;

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = `cm${Math.random().toString(36).substr(2, 9)}`;

    // Use raw SQL to ensure compatibility
    await prisma.$executeRaw`
      INSERT INTO "User" (id, email, password, name, role, status, "createdAt", "updatedAt")
      VALUES (${userId}, ${email}, ${hashedPassword}, ${name}, ${role}, 'active', NOW(), NOW())
    `;

    const userResult = await prisma.$queryRaw`
      SELECT id, email, name, role, status, "createdAt"
      FROM "User" WHERE id = ${userId}
    `;
    const user = userResult[0];

    return NextResponse.json({ user, message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}