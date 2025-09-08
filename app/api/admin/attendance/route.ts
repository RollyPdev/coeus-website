import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const studentId = searchParams.get('studentId');
    
    if (date && !studentId) {
      // Ensure all active students have attendance records for the specified date
      await ensureAttendanceRecordsForDate(date);
    }
    
    const whereClause: any = {};
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      whereClause.date = {
        gte: startDate,
        lt: endDate
      };
    }
    
    if (studentId) {
      whereClause.studentId = studentId;
    }

    const attendance = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentId: true,
            photoUrl: true,
            schoolName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ attendance });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}

// Helper function to ensure all active students have attendance records for a specific date
async function ensureAttendanceRecordsForDate(dateString: string) {
  const targetDate = new Date(dateString);
  const startDate = new Date(targetDate);
  const endDate = new Date(targetDate);
  endDate.setDate(endDate.getDate() + 1);

  // Get all active students
  const activeStudents = await prisma.student.findMany({
    where: {
      status: 'active'
    },
    select: {
      id: true
    }
  });

  // Get existing attendance records for this date
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
  
  // Find students without attendance records for this date
  const studentsWithoutRecords = activeStudents.filter(
    student => !existingStudentIds.has(student.id)
  );

  // Create attendance records for students without records (default to 'absent')
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
}

export async function POST(request: NextRequest) {
  try {
    const { studentId, date, status, remarks } = await request.json();
    
    if (!studentId || !date || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure all students have records for this date first
    await ensureAttendanceRecordsForDate(date);

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
          remarks: status === 'absent' && remarks === 'Auto-generated record' ? null : (remarks || null)
        },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentId: true,
              photoUrl: true,
              schoolName: true
            }
          }
        }
      });
    } else {
      // Create new attendance record (this should rarely happen now)
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
              photoUrl: true,
              schoolName: true
            }
          }
        }
      });
    }

    return NextResponse.json({ attendance });
  } catch (error) {
    console.error('Error creating/updating attendance:', error);
    return NextResponse.json(
      { error: 'Failed to mark attendance' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status, remarks } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const attendance = await prisma.attendance.update({
      where: { id },
      data: {
        status,
        remarks: status === 'absent' && remarks === 'Auto-generated record' ? null : (remarks || null)
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentId: true,
            photoUrl: true,
            schoolName: true
          }
        }
      }
    });

    return NextResponse.json({ attendance });
  } catch (error) {
    console.error('Error updating attendance:', error);
    return NextResponse.json(
      { error: 'Failed to update attendance' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing attendance ID' },
        { status: 400 }
      );
    }

    await prisma.attendance.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    return NextResponse.json(
      { error: 'Failed to delete attendance' },
      { status: 500 }
    );
  }
}