const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function backupToSQL() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, 'sql-backups');
  
  // Create backup directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }
  
  const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);
  let sqlContent = `-- Database Backup Created: ${new Date().toISOString()}\n\n`;

  try {
    console.log('Starting database backup...');

    // Backup Students
    const students = await prisma.student.findMany();
    sqlContent += `-- Students Table\n`;
    for (const student of students) {
      const values = [
        `'${student.id}'`,
        `'${student.studentId}'`,
        `'${student.firstName.replace(/'/g, "''")}'`,
        `'${student.lastName.replace(/'/g, "''")}'`,
        student.middleInitial ? `'${student.middleInitial}'` : 'NULL',
        `'${student.gender}'`,
        `'${student.birthday.toISOString()}'`,
        student.age || 'NULL',
        `'${student.birthPlace.replace(/'/g, "''")}'`,
        `'${student.contactNumber}'`,
        `'${student.email}'`,
        `'${student.address.replace(/'/g, "''")}'`,
        student.region ? `'${student.region.replace(/'/g, "''")}'` : 'NULL',
        student.province ? `'${student.province.replace(/'/g, "''")}'` : 'NULL',
        student.city ? `'${student.city.replace(/'/g, "''")}'` : 'NULL',
        student.barangay ? `'${student.barangay.replace(/'/g, "''")}'` : 'NULL',
        student.zipCode ? `'${student.zipCode}'` : 'NULL',
        `'${student.guardianFirstName.replace(/'/g, "''")}'`,
        `'${student.guardianLastName.replace(/'/g, "''")}'`,
        student.guardianMiddleInitial ? `'${student.guardianMiddleInitial}'` : 'NULL',
        `'${student.guardianContact}'`,
        `'${student.guardianAddress.replace(/'/g, "''")}'`,
        student.relationship ? `'${student.relationship}'` : 'NULL',
        student.schoolName ? `'${student.schoolName.replace(/'/g, "''")}'` : 'NULL',
        student.course ? `'${student.course.replace(/'/g, "''")}'` : 'NULL',
        student.yearGraduated ? `'${student.yearGraduated}'` : 'NULL',
        student.howDidYouHear ? `'${student.howDidYouHear.replace(/'/g, "''")}'` : 'NULL',
        student.referredBy ? `'${student.referredBy.replace(/'/g, "''")}'` : 'NULL',
        student.photo ? `'${student.photo.replace(/'/g, "''")}'` : 'NULL',
        student.photoUrl ? `'${student.photoUrl.replace(/'/g, "''")}'` : 'NULL',
        `'${student.status}'`,
        `'${student.createdAt.toISOString()}'`,
        `'${student.updatedAt.toISOString()}'`
      ];
      
      sqlContent += `INSERT INTO "Student" VALUES (${values.join(', ')});\n`;
    }

    // Backup Enrollments
    const enrollments = await prisma.enrollment.findMany();
    sqlContent += `\n-- Enrollments Table\n`;
    for (const enrollment of enrollments) {
      const values = [
        `'${enrollment.id}'`,
        `'${enrollment.enrollmentId}'`,
        `'${enrollment.studentId}'`,
        `'${enrollment.reviewType.replace(/'/g, "''")}'`,
        enrollment.programId ? `'${enrollment.programId}'` : 'NULL',
        enrollment.batch ? `'${enrollment.batch.replace(/'/g, "''")}'` : 'NULL',
        `'${enrollment.startDate.toISOString()}'`,
        enrollment.endDate ? `'${enrollment.endDate.toISOString()}'` : 'NULL',
        `'${enrollment.paymentMethod}'`,
        enrollment.amount,
        enrollment.totalPaid,
        enrollment.remainingBalance,
        `'${enrollment.paymentStatus}'`,
        `'${enrollment.status}'`,
        enrollment.installmentPlan ? `'${enrollment.installmentPlan}'` : 'NULL',
        enrollment.nextPaymentDue ? `'${enrollment.nextPaymentDue.toISOString()}'` : 'NULL',
        `'${enrollment.createdAt.toISOString()}'`,
        `'${enrollment.updatedAt.toISOString()}'`
      ];
      
      sqlContent += `INSERT INTO "Enrollment" VALUES (${values.join(', ')});\n`;
    }

    // Backup Payments
    const payments = await prisma.payment.findMany();
    sqlContent += `\n-- Payments Table\n`;
    for (const payment of payments) {
      const values = [
        `'${payment.id}'`,
        `'${payment.transactionId}'`,
        `'${payment.enrollmentId}'`,
        payment.amount,
        payment.promoAvails || 'NULL',
        payment.paymentStatus ? `'${payment.paymentStatus}'` : 'NULL',
        `'${payment.paymentMethod}'`,
        payment.paymentGateway ? `'${payment.paymentGateway}'` : 'NULL',
        payment.gatewayTransactionId ? `'${payment.gatewayTransactionId}'` : 'NULL',
        payment.gatewayResponse ? `'${payment.gatewayResponse.replace(/'/g, "''")}'` : 'NULL',
        `'${payment.paymentDate.toISOString()}'`,
        payment.dueDate ? `'${payment.dueDate.toISOString()}'` : 'NULL',
        payment.receiptNumber ? `'${payment.receiptNumber}'` : 'NULL',
        `'${payment.status}'`,
        payment.refundAmount || 'NULL',
        payment.refundReason ? `'${payment.refundReason.replace(/'/g, "''")}'` : 'NULL',
        payment.lateFee || 'NULL',
        payment.discount || 'NULL',
        payment.tax || 'NULL',
        payment.notes ? `'${payment.notes.replace(/'/g, "''")}'` : 'NULL',
        `'${payment.createdAt.toISOString()}'`,
        `'${payment.updatedAt.toISOString()}'`
      ];
      
      sqlContent += `INSERT INTO "Payment" VALUES (${values.join(', ')});\n`;
    }

    // Write to file
    fs.writeFileSync(backupFile, sqlContent);
    
    console.log(`✅ Backup completed successfully!`);
    console.log(`📁 File: ${backupFile}`);
    console.log(`📊 Students: ${students.length}`);
    console.log(`📊 Enrollments: ${enrollments.length}`);
    console.log(`📊 Payments: ${payments.length}`);
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

backupToSQL();