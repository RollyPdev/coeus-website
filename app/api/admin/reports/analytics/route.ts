import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'overview';
    const period = searchParams.get('period') || '30d';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      };
    } else {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const startDateCalc = new Date();
      startDateCalc.setDate(startDateCalc.getDate() - days);
      dateFilter = {
        createdAt: { gte: startDateCalc }
      };
    }

    switch (reportType) {
      case 'enrollment':
        return NextResponse.json(await getEnrollmentAnalytics(dateFilter));
      case 'attendance':
        return NextResponse.json(await getAttendanceAnalytics(dateFilter));
      case 'financial':
        return NextResponse.json(await getFinancialAnalytics(dateFilter));
      case 'student':
        return NextResponse.json(await getStudentAnalytics(dateFilter));
      case 'overview':
      default:
        return NextResponse.json(await getOverviewAnalytics(dateFilter));
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

async function getOverviewAnalytics(dateFilter: any) {
  const [
    totalStudents,
    activeStudents,
    totalEnrollments,
    completedEnrollments,
    totalRevenue,
    averageAttendance,
    recentEnrollments,
    topPrograms
  ] = await Promise.all([
    prisma.student.count(),
    prisma.student.count({ where: { status: 'active' } }),
    prisma.enrollment.count({ where: dateFilter }),
    prisma.enrollment.count({ where: { ...dateFilter, status: 'COMPLETED' } }),
    prisma.payment.aggregate({
      where: { status: 'completed', ...dateFilter },
      _sum: { amount: true }
    }),
    // Calculate attendance rate manually
    prisma.attendance.count({ where: { ...dateFilter, status: 'present' } }).then(present => 
      prisma.attendance.count({ where: dateFilter }).then(total => 
        total > 0 ? (present / total) * 100 : 85
      )
    ),
    prisma.enrollment.findMany({
      where: dateFilter,
      include: {
        student: { select: { firstName: true, lastName: true, studentId: true } },
        program: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.enrollment.groupBy({
      by: ['reviewType'],
      where: dateFilter,
      _count: { reviewType: true },
      orderBy: { _count: { reviewType: 'desc' } },
      take: 5
    })
  ]);

  return {
    overview: {
      totalStudents,
      activeStudents,
      totalEnrollments,
      completedEnrollments,
      completionRate: totalEnrollments > 0 ? ((completedEnrollments / totalEnrollments) * 100).toFixed(1) : '0',
      totalRevenue: totalRevenue._sum.amount || 0,
      averageAttendance: averageAttendance
    },
    recentEnrollments,
    topPrograms,
    trends: await getEnrollmentTrends(dateFilter)
  };
}

async function getEnrollmentAnalytics(dateFilter: any) {
  const [
    enrollmentsByStatus,
    enrollmentsByProgram,
    enrollmentsByMonth,
    enrollmentsByPaymentStatus
  ] = await Promise.all([
    prisma.enrollment.groupBy({
      by: ['status'],
      where: dateFilter,
      _count: { status: true }
    }),
    prisma.enrollment.groupBy({
      by: ['reviewType'],
      where: dateFilter,
      _count: { reviewType: true },
      orderBy: { _count: { reviewType: 'desc' } }
    }),
    getMonthlyEnrollments(dateFilter),
    prisma.enrollment.groupBy({
      by: ['paymentStatus'],
      where: dateFilter,
      _count: { paymentStatus: true }
    })
  ]);

  return {
    statusDistribution: enrollmentsByStatus,
    programDistribution: enrollmentsByProgram,
    monthlyTrends: enrollmentsByMonth,
    paymentStatusDistribution: enrollmentsByPaymentStatus
  };
}

async function getAttendanceAnalytics(dateFilter: any) {
  const [
    attendanceByStatus,
    attendanceByMonth,
    studentAttendanceRates,
    attendanceByProgram
  ] = await Promise.all([
    prisma.attendance.groupBy({
      by: ['status'],
      where: dateFilter,
      _count: { status: true }
    }),
    getMonthlyAttendance(dateFilter),
    prisma.attendance.groupBy({
      by: ['studentId'],
      where: dateFilter,
      _count: { status: true },
      having: { status: { _count: { gt: 0 } } },
      take: 10
    }),
    prisma.attendance.findMany({
      where: dateFilter,
      include: {
        student: {
          include: {
            enrollments: {
              select: { reviewType: true },
              take: 1
            }
          }
        }
      },
      take: 1000
    }).then(data => {
      const programAttendance: Record<string, { present: number; total: number }> = {};
      data.forEach(att => {
        const program = att.student.enrollments[0]?.reviewType || 'Unknown';
        if (!programAttendance[program]) {
          programAttendance[program] = { present: 0, total: 0 };
        }
        programAttendance[program].total++;
        if (att.status === 'present') {
          programAttendance[program].present++;
        }
      });
      return Object.entries(programAttendance).map(([program, data]) => ({
        program,
        attendanceRate: ((data.present / data.total) * 100).toFixed(1),
        totalSessions: data.total
      }));
    })
  ]);

  return {
    statusDistribution: attendanceByStatus,
    monthlyTrends: attendanceByMonth,
    topStudents: studentAttendanceRates,
    programAttendance: attendanceByProgram
  };
}

async function getFinancialAnalytics(dateFilter: any) {
  const [
    revenueByMethod,
    revenueByMonth,
    revenueByProgram,
    paymentStatusDistribution,
    averagePaymentAmount,
    outstandingBalances
  ] = await Promise.all([
    prisma.payment.groupBy({
      by: ['paymentMethod'],
      where: { status: 'completed', ...dateFilter },
      _sum: { amount: true },
      _count: { paymentMethod: true }
    }),
    getMonthlyRevenue(dateFilter),
    prisma.payment.findMany({
      where: { status: 'completed', ...dateFilter },
      include: {
        enrollment: {
          select: { reviewType: true }
        }
      }
    }).then(payments => {
      const programRevenue: Record<string, number> = {};
      payments.forEach(payment => {
        const program = payment.enrollment.reviewType;
        programRevenue[program] = (programRevenue[program] || 0) + payment.amount;
      });
      return Object.entries(programRevenue).map(([program, revenue]) => ({
        program,
        revenue,
        count: payments.filter(p => p.enrollment.reviewType === program).length
      }));
    }),
    prisma.payment.groupBy({
      by: ['status'],
      where: dateFilter,
      _count: { status: true },
      _sum: { amount: true }
    }),
    prisma.payment.aggregate({
      where: { status: 'completed', ...dateFilter },
      _avg: { amount: true }
    }),
    prisma.enrollment.aggregate({
      where: dateFilter,
      _sum: { remainingBalance: true }
    })
  ]);

  return {
    revenueByMethod,
    monthlyRevenue: revenueByMonth,
    programRevenue: revenueByProgram,
    paymentStatus: paymentStatusDistribution,
    averagePayment: averagePaymentAmount._avg.amount || 0,
    outstandingBalance: outstandingBalances._sum.remainingBalance || 0
  };
}

async function getStudentAnalytics(dateFilter: any) {
  const [
    studentsByStatus,
    studentsByProgram,
    studentsByAge,
    studentsByGender,
    monthlyRegistrations,
    topPerformers
  ] = await Promise.all([
    prisma.student.groupBy({
      by: ['status'],
      where: dateFilter,
      _count: { status: true }
    }),
    prisma.student.findMany({
      where: dateFilter,
      include: {
        enrollments: {
          select: { reviewType: true },
          take: 1
        }
      }
    }).then(students => {
      const programCounts: Record<string, number> = {};
      students.forEach(student => {
        const program = student.enrollments[0]?.reviewType || 'No Program';
        programCounts[program] = (programCounts[program] || 0) + 1;
      });
      return Object.entries(programCounts).map(([program, count]) => ({ program, count }));
    }),
    prisma.student.findMany({
      where: dateFilter,
      select: { birthday: true }
    }).then(students => {
      const ageGroups = { '18-25': 0, '26-35': 0, '36-45': 0, '46+': 0 };
      const currentYear = new Date().getFullYear();
      students.forEach(student => {
        const age = currentYear - new Date(student.birthday).getFullYear();
        if (age <= 25) ageGroups['18-25']++;
        else if (age <= 35) ageGroups['26-35']++;
        else if (age <= 45) ageGroups['36-45']++;
        else ageGroups['46+']++;
      });
      return Object.entries(ageGroups).map(([range, count]) => ({ ageRange: range, count }));
    }),
    prisma.student.groupBy({
      by: ['gender'],
      where: dateFilter,
      _count: { gender: true }
    }),
    getMonthlyStudentRegistrations(dateFilter),
    prisma.student.findMany({
      where: { ...dateFilter, status: 'active' },
      include: {
        attendances: {
          select: { status: true }
        },
        examResults: {
          select: { percentage: true }
        }
      },
      take: 10
    }).then(students => {
      return students.map(student => {
        const attendanceRate = student.attendances.length > 0 
          ? (student.attendances.filter(a => a.status === 'present').length / student.attendances.length) * 100
          : 0;
        const avgExamScore = student.examResults.length > 0
          ? student.examResults.reduce((sum, exam) => sum + exam.percentage, 0) / student.examResults.length
          : 0;
        
        return {
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          studentId: student.studentId,
          attendanceRate: attendanceRate.toFixed(1),
          avgExamScore: avgExamScore.toFixed(1),
          totalExams: student.examResults.length
        };
      }).sort((a, b) => parseFloat(b.avgExamScore) - parseFloat(a.avgExamScore));
    })
  ]);

  return {
    statusDistribution: studentsByStatus,
    programDistribution: studentsByProgram,
    ageDistribution: studentsByAge,
    genderDistribution: studentsByGender,
    monthlyRegistrations,
    topPerformers
  };
}

// Helper functions for time-series data
async function getEnrollmentTrends(dateFilter: any) {
  // Simplified enrollment trends for overview
  const data = await prisma.enrollment.findMany({
    where: dateFilter,
    select: { createdAt: true, status: true }
  });

  const trendsMap: Record<string, { completed: number; pending: number; total: number }> = {};
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    trendsMap[dateKey] = { completed: 0, pending: 0, total: 0 };
  }

  data.forEach(enrollment => {
    const dateKey = enrollment.createdAt.toISOString().split('T')[0];
    if (trendsMap[dateKey]) {
      trendsMap[dateKey].total++;
      if (enrollment.status === 'COMPLETED') {
        trendsMap[dateKey].completed++;
      } else {
        trendsMap[dateKey].pending++;
      }
    }
  });

  return Object.entries(trendsMap).map(([date, counts]) => ({
    date,
    label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    ...counts
  }));
}

async function getMonthlyEnrollments(dateFilter: any) {
  const data = await prisma.enrollment.findMany({
    where: dateFilter,
    select: { createdAt: true, status: true }
  });

  const monthlyMap: Record<string, { completed: number; pending: number; total: number }> = {};
  data.forEach(enrollment => {
    const monthKey = enrollment.createdAt.toISOString().substring(0, 7); // YYYY-MM
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { completed: 0, pending: 0, total: 0 };
    }
    monthlyMap[monthKey].total++;
    if (enrollment.status === 'COMPLETED') {
      monthlyMap[monthKey].completed++;
    } else {
      monthlyMap[monthKey].pending++;
    }
  });

  return Object.entries(monthlyMap).map(([month, counts]) => ({
    month,
    label: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    ...counts
  }));
}

async function getMonthlyAttendance(dateFilter: any) {
  const data = await prisma.attendance.findMany({
    where: dateFilter,
    select: { date: true, status: true }
  });

  const monthlyMap: Record<string, { present: number; absent: number; total: number }> = {};
  data.forEach(attendance => {
    const monthKey = attendance.date.toISOString().substring(0, 7);
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { present: 0, absent: 0, total: 0 };
    }
    monthlyMap[monthKey].total++;
    if (attendance.status === 'present') {
      monthlyMap[monthKey].present++;
    } else {
      monthlyMap[monthKey].absent++;
    }
  });

  return Object.entries(monthlyMap).map(([month, counts]) => ({
    month,
    label: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    attendanceRate: counts.total > 0 ? ((counts.present / counts.total) * 100).toFixed(1) : '0',
    ...counts
  }));
}

async function getMonthlyRevenue(dateFilter: any) {
  const data = await prisma.payment.findMany({
    where: { status: 'completed', ...dateFilter },
    select: { paymentDate: true, amount: true }
  });

  const monthlyMap: Record<string, number> = {};
  data.forEach(payment => {
    const monthKey = payment.paymentDate.toISOString().substring(0, 7);
    monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + payment.amount;
  });

  return Object.entries(monthlyMap).map(([month, revenue]) => ({
    month,
    label: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    revenue
  }));
}

async function getMonthlyStudentRegistrations(dateFilter: any) {
  const data = await prisma.student.findMany({
    where: dateFilter,
    select: { createdAt: true, status: true }
  });

  const monthlyMap: Record<string, number> = {};
  data.forEach(student => {
    const monthKey = student.createdAt.toISOString().substring(0, 7);
    monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + 1;
  });

  return Object.entries(monthlyMap).map(([month, count]) => ({
    month,
    label: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    registrations: count
  }));
}