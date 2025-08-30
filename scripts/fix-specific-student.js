const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixSpecificStudent() {
  try {
    console.log('🔄 Fixing specific student status...');
    
    // Update the student with COMPLETED enrollment to active
    const result = await prisma.student.update({
      where: { studentId: 'STU-92B1F8' },
      data: { status: 'active' }
    });
    
    console.log('✅ Updated student Rolly Paredes to active status');
    console.log('🎉 Fix completed!');
    
  } catch (error) {
    console.error('❌ Error fixing student:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSpecificStudent();