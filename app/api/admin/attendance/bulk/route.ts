import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { studentIds, date, status, remarks } = await request.json();
    
    if (!studentIds || !Array.isArray(studentIds) || !date || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const attendanceRecords = [];
    
    for (const studentId of studentIds) {
      // Check if attendance already exists for this student and date
      const existingAttendance = await prisma.attendance.findFirst({
        where: {
          studentId,
          date: {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
          }
        }
      });

      let attendance;
      if (existingAttendance) {
        // Update existing attendance
        attendance = await prisma.attendance.update({
          where: { id: existingAttendance.id },
          data: {
            status,
            remarks: remarks || null
          },
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentId: true,
                photo: true
              }
            }
          }
        });
      } else {
        // Create new attendance record
        attendance = await prisma.attendance.create({
          data: {
            studentId,
            date: new Date(date),
            status,
            remarks: remarks || null
          },
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentId: true,
                photo: true
              }
            }
          }
        });
      }
      
      attendanceRecords.push(attendance);
    }

    return NextResponse.json({ 
      message: `Bulk attendance marked for ${attendanceRecords.length} students`,
      attendance: attendanceRecords 
    });
  } catch (error) {
    console.error('Error marking bulk attendance:', error);
    return NextResponse.json(
      { error: 'Failed to mark bulk attendance' },
      { status: 500 }
    );
  }
}