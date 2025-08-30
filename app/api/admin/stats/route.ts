import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const db = prisma as any;

export async function GET() {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      studentsCount,
      studentsLastMonth,
      enrollmentsCount,
      enrollmentsLastWeek,
      goodMoralsCount,
      goodMoralsLastMonth,
      paymentsSum,
      paymentsLastMonth,
      lecturersCount,
      lecturersLastMonth,
      totalAttendance,
      presentAttendance
    ] = await Promise.all([
      db.student.count({ where: { status: 'active' } }),
      db.student.count({ where: { createdAt: { lt: lastMonth }, status: 'active' } }),
      db.enrollment.count({ where: { status: 'COMPLETED' } }),
      db.enrollment.count({ where: { createdAt: { lt: lastWeek }, status: 'COMPLETED' } }),
      db.goodMoral.count(),
      db.goodMoral.count({ where: { createdAt: { lt: lastMonth } } }),
      db.payment.aggregate({ _sum: { amount: true } }),
      db.payment.aggregate({ 
        _sum: { amount: true },
        where: { createdAt: { lt: lastMonth } }
      }),
      db.lecturer.count(),
      db.lecturer.count({ where: { createdAt: { lt: lastMonth } } }),
      db.attendance.count(),
      db.attendance.count({ where: { status: 'present' } })
    ]);

    const studentsGrowth = studentsLastMonth > 0 ? 
      ((studentsCount - studentsLastMonth) / studentsLastMonth * 100).toFixed(1) : '0';
    
    const enrollmentsGrowth = enrollmentsLastWeek > 0 ? 
      ((enrollmentsCount - enrollmentsLastWeek) / enrollmentsLastWeek * 100).toFixed(1) : '0';
    
    const goodMoralsGrowth = goodMoralsLastMonth > 0 ? 
      ((goodMoralsCount - goodMoralsLastMonth) / goodMoralsLastMonth * 100).toFixed(1) : '0';
    
    const paymentsGrowth = (paymentsLastMonth._sum.amount || 0) > 0 ? 
      (((paymentsSum._sum.amount || 0) - (paymentsLastMonth._sum.amount || 0)) / (paymentsLastMonth._sum.amount || 0) * 100).toFixed(1) : '0';
    
    const lecturersGrowth = lecturersCount - lecturersLastMonth;
    
    const attendanceRate = totalAttendance > 0 ? 
      ((presentAttendance / totalAttendance) * 100).toFixed(1) : '0';

    const stats = {
      students: studentsCount,
      studentsGrowth: parseFloat(studentsGrowth),
      enrollments: enrollmentsCount,
      enrollmentsGrowth: parseFloat(enrollmentsGrowth),
      attendance: parseFloat(attendanceRate),
      attendanceChange: -2, // Placeholder - would need historical data
      goodMorals: goodMoralsCount,
      goodMoralsGrowth: parseFloat(goodMoralsGrowth),
      payments: paymentsSum._sum.amount || 0,
      paymentsGrowth: parseFloat(paymentsGrowth),
      lecturers: lecturersCount,
      lecturersNew: lecturersGrowth
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({
      students: 0, studentsGrowth: 0,
      enrollments: 0, enrollmentsGrowth: 0,
      attendance: 0, attendanceChange: 0,
      goodMorals: 0, goodMoralsGrowth: 0,
      payments: 0, paymentsGrowth: 0,
      lecturers: 0, lecturersNew: 0
    });
  }
}
