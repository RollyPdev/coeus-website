import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate unique IDs
    const studentId = `STU-${randomUUID().substring(0, 6).toUpperCase()}`;
    const enrollmentId = `ENR-${randomUUID().substring(0, 8).toUpperCase()}`;
    const transactionId = `TRX-${randomUUID().substring(0, 10).toUpperCase()}`;
    
    // Create student record
    const student = await prisma.student.create({
      data: {
        studentId: studentId,
        firstName: data.firstName,
        lastName: data.lastName,
        middleInitial: data.middleInitial,
        gender: data.gender,
        birthday: new Date(data.birthday),
        birthPlace: data.birthPlace,
        contactNumber: data.contactNumber,
        email: data.email,
        address: data.address,
        guardianFirstName: data.guardianFirstName,
        guardianLastName: data.guardianLastName,
        guardianMiddleInitial: data.guardianMiddleInitial,
        guardianContact: data.guardianContact,
        guardianAddress: data.guardianAddress,
        photoUrl: data.photo,
      },
    });
    
    // Create enrollment record
    const enrollment = await prisma.enrollment.create({
      data: {
        enrollmentId: enrollmentId,
        studentId: student.id,
        reviewType: data.reviewType,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)), // 6 months from now
        paymentMethod: data.paymentMethod,
        amount: parseFloat(data.amount),
        payments: {
          create: {
            transactionId: transactionId,
            amount: parseFloat(data.amount),
            paymentMethod: data.paymentMethod,
            paymentDate: new Date(),
            status: 'completed',
          }
        }
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      studentId: studentId,
      enrollmentId: enrollmentId,
      message: 'Enrollment submitted successfully' 
    });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit enrollment' },
      { status: 500 }
    );
  }
}