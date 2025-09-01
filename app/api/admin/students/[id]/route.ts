import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const student = await prisma.student.findUnique({
      where: { id },
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        middleInitial: true,
        gender: true,
        birthday: true,
        age: true,
        birthPlace: true,
        contactNumber: true,
        email: true,
        address: true,
        region: true,
        province: true,
        city: true,
        barangay: true,
        zipCode: true,
        guardianFirstName: true,
        guardianLastName: true,
        guardianMiddleInitial: true,
        guardianContact: true,
        guardianAddress: true,
        relationship: true,
        schoolName: true,
        course: true,
        yearGraduated: true,
        howDidYouHear: true,
        referredBy: true,
        photoUrl: true,
        status: true,
        createdAt: true,
        enrollments: {
          select: {
            enrollmentId: true,
            reviewType: true,
            status: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error('Error fetching student details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student details' },
      { status: 500 }
    );
  }
}