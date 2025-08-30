const { PrismaClient } = require('@prisma/client');

async function resetDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Resetting database...');
    
    // Drop all tables in correct order (reverse of dependencies)
    const dropTables = [
      'ScheduleAttendance',
      'GoodMoral', 
      'Payment',
      'ExamResult',
      'Attendance',
      'Enrollment',
      'Student',
      'Schedule'
    ];
    
    for (const table of dropTables) {
      try {
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
        console.log(`✅ Dropped table: ${table}`);
      } catch (error) {
        console.log(`⚠️  Table ${table} doesn't exist or couldn't be dropped`);
      }
    }
    
    console.log('✅ Database reset complete');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();