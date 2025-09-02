import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to create programs' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "category",
      "features",
      "duration",
      "price",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Set default image if none provided
    if (!data.image) {
      data.image = '/default-program.svg';
    }

    const program = await prisma.program.create({ data });
    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json({ error: 'Failed to create program' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to update programs' },
        { status: 401 }
      );
    }

    const { id, ...data } = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "category",
      "features",
      "duration",
      "price",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const program = await prisma.program.update({
      where: { id },
      data
    });
    return NextResponse.json(program);
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to delete programs' },
        { status: 401 }
      );
    }

    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    // Check if program exists before attempting to delete
    const existingProgram = await prisma.program.findUnique({
      where: { id }
    });

    if (!existingProgram) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Delete the program
    await prisma.program.delete({ where: { id } });
    
    console.log(`Program deleted successfully: ${id}`);
    return NextResponse.json({ 
      message: 'Program deleted successfully',
      deletedId: id
    });
  } catch (error) {
    console.error('Error deleting program:', error);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Program not found or already deleted' },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Cannot delete program due to related records. Please remove related data first.' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete program' },
      { status: 500 }
    );
  }
}