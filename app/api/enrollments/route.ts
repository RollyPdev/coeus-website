import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate unique IDs
    const studentId = `STU-${randomUUID().substring(0, 6).toUpperCase()}`;
    const enrollmentId = `ENR-${randomUUID().substring(0, 8).toUpperCase()}`;
    
    // Test connection first
    await prisma.$connect();
    
    // Create student record with pending status
    const student = await prisma.student.create({
      data: {
        studentId,
        firstName: data.firstName,
        lastName: data.lastName,
        middleInitial: data.middleInitial || null,
        gender: data.gender,
        birthday: new Date(data.birthday),
        age: parseInt(data.age) || null,
        birthPlace: data.birthPlace,
        contactNumber: data.contactNumber,
        email: data.email,
        address: data.address,
        region: data.region || null,
        province: data.province || null,
        city: data.city || null,
        barangay: data.barangay || null,
        zipCode: data.zipCode || null,
        guardianFirstName: data.guardianFirstName,
        guardianLastName: data.guardianLastName,
        guardianMiddleInitial: data.guardianMiddleInitial || null,
        guardianContact: data.guardianContact,
        guardianAddress: data.guardianAddress,
        relationship: data.relationship || null,
        schoolName: data.schoolName || null,
        course: data.course || null,
        yearGraduated: data.yearGraduated || null,
        howDidYouHear: data.howDidYouHear || null,
        referredBy: data.referredBy || null,
        photoUrl: data.photo || null,
        status: "pending" // Set to pending until admin approval
      }
    });

    // Create enrollment record with pending status
    const enrollment = await prisma.enrollment.create({
      data: {
        enrollmentId,
        studentId: student.id,
        reviewType: data.reviewType,
        startDate: new Date(),
        paymentMethod: data.paymentMethod || 'pending',
        amount: parseFloat(data.amount || '0'),
        status: "pending" // Enrollment starts as pending
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      studentId: studentId,
      enrollmentId: enrollmentId,
      message: 'Enrollment submitted successfully' 
    });
  } catch (error: any) {
    console.error('Error creating enrollment:', error);
    
    // Handle specific Prisma Accelerate errors
    if (error.code === 'P5010') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database connection failed. Please check your internet connection and try again.',
          error: 'CONNECTION_ERROR'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to submit enrollment' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}