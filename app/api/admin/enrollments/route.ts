import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (status && status !== 'all') where.status = status.toUpperCase();
    if (search) {
      where.OR = [
        { student: { firstName: { contains: search, mode: 'insensitive' } } },
        { student: { lastName: { contains: search, mode: 'insensitive' } } },
        { student: { email: { contains: search, mode: 'insensitive' } } },
        { student: { studentId: { contains: search, mode: 'insensitive' } } },
        { enrollmentId: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              studentId: true,
              firstName: true,
              lastName: true,
              middleInitial: true,
              email: true,
              contactNumber: true,
              address: true,
              region: true,
              province: true,
              city: true,
              barangay: true,
              zipCode: true,
              guardianFirstName: true,
              guardianLastName: true,
              guardianContact: true,
              guardianAddress: true,
              schoolName: true,
              course: true,
              yearGraduated: true,
              gender: true,
              age: true,
              birthPlace: true,
              relationship: true
            }
          },
          program: {
            select: {
              title: true,
              category: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.enrollment.count({ where })
    ]);

    const formattedEnrollments = enrollments.map(enrollment => ({
      id: enrollment.id,
      enrollmentId: enrollment.enrollmentId,
      reviewType: enrollment.reviewType,
      status: enrollment.status,
      createdAt: enrollment.createdAt.toISOString(),
      student: enrollment.student
    }));

    return NextResponse.json({
      enrollments: formattedEnrollments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If status is REJECTED, delete the enrollment
    if (status === 'REJECTED') {
      await prisma.enrollment.delete({
        where: { id }
      });
      return NextResponse.json({ deleted: true });
    }

    // Update enrollment status
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id },
      data: { status },
      include: {
        student: {
          select: {
            id: true,
            studentId: true,
            firstName: true,
            lastName: true,
            middleInitial: true,
            email: true,
            contactNumber: true,
            address: true,
            region: true,
            province: true,
            city: true,
            barangay: true,
            zipCode: true,
            guardianFirstName: true,
            guardianLastName: true,
            guardianContact: true,
            guardianAddress: true,
            schoolName: true,
            course: true,
            yearGraduated: true,
            gender: true,
            age: true,
            birthPlace: true,
            relationship: true
          }
        }
      }
    });

    // If enrollment is completed, update student status to active
    if (status === 'COMPLETED') {
      await prisma.student.update({
        where: { id: updatedEnrollment.studentId },
        data: { status: 'active' }
      });
    }

    return NextResponse.json({
      enrollment: {
        id: updatedEnrollment.id,
        enrollmentId: updatedEnrollment.enrollmentId,
        reviewType: updatedEnrollment.reviewType,
        status: updatedEnrollment.status,
        createdAt: updatedEnrollment.createdAt.toISOString(),
        student: updatedEnrollment.student
      }
    });
  } catch (error) {
    console.error('Error updating enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to update enrollment' },
      { status: 500 }
    );
  }
}