const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyStudentCount() {
  try {
    console.log('🔍 Verifying student counts...\n');

    // Total students
    const totalStudents = await prisma.student.count();
    console.log(`Total Students in Database: ${totalStudents}`);

    // Active students (what API returns)
    const activeStudents = await prisma.student.count({
      where: { status: 'active' }
    });
    console.log(`Active Students (API shows): ${activeStudents}`);

    // Get first 10 students (what table shows on page 1)
    const first10Students = await prisma.student.findMany({
      where: { status: 'active' },
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        studentId: true,
        firstName: true,
        lastName: true,
        status: true
      }
    });

    console.log(`\nFirst 10 Students (Page 1 of table):`);
    first10Students.forEach((student, index) => {
      console.log(`  ${index + 1}. ${student.studentId} - ${student.firstName} ${student.lastName} (${student.status})`);
    });

    // Check if there are more students (page 2)
    const remainingStudents = await prisma.student.findMany({
      where: { status: 'active' },
      skip: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        studentId: true,
        firstName: true,
        lastName: true,
        status: true
      }
    });

    if (remainingStudents.length > 0) {
      console.log(`\nRemaining Students (Page 2+):`);
      remainingStudents.forEach((student, index) => {
        console.log(`  ${index + 11}. ${student.studentId} - ${student.firstName} ${student.lastName} (${student.status})`);
      });
    }

    console.log(`\n✅ Summary:`);
    console.log(`  - Statistics boxes show: ${activeStudents} students (correct)`);
    console.log(`  - Table shows: 10 students per page (pagination)`);
    console.log(`  - Total pages needed: ${Math.ceil(activeStudents / 10)}`);

  } catch (error) {
    console.error('❌ Error verifying student count:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyStudentCount();