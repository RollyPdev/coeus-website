const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAllData() {
  try {
    console.log('Checking database tables...\n');
    
    const tables = [
      'student',
      'enrollment', 
      'payment',
      'lecturer',
      'newsEvent',
      'program',
      'user',
      'testimonial'
    ];
    
    for (const table of tables) {
      try {
        const count = await prisma[table].count();
        console.log(`${table}: ${count} records`);
      } catch (error) {
        console.log(`${table}: Error - ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllData();