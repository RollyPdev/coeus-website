import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { studentIds, date, status, remarks } = await request.json();
    
    if (!studentIds || !Array.isArray(studentIds) || !date || !status) {
      return NextResponse.json(
        { error: 'Missing required fields or invalid studentIds array' },
        { status: 400 }
      );
    }

    const targetDate = new Date(date);
    const startDate = new Date(targetDate);
    const endDate = new Date(targetDate);
    endDate.setDate(endDate.getDate() + 1);

    // Update attendance for all specified students
    const updatedAttendance = await prisma.attendance.updateMany({
      where: {
        studentId: {
          in: studentIds
        },
        date: {
          gte: startDate,
          lt: endDate
        }
      },
      data: {
        status,
        remarks: remarks || null
      }
    });

    return NextResponse.json({ 
      message: `Bulk attendance updated for ${updatedAttendance.count} students`,
      updatedCount: updatedAttendance.count
    });
  } catch (error) {
    console.error('Error updating bulk attendance:', error);
    return NextResponse.json(
      { error: 'Failed to update bulk attendance' },
      { status: 500 }
    );
  }
}

// New endpoint to mark all students as present/absent for a specific date
export async function PUT(request: NextRequest) {
  try {
    const { date, status, remarks } = await request.json();
    
    if (!date || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const targetDate = new Date(date);
    const startDate = new Date(targetDate);
    const endDate = new Date(targetDate);
    endDate.setDate(endDate.getDate() + 1);

    // First ensure all active students have records for this date
    const activeStudents = await prisma.student.findMany({
      where: {
        status: 'active'
      },
      select: {
        id: true
      }
    });

    const existingAttendance = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate
        }
      },
      select: {
        studentId: true
      }
    });

    const existingStudentIds = new Set(existingAttendance.map(a => a.studentId));
    const studentsWithoutRecords = activeStudents.filter(
      student => !existingStudentIds.has(student.id)
    );

    // Create records for students without attendance
    if (studentsWithoutRecords.length > 0) {
      const attendanceRecords = studentsWithoutRecords.map(student => ({
        studentId: student.id,
        date: targetDate,
        status: 'absent',
        remarks: 'Auto-generated record'
      }));

      await prisma.attendance.createMany({
        data: attendanceRecords
      });
    }

    // Update all attendance records for this date
    const updatedAttendance = await prisma.attendance.updateMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate
        }
      },
      data: {
        status,
        remarks: remarks || null
      }
    });

    return NextResponse.json({ 
      message: `All students marked as ${status} for ${date}`,
      updatedCount: updatedAttendance.count
    });
  } catch (error) {
    console.error('Error updating all attendance:', error);
    return NextResponse.json(
      { error: 'Failed to update all attendance' },
      { status: 500 }
    );
  }
}