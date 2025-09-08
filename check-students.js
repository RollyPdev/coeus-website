const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkStudents() {
  try {
    const studentCount = await prisma.student.count();
    console.log(`Total students: ${studentCount}`);
    
    if (studentCount > 0) {
      const students = await prisma.student.findMany({
        take: 5,
        select: {
          id: true,
          studentId: true,
          firstName: true,
          lastName: true,
          email: true,
          status: true,
          createdAt: true
        }
      });
      
      console.log('\nFirst 5 students:');
      students.forEach(student => {
        console.log(`- ${student.studentId}: ${student.firstName} ${student.lastName} (${student.email}) - ${student.status}`);
      });
    } else {
      console.log('No students found in the database.');
    }
  } catch (error) {
    console.error('Error checking students:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStudents();