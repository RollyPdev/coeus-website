const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '../database-backups');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log('Creating backup before reset...');
  
  const tables = {
    students: await prisma.student.findMany(),
    enrollments: await prisma.enrollment.findMany(),
    payments: await prisma.payment.findMany(),
    users: await prisma.user.findMany(),
    programs: await prisma.program.findMany(),
    lecturers: await prisma.lecturer.findMany(),
    newsEvents: await prisma.newsEvent.findMany(),
    testimonials: await prisma.testimonial.findMany(),
    goodMorals: await prisma.goodMoral.findMany(),
    attendances: await prisma.attendance.findMany(),
    siteSettings: await prisma.siteSettings.findMany(),
    aboutContent: await prisma.aboutContent.findMany()
  };

  const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
  fs.writeFileSync(backupFile, JSON.stringify({ timestamp: new Date(), tables }, null, 2));
  
  console.log(`✅ Backup created: ${backupFile}`);
  return backupFile;
}

async function safeReset() {
  const force = process.argv.includes('--force');
  
  // Check if data exists
  const studentCount = await prisma.student.count();
  
  if (studentCount > 0 && !force) {
    console.error('🚨 DATABASE CONTAINS DATA!');
    console.error(`Found ${studentCount} students`);
    console.error('Use --force to proceed with reset');
    process.exit(1);
  }
  
  if (studentCount > 0) {
    await createBackup();
  }
  
  console.log('Proceeding with database reset...');
}

if (require.main === module) {
  safeReset().catch(console.error).finally(() => prisma.$disconnect());
}

module.exports = { safeReset, createBackup };