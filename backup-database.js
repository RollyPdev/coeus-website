const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function createDatabaseBackup() {
  const prisma = new PrismaClient();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, 'database-backups');
  
  // Create backup directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
  
  try {
    console.log('🔄 Creating database backup...');
    
    const backup = {
      timestamp: new Date().toISOString(),
      tables: {}
    };
    
    // Backup all tables
    console.log('📋 Backing up Students...');
    backup.tables.students = await prisma.student.findMany();
    
    console.log('📋 Backing up Enrollments...');
    backup.tables.enrollments = await prisma.enrollment.findMany();
    
    console.log('📋 Backing up Payments...');
    backup.tables.payments = await prisma.payment.findMany();
    
    console.log('📋 Backing up Users...');
    backup.tables.users = await prisma.user.findMany();
    
    console.log('📋 Backing up Programs...');
    backup.tables.programs = await prisma.program.findMany();
    
    console.log('📋 Backing up Lecturers...');
    backup.tables.lecturers = await prisma.lecturer.findMany();
    
    console.log('📋 Backing up News & Events...');
    backup.tables.newsEvents = await prisma.newsEvent.findMany();
    
    console.log('📋 Backing up Good Morals...');
    backup.tables.goodMorals = await prisma.goodMoral.findMany();
    
    console.log('📋 Backing up Attendances...');
    backup.tables.attendances = await prisma.attendance.findMany();
    
    console.log('📋 Backing up Exam Results...');
    backup.tables.examResults = await prisma.examResult.findMany();
    
    console.log('📋 Backing up Schedules...');
    backup.tables.schedules = await prisma.schedule.findMany();
    
    console.log('📋 Backing up Schedule Attendances...');
    backup.tables.scheduleAttendances = await prisma.scheduleAttendance.findMany();
    
    console.log('📋 Backing up Payment Reminders...');
    backup.tables.paymentReminders = await prisma.paymentReminder.findMany();
    
    console.log('📋 Backing up Payment Audit Logs...');
    backup.tables.paymentAuditLogs = await prisma.paymentAuditLog.findMany();
    
    console.log('📋 Backing up Site Settings...');
    backup.tables.siteSettings = await prisma.siteSettings.findMany();
    
    console.log('📋 Backing up About Content...');
    backup.tables.aboutContent = await prisma.aboutContent.findMany();
    
    console.log('📋 Backing up Testimonials...');
    backup.tables.testimonials = await prisma.testimonial.findMany();
    
    // Write backup to file
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    // Create summary
    const summary = {
      backupFile,
      timestamp: backup.timestamp,
      recordCounts: {
        students: backup.tables.students.length,
        enrollments: backup.tables.enrollments.length,
        payments: backup.tables.payments.length,
        users: backup.tables.users.length,
        programs: backup.tables.programs.length,
        lecturers: backup.tables.lecturers.length,
        newsEvents: backup.tables.newsEvents.length,
        goodMorals: backup.tables.goodMorals.length,
        attendances: backup.tables.attendances.length,
        examResults: backup.tables.examResults.length,
        schedules: backup.tables.schedules.length,
        scheduleAttendances: backup.tables.scheduleAttendances.length,
        paymentReminders: backup.tables.paymentReminders.length,
        paymentAuditLogs: backup.tables.paymentAuditLogs.length,
        siteSettings: backup.tables.siteSettings.length,
        aboutContent: backup.tables.aboutContent.length,
        testimonials: backup.tables.testimonials.length
      }
    };
    
    console.log('\n✅ DATABASE BACKUP COMPLETED!');
    console.log(`📁 Backup saved to: ${backupFile}`);
    console.log(`📊 Total records backed up: ${Object.values(summary.recordCounts).reduce((a, b) => a + b, 0)}`);
    console.log('\n📋 Record counts by table:');
    Object.entries(summary.recordCounts).forEach(([table, count]) => {
      console.log(`   ${table}: ${count} records`);
    });
    
    // Save summary file
    const summaryFile = path.join(backupDir, `backup-summary-${timestamp}.json`);
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    
    console.log(`\n📄 Summary saved to: ${summaryFile}`);
    console.log('\n🔒 Your database is now safely backed up!');
    
  } catch (error) {
    console.error('❌ Error creating backup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDatabaseBackup();