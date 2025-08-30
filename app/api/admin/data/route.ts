import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [
      users,
      students,
      enrollments,
      lecturers,
      newsEvents,
      programs,
      payments,
      attendance,
      goodMorals
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.student.findMany(),
      prisma.enrollment.findMany(),
      prisma.lecturer.findMany(),
      prisma.newsEvent.findMany(),
      prisma.program.findMany(),
      prisma.payment.findMany(),
      prisma.attendance.findMany(),
      prisma.goodMoral.findMany()
    ]);

    return NextResponse.json({
      users: users.length,
      students: students.length,
      enrollments: enrollments.length,
      lecturers: lecturers.length,
      newsEvents: newsEvents.length,
      programs: programs.length,
      payments: payments.length,
      attendance: attendance.length,
      goodMorals: goodMorals.length,
      data: {
        users: users.map(u => ({ id: u.id, email: u.email, name: u.name })),
        students: students.slice(0, 5).map(s => ({ 
          id: s.id, 
          studentId: s.studentId, 
          name: `${s.firstName} ${s.lastName}`,
          email: s.email 
        })),
        lecturers: lecturers.map(l => ({ 
          id: l.id, 
          name: l.name, 
          position: l.position,
          category: l.category 
        })),
        newsEvents: newsEvents.map(n => ({ 
          id: n.id, 
          title: n.title, 
          category: n.category,
          date: n.date 
        })),
        programs: programs.map(p => ({ 
          id: p.id, 
          title: p.title, 
          category: p.category,
          price: p.price 
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching database data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch database data' },
      { status: 500 }
    );
  }
}