import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate unique IDs
    const studentId = `STU-${randomUUID().substring(0, 6).toUpperCase()}`;
    const enrollmentId = `ENR-${randomUUID().substring(0, 8).toUpperCase()}`;
    
    // In a real app, we would save this to the database
    // For now, we'll just return the IDs for the demo
    
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