import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// GET /api/lecturers - Get all lecturers
export async function GET() {
  try {
    const lecturers = await prisma.lecturer.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(lecturers);
  } catch (error) {
    console.error("Error fetching lecturers:", error);
    return NextResponse.json(
      { message: "Error fetching lecturers" },
      { status: 500 }
    );
  }
}

// POST /api/lecturers - Create a new lecturer
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
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

    // Set default photo if none provided
    if (!data.photo) {
      data.photo = '/default-lecturer.svg';
    }

    const lecturer = await prisma.lecturer.create({
      data,
    });

    return NextResponse.json(lecturer, { status: 201 });
  } catch (error) {
    console.error("Error creating lecturer:", error);
    return NextResponse.json(
      { message: "Error creating lecturer" },
      { status: 500 }
    );
  }
}