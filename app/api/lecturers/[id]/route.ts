import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/lecturers/[id] - Get a specific lecturer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lecturer = await prisma.lecturer.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!lecturer) {
      return NextResponse.json(
        { message: "Lecturer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(lecturer);
  } catch (error) {
    console.error("Error fetching lecturer:", error);
    return NextResponse.json(
      { message: "Error fetching lecturer" },
      { status: 500 }
    );
  }
}

// PUT /api/lecturers/[id] - Update a lecturer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "position",
      "credentials",
      "bio",
      "specialization",
      "category",
      "subjects",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const lecturer = await prisma.lecturer.update({
      where: {
        id: params.id,
      },
      data,
    });

    return NextResponse.json(lecturer);
  } catch (error) {
    console.error("Error updating lecturer:", error);
    return NextResponse.json(
      { message: "Error updating lecturer" },
      { status: 500 }
    );
  }
}

// DELETE /api/lecturers/[id] - Delete a lecturer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.lecturer.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Lecturer deleted successfully" });
  } catch (error) {
    console.error("Error deleting lecturer:", error);
    return NextResponse.json(
      { message: "Error deleting lecturer" },
      { status: 500 }
    );
  }
}