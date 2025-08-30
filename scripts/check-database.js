const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database contents...\n');
    
    // Check students
    const students = await prisma.student.findMany({
      include: {
        enrollments: true
      }
    });
    
    console.log(`👥 Students (${students.length}):`);
    students.forEach(student => {
      console.log(`  - ${student.firstName} ${student.lastName} (${student.studentId}) - Status: ${student.status}`);
      student.enrollments.forEach(enrollment => {
        console.log(`    └── Enrollment: ${enrollment.enrollmentId} - Status: ${enrollment.status}`);
      });
    });
    
    console.log('\n📋 Enrollments:');
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            studentId: true
          }
        }
      }
    });
    
    enrollments.forEach(enrollment => {
      console.log(`  - ${enrollment.enrollmentId}: ${enrollment.student?.firstName} ${enrollment.student?.lastName} - Status: ${enrollment.status}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();