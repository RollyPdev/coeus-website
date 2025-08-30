const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkStudentStatus() {
  try {
    console.log('📊 Checking student statuses...\n');

    // Count all students by status
    const statusCounts = await prisma.student.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    console.log('Student Status Breakdown:');
    statusCounts.forEach(group => {
      console.log(`  ${group.status}: ${group._count.status} students`);
    });

    // Total students
    const totalStudents = await prisma.student.count();
    console.log(`\nTotal Students: ${totalStudents}`);

    // Active students (what Student Management shows)
    const activeStudents = await prisma.student.count({
      where: { status: 'active' }
    });
    console.log(`Active Students: ${activeStudents}`);

    // Total enrollments
    const totalEnrollments = await prisma.enrollment.count();
    console.log(`Total Enrollments: ${totalEnrollments}`);

    // Show students with non-active status
    const nonActiveStudents = await prisma.student.findMany({
      where: {
        status: { not: 'active' }
      },
      select: {
        studentId: true,
        firstName: true,
        lastName: true,
        status: true
      }
    });

    if (nonActiveStudents.length > 0) {
      console.log('\n🔍 Non-Active Students:');
      nonActiveStudents.forEach(student => {
        console.log(`  ${student.studentId} - ${student.firstName} ${student.lastName} (${student.status})`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking student status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStudentStatus();