const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function restoreDatabase(backupFileName) {
  const prisma = new PrismaClient();
  const backupDir = path.join(__dirname, 'database-backups');
  const backupFile = path.join(backupDir, backupFileName);
  
  if (!fs.existsSync(backupFile)) {
    console.error(`❌ Backup file not found: ${backupFile}`);
    console.log('\n📁 Available backups:');
    const files = fs.readdirSync(backupDir).filter(f => f.startsWith('backup-') && f.endsWith('.json'));
    files.forEach(file => console.log(`   ${file}`));
    return;
  }
  
  try {
    console.log('🔄 Restoring database from backup...');
    console.log(`📁 Using backup: ${backupFile}`);
    
    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    console.log('⚠️  WARNING: This will DELETE all current data and restore from backup!');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Clear existing data (in reverse order due to foreign keys)
    console.log('🗑️  Clearing existing data...');
    await prisma.paymentAuditLog.deleteMany();
    await prisma.paymentReminder.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.scheduleAttendance.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.examResult.deleteMany();
    await prisma.goodMoral.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.student.deleteMany();
    await prisma.schedule.deleteMany();
    await prisma.user.deleteMany();
    await prisma.program.deleteMany();
    await prisma.lecturer.deleteMany();
    await prisma.newsEvent.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.siteSettings.deleteMany();
    await prisma.aboutContent.deleteMany();
    
    // Restore data
    console.log('📋 Restoring Students...');
    if (backup.tables.students?.length > 0) {
      await prisma.student.createMany({ data: backup.tables.students });
    }
    
    console.log('📋 Restoring Programs...');
    if (backup.tables.programs?.length > 0) {
      await prisma.program.createMany({ data: backup.tables.programs });
    }
    
    console.log('📋 Restoring Users...');
    if (backup.tables.users?.length > 0) {
      await prisma.user.createMany({ data: backup.tables.users });
    }
    
    console.log('📋 Restoring Enrollments...');
    if (backup.tables.enrollments?.length > 0) {
      await prisma.enrollment.createMany({ data: backup.tables.enrollments });
    }
    
    console.log('📋 Restoring Payments...');
    if (backup.tables.payments?.length > 0) {
      await prisma.payment.createMany({ data: backup.tables.payments });
    }
    
    console.log('📋 Restoring Lecturers...');
    if (backup.tables.lecturers?.length > 0) {
      await prisma.lecturer.createMany({ data: backup.tables.lecturers });
    }
    
    console.log('📋 Restoring News & Events...');
    if (backup.tables.newsEvents?.length > 0) {
      await prisma.newsEvent.createMany({ data: backup.tables.newsEvents });
    }
    
    console.log('📋 Restoring Good Morals...');
    if (backup.tables.goodMorals?.length > 0) {
      await prisma.goodMoral.createMany({ data: backup.tables.goodMorals });
    }
    
    console.log('📋 Restoring Attendances...');
    if (backup.tables.attendances?.length > 0) {
      await prisma.attendance.createMany({ data: backup.tables.attendances });
    }
    
    console.log('📋 Restoring other tables...');
    if (backup.tables.examResults?.length > 0) {
      await prisma.examResult.createMany({ data: backup.tables.examResults });
    }
    if (backup.tables.schedules?.length > 0) {
      await prisma.schedule.createMany({ data: backup.tables.schedules });
    }
    if (backup.tables.scheduleAttendances?.length > 0) {
      await prisma.scheduleAttendance.createMany({ data: backup.tables.scheduleAttendances });
    }
    if (backup.tables.paymentReminders?.length > 0) {
      await prisma.paymentReminder.createMany({ data: backup.tables.paymentReminders });
    }
    if (backup.tables.paymentAuditLogs?.length > 0) {
      await prisma.paymentAuditLog.createMany({ data: backup.tables.paymentAuditLogs });
    }
    if (backup.tables.siteSettings?.length > 0) {
      await prisma.siteSettings.createMany({ data: backup.tables.siteSettings });
    }
    if (backup.tables.aboutContent?.length > 0) {
      await prisma.aboutContent.createMany({ data: backup.tables.aboutContent });
    }
    if (backup.tables.testimonials?.length > 0) {
      await prisma.testimonial.createMany({ data: backup.tables.testimonials });
    }
    
    console.log('\n✅ DATABASE RESTORE COMPLETED!');
    console.log(`📅 Backup from: ${backup.timestamp}`);
    console.log('🔒 Your database has been restored successfully!');
    
  } catch (error) {
    console.error('❌ Error restoring backup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Usage: node restore-database.js backup-filename.json
const backupFileName = process.argv[2];
if (!backupFileName) {
  console.log('Usage: node restore-database.js <backup-filename.json>');
  console.log('\nExample: node restore-database.js backup-2025-09-01T16-19-33-828Z.json');
} else {
  restoreDatabase(backupFileName);
}