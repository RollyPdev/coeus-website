const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixPendingStudent() {
  try {
    console.log('🔧 Updating pending student to active...\n');

    const result = await prisma.student.updateMany({
      where: { status: 'pending' },
      data: { status: 'active' }
    });

    console.log(`✅ Updated ${result.count} student(s) from pending to active`);

    // Verify the fix
    const activeCount = await prisma.student.count({
      where: { status: 'active' }
    });
    
    const totalCount = await prisma.student.count();

    console.log(`\nVerification:`);
    console.log(`  Active Students: ${activeCount}`);
    console.log(`  Total Students: ${totalCount}`);
    console.log(`  All students should now be visible in Student Management!`);

  } catch (error) {
    console.error('❌ Error fixing pending student:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPendingStudent();