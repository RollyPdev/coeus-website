import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: true // Include student data for display
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Map the data to match frontend interface
    const mappedEnrollments = enrollments.map(enrollment => ({
      id: enrollment.id,
      firstName: enrollment.student?.firstName || '',
      lastName: enrollment.student?.lastName || '',
      email: enrollment.student?.email || '',
      contactNumber: enrollment.student?.contactNumber || '',
      reviewType: enrollment.reviewType,
      status: enrollment.status,
      createdAt: enrollment.createdAt,
      // Include complete student data for modal
      student: {
        id: enrollment.student?.id || '',
        firstName: enrollment.student?.firstName || '',
        lastName: enrollment.student?.lastName || '',
        middleInitial: enrollment.student?.middleInitial || '',
        email: enrollment.student?.email || '',
        contactNumber: enrollment.student?.contactNumber || '',
        address: enrollment.student?.address || '',
        region: enrollment.student?.region || '',
        province: enrollment.student?.province || '',
        city: enrollment.student?.city || '',
        barangay: enrollment.student?.barangay || '',
        zipCode: enrollment.student?.zipCode || '',
        guardianFirstName: enrollment.student?.guardianFirstName || '',
        guardianLastName: enrollment.student?.guardianLastName || '',
        guardianContact: enrollment.student?.guardianContact || '',
        guardianAddress: enrollment.student?.guardianAddress || '',
        schoolName: enrollment.student?.schoolName || '',
        course: enrollment.student?.course || '',
        yearGraduated: enrollment.student?.yearGraduated || ''
      }
    }));

    return NextResponse.json(mappedEnrollments);
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