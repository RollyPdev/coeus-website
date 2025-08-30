import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const enrollments = await prisma.enrollment.findMany({
      select: {
        id: true,
        enrollmentId: true,
        reviewType: true,
        status: true,
        createdAt: true,
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            contactNumber: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: skip
    });

    const total = await prisma.enrollment.count();

    return NextResponse.json({
      enrollments,
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

    if (status === 'REJECTED') {
      // Delete the enrollment and associated student record
      const enrollment = await prisma.enrollment.findUnique({
        where: { id },
        include: { student: true }
      });
      
      if (enrollment) {
        // Delete enrollment first, then student (correct order for foreign key constraints)
        await prisma.enrollment.delete({
          where: { id }
        });
        
        await prisma.student.delete({
          where: { id: enrollment.studentId }
        });
      }
      
      return NextResponse.json({ deleted: true });
    }

    // Update enrollment status
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id },
      data: { status }
    });

    // Only set student status to active when enrollment is COMPLETED
    if (status === 'COMPLETED' || status === 'completed') {
      await prisma.student.update({
        where: { id: updatedEnrollment.studentId },
        data: { status: 'active' }
      });
    }
    
    // Set student status to pending when enrollment is VERIFIED (approved but not completed)
    if (status === 'VERIFIED' || status === 'verified') {
      await prisma.student.update({
        where: { id: updatedEnrollment.studentId },
        data: { status: 'pending' }
      });
    }

    return NextResponse.json(updatedEnrollment);
  } catch (error) {
    console.error('Error updating enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to update enrollment' },
      { status: 500 }
    );
  }
}