const { PrismaClient } = require('@prisma/client');

async function checkRecoveryOptions() {
  const directPrisma = new PrismaClient();
  
  try {
    console.log('🔍 CHECKING RECOVERY OPTIONS FOR ORIGINAL PHOTOS...');
    
    // Check if there's any audit trail or backup data
    console.log('\n1. Checking for any remaining photo data patterns...');
    
    // Look for students who might have had large data that was moved
    const studentsWithLargeData = await directPrisma.$queryRaw`
      SELECT 
        id, 
        "firstName", 
        "lastName", 
        "studentId",
        "createdAt",
        "updatedAt"
      FROM "Student" 
      WHERE "updatedAt" > "createdAt"
      ORDER BY "updatedAt" DESC
      LIMIT 10
    `;
    
    console.log(`📊 Students recently updated (potential photo data changes): ${studentsWithLargeData.length}`);
    studentsWithLargeData.forEach(row => {
      console.log({
        studentId: row.studentId,
        name: `${row.firstName} ${row.lastName}`,
        created: row.createdAt,
        updated: row.updatedAt
      });
    });
    
    // Check your specific record to see the data structure
    const yourRecord = await directPrisma.$queryRaw`
      SELECT 
        id, 
        "firstName", 
        "lastName", 
        "studentId",
        CASE WHEN photo IS NOT NULL THEN LENGTH(photo) ELSE 0 END as photo_size,
        SUBSTRING(photo, 1, 100) as photo_start
      FROM "Student" 
      WHERE "studentId" = 'STU-5B3C59'
    `;
    
    if (yourRecord.length > 0) {
      console.log('\n📸 Your photo data structure:');
      console.log({
        studentId: yourRecord[0].studentId,
        name: `${yourRecord[0].firstName} ${yourRecord[0].lastName}`,
        photoSize: yourRecord[0].photo_size,
        photoStart: yourRecord[0].photo_start
      });
    }
    
    console.log('\n💡 RECOVERY RECOMMENDATIONS:');
    console.log('1. If you have a database backup file (.sql or .dump), we can restore from that');
    console.log('2. If you have the original photo files, we can re-upload them');
    console.log('3. If photos were uploaded through the enrollment form, we might find them in browser cache');
    console.log('4. Check if you have any local backups or exports');
    
  } catch (error) {
    console.error('❌ Error checking recovery options:', error);
  } finally {
    await directPrisma.$disconnect();
  }
}

checkRecoveryOptions();