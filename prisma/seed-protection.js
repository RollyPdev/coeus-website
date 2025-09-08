const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDataExists() {
  const studentCount = await prisma.student.count();
  const enrollmentCount = await prisma.enrollment.count();
  
  if (studentCount > 0 || enrollmentCount > 0) {
    console.error('🚨 DATABASE PROTECTION: Database contains data!');
    console.error(`Found ${studentCount} students and ${enrollmentCount} enrollments`);
    console.error('Use --force flag to override protection');
    process.exit(1);
  }
  
  console.log('✅ Database is empty, safe to proceed');
}

module.exports = { checkDataExists };