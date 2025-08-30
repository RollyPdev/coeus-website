const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testStudentsAPI() {
  try {
    console.log('🔍 Testing Students API...\n');

    // Test what the API should return
    const students = await prisma.student.findMany({
      where: {
        status: 'active'
      },
      include: {
        enrollments: {
          select: {
            enrollmentId: true,
            reviewType: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`Found ${students.length} active students:`);
    students.forEach((student, index) => {
      console.log(`  ${index + 1}. ${student.studentId} - ${student.firstName} ${student.lastName} (${student.status})`);
    });

    console.log('\nAPI Response format:');
    console.log(JSON.stringify({ students: students.slice(0, 2) }, null, 2));

  } catch (error) {
    console.error('❌ Error testing API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testStudentsAPI();