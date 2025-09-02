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
      include: {
        enrollments: {
          select: {
            id: true,
            enrollmentId: true,
            reviewType: true,
            batch: true,
            status: true,
            paymentStatus: true,
            startDate: true,
            createdAt: true
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        middleInitial: data.middleInitial,
        gender: data.gender,
        age: data.age,
        birthPlace: data.birthPlace,
        contactNumber: data.contactNumber,
        email: data.email,
        address: data.address,
        city: data.city,
        province: data.province,
        guardianFirstName: data.guardianFirstName,
        guardianLastName: data.guardianLastName,
        guardianContact: data.guardianContact,
        relationship: data.relationship,
        schoolName: data.schoolName,
        course: data.course,
        yearGraduated: data.yearGraduated
      }
    });

    return NextResponse.json({ success: true, student: updatedStudent });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    );
  }
}