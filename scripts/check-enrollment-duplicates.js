const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDuplicates() {
  console.log('🔍 Checking for duplicate entries in enrollment management...\n');

  try {
    // 1. Check for duplicate students by email
    console.log('1. Checking for duplicate students by email...');
    const duplicateEmails = await prisma.student.groupBy({
      by: ['email'],
      having: {
        email: {
          _count: {
            gt: 1
          }
        }
      },
      _count: {
        email: true
      }
    });

    if (duplicateEmails.length > 0) {
      console.log(`❌ Found ${duplicateEmails.length} duplicate email(s):`);
      for (const dup of duplicateEmails) {
        const students = await prisma.student.findMany({
          where: { email: dup.email },
          select: { id: true, studentId: true, firstName: true, lastName: true, email: true, createdAt: true }
        });
        console.log(`   Email: ${dup.email} (${dup._count.email} occurrences)`);
        students.forEach(s => console.log(`     - ${s.studentId}: ${s.firstName} ${s.lastName} (Created: ${s.createdAt})`));
      }
    } else {
      console.log('✅ No duplicate emails found');
    }

    // 2. Check for duplicate students by contact number
    console.log('\n2. Checking for duplicate students by contact number...');
    const duplicateContacts = await prisma.student.groupBy({
      by: ['contactNumber'],
      having: {
        contactNumber: {
          _count: {
            gt: 1
          }
        }
      },
      _count: {
        contactNumber: true
      }
    });

    if (duplicateContacts.length > 0) {
      console.log(`❌ Found ${duplicateContacts.length} duplicate contact number(s):`);
      for (const dup of duplicateContacts) {
        const students = await prisma.student.findMany({
          where: { contactNumber: dup.contactNumber },
          select: { id: true, studentId: true, firstName: true, lastName: true, contactNumber: true, createdAt: true }
        });
        console.log(`   Contact: ${dup.contactNumber} (${dup._count.contactNumber} occurrences)`);
        students.forEach(s => console.log(`     - ${s.studentId}: ${s.firstName} ${s.lastName} (Created: ${s.createdAt})`));
      }
    } else {
      console.log('✅ No duplicate contact numbers found');
    }

    // 3. Check for duplicate students by full name and birthday
    console.log('\n3. Checking for duplicate students by full name and birthday...');
    const allStudents = await prisma.student.findMany({
      select: { 
        id: true, 
        studentId: true, 
        firstName: true, 
        lastName: true, 
        middleInitial: true,
        birthday: true, 
        email: true,
        createdAt: true 
      }
    });

    const nameMap = new Map();
    allStudents.forEach(student => {
      const key = `${student.firstName.toLowerCase()}_${student.lastName.toLowerCase()}_${student.birthday.toISOString().split('T')[0]}`;
      if (!nameMap.has(key)) {
        nameMap.set(key, []);
      }
      nameMap.get(key).push(student);
    });

    const duplicateNames = Array.from(nameMap.entries()).filter(([key, students]) => students.length > 1);
    
    if (duplicateNames.length > 0) {
      console.log(`❌ Found ${duplicateNames.length} potential duplicate(s) by name and birthday:`);
      duplicateNames.forEach(([key, students]) => {
        console.log(`   Name/Birthday: ${students[0].firstName} ${students[0].lastName} (${students[0].birthday.toISOString().split('T')[0]})`);
        students.forEach(s => console.log(`     - ${s.studentId}: ${s.email} (Created: ${s.createdAt})`));
      });
    } else {
      console.log('✅ No duplicate names with same birthday found');
    }

    // 4. Check for duplicate enrollments by student
    console.log('\n4. Checking for multiple enrollments per student...');
    const multipleEnrollments = await prisma.student.findMany({
      include: {
        enrollments: {
          select: {
            id: true,
            enrollmentId: true,
            reviewType: true,
            status: true,
            createdAt: true
          }
        }
      },
      where: {
        enrollments: {
          some: {}
        }
      }
    });

    const studentsWithMultipleEnrollments = multipleEnrollments.filter(s => s.enrollments.length > 1);
    
    if (studentsWithMultipleEnrollments.length > 0) {
      console.log(`⚠️  Found ${studentsWithMultipleEnrollments.length} student(s) with multiple enrollments:`);
      studentsWithMultipleEnrollments.forEach(student => {
        console.log(`   Student: ${student.studentId} - ${student.firstName} ${student.lastName}`);
        student.enrollments.forEach(e => console.log(`     - ${e.enrollmentId}: ${e.reviewType} (${e.status}) - Created: ${e.createdAt}`));
      });
    } else {
      console.log('✅ No students with multiple enrollments found');
    }

    // 5. Check for duplicate payments
    console.log('\n5. Checking for duplicate payments...');
    const duplicateTransactions = await prisma.payment.groupBy({
      by: ['transactionId'],
      having: {
        transactionId: {
          _count: {
            gt: 1
          }
        }
      },
      _count: {
        transactionId: true
      }
    });

    if (duplicateTransactions.length > 0) {
      console.log(`❌ Found ${duplicateTransactions.length} duplicate transaction ID(s):`);
      for (const dup of duplicateTransactions) {
        const payments = await prisma.payment.findMany({
          where: { transactionId: dup.transactionId },
          include: {
            enrollment: {
              include: {
                student: {
                  select: { studentId: true, firstName: true, lastName: true }
                }
              }
            }
          }
        });
        console.log(`   Transaction ID: ${dup.transactionId} (${dup._count.transactionId} occurrences)`);
        payments.forEach(p => console.log(`     - Amount: ${p.amount}, Student: ${p.enrollment.student.studentId} (${p.enrollment.student.firstName} ${p.enrollment.student.lastName}), Date: ${p.paymentDate}`));
      }
    } else {
      console.log('✅ No duplicate transaction IDs found');
    }

    // 6. Check for orphaned records
    console.log('\n6. Checking for orphaned records...');
    
    // Students without enrollments
    const studentsWithoutEnrollments = await prisma.student.findMany({
      where: {
        enrollments: {
          none: {}
        }
      },
      select: { id: true, studentId: true, firstName: true, lastName: true, createdAt: true }
    });

    if (studentsWithoutEnrollments.length > 0) {
      console.log(`⚠️  Found ${studentsWithoutEnrollments.length} student(s) without enrollments:`);
      studentsWithoutEnrollments.forEach(s => console.log(`   - ${s.studentId}: ${s.firstName} ${s.lastName} (Created: ${s.createdAt})`));
    } else {
      console.log('✅ No students without enrollments found');
    }

    // Enrollments without payments
    const enrollmentsWithoutPayments = await prisma.enrollment.findMany({
      where: {
        payments: {
          none: {}
        }
      },
      include: {
        student: {
          select: { studentId: true, firstName: true, lastName: true }
        }
      }
    });

    if (enrollmentsWithoutPayments.length > 0) {
      console.log(`\n⚠️  Found ${enrollmentsWithoutPayments.length} enrollment(s) without payments:`);
      enrollmentsWithoutPayments.forEach(e => console.log(`   - ${e.enrollmentId}: ${e.student.firstName} ${e.student.lastName} (${e.reviewType}) - Status: ${e.status}`));
    } else {
      console.log('\n✅ No enrollments without payments found');
    }

    // 7. Summary statistics
    console.log('\n📊 Summary Statistics:');
    const totalStudents = await prisma.student.count();
    const totalEnrollments = await prisma.enrollment.count();
    const totalPayments = await prisma.payment.count();
    const activeStudents = await prisma.student.count({ where: { status: 'active' } });
    const pendingEnrollments = await prisma.enrollment.count({ where: { status: 'pending' } });
    const completedPayments = await prisma.payment.count({ where: { status: 'completed' } });

    console.log(`   Total Students: ${totalStudents}`);
    console.log(`   Active Students: ${activeStudents}`);
    console.log(`   Total Enrollments: ${totalEnrollments}`);
    console.log(`   Pending Enrollments: ${pendingEnrollments}`);
    console.log(`   Total Payments: ${totalPayments}`);
    console.log(`   Completed Payments: ${completedPayments}`);

  } catch (error) {
    console.error('❌ Error checking duplicates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkDuplicates()
  .then(() => {
    console.log('\n✅ Duplicate check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });