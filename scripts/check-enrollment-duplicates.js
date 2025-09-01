const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDuplicates() {
  console.log('🔍 Checking for duplicate entries in enrollment management...\n');
console.log('⏳ This may take a moment for large datasets...\n');

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
          select: { id: true, studentId: true, firstName: true, lastName: true, email: true, createdAt: true, status: true }
        });
        console.log(`   Email: ${dup.email} (${dup._count.email} occurrences)`);
        students.forEach(s => console.log(`     - ${s.studentId}: ${s.firstName} ${s.lastName} (Status: ${s.status}) (Created: ${s.createdAt})`));
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
          select: { id: true, studentId: true, firstName: true, lastName: true, contactNumber: true, createdAt: true, status: true }
        });
        console.log(`   Contact: ${dup.contactNumber} (${dup._count.contactNumber} occurrences)`);
        students.forEach(s => console.log(`     - ${s.studentId}: ${s.firstName} ${s.lastName} (Status: ${s.status}) (Created: ${s.createdAt})`));
      }
    } else {
      console.log('✅ No duplicate contact numbers found');
    }

    // 3. Check for duplicate students by full name and birthday (limited check)
    console.log('\n3. Checking for duplicate students by full name and birthday...');
    
    // Get total count first
    const totalStudentCount = await prisma.student.count();
    console.log(`   Total students to check: ${totalStudentCount}`);
    
    if (totalStudentCount > 1000) {
      console.log('   ⚠️  Large dataset detected. Performing sample check on recent students...');
      
      // Check recent students only
      const recentStudents = await prisma.student.findMany({
        select: { 
          id: true, 
          studentId: true, 
          firstName: true, 
          lastName: true, 
          birthday: true, 
          email: true,
          createdAt: true 
        },
        orderBy: { createdAt: 'desc' },
        take: 500
      });
      
      const nameMap = new Map();
      recentStudents.forEach(student => {
        const key = `${student.firstName.toLowerCase()}_${student.lastName.toLowerCase()}_${student.birthday.toISOString().split('T')[0]}`;
        if (!nameMap.has(key)) {
          nameMap.set(key, []);
        }
        nameMap.get(key).push(student);
      });

      const duplicateNames = Array.from(nameMap.entries()).filter(([key, students]) => students.length > 1);
      
      if (duplicateNames.length > 0) {
        console.log(`❌ Found ${duplicateNames.length} potential duplicate(s) in recent records:`);
        duplicateNames.forEach(([key, students]) => {
          console.log(`   Name/Birthday: ${students[0].firstName} ${students[0].lastName} (${students[0].birthday.toISOString().split('T')[0]})`);
          students.forEach(s => console.log(`     - ${s.studentId}: ${s.email} (Created: ${s.createdAt})`));
        });
      } else {
        console.log('✅ No duplicate names with same birthday found in recent records');
      }
    } else {
      // Full check for smaller datasets
      const allStudents = await prisma.student.findMany({
        select: { 
          id: true, 
          studentId: true, 
          firstName: true, 
          lastName: true, 
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
    }

    // 4. Check for duplicate enrollments by student
    console.log('\n4. Checking for multiple enrollments per student...');
    const enrollmentCounts = await prisma.enrollment.groupBy({
      by: ['studentId'],
      _count: {
        studentId: true
      },
      having: {
        studentId: {
          _count: {
            gt: 1
          }
        }
      }
    });

    if (enrollmentCounts.length > 0) {
      console.log(`⚠️  Found ${enrollmentCounts.length} student(s) with multiple enrollments:`);
      for (const count of enrollmentCounts) {
        const student = await prisma.student.findUnique({
          where: { id: count.studentId },
          select: { studentId: true, firstName: true, lastName: true }
        });
        const enrollments = await prisma.enrollment.findMany({
          where: { studentId: count.studentId },
          select: { enrollmentId: true, reviewType: true, status: true, createdAt: true }
        });
        console.log(`   Student: ${student.studentId} - ${student.firstName} ${student.lastName} (${count._count.studentId} enrollments)`);
        enrollments.forEach(e => console.log(`     - ${e.enrollmentId}: ${e.reviewType} (${e.status}) - Created: ${e.createdAt}`));
      }
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
          select: {
            id: true,
            amount: true,
            paymentDate: true,
            status: true,
            enrollment: {
              select: {
                enrollmentId: true,
                student: {
                  select: { studentId: true, firstName: true, lastName: true }
                }
              }
            }
          }
        });
        console.log(`   Transaction ID: ${dup.transactionId} (${dup._count.transactionId} occurrences)`);
        payments.forEach(p => console.log(`     - Amount: ${p.amount}, Student: ${p.enrollment.student.studentId} (${p.enrollment.student.firstName} ${p.enrollment.student.lastName}), Date: ${p.paymentDate}, Status: ${p.status}`));
      }
    } else {
      console.log('✅ No duplicate transaction IDs found');
    }

    // 6. Check for orphaned records
    console.log('\n6. Checking for orphaned records...');
    
    // Count students without enrollments
    const studentsWithoutEnrollmentsCount = await prisma.student.count({
      where: {
        enrollments: {
          none: {}
        }
      }
    });

    if (studentsWithoutEnrollmentsCount > 0) {
      console.log(`⚠️  Found ${studentsWithoutEnrollmentsCount} student(s) without enrollments`);
      // Get first 10 examples
      const examples = await prisma.student.findMany({
        where: {
          enrollments: {
            none: {}
          }
        },
        select: { id: true, studentId: true, firstName: true, lastName: true, createdAt: true },
        take: 10
      });
      console.log('   Examples (first 10):');
      examples.forEach(s => console.log(`     - ${s.studentId}: ${s.firstName} ${s.lastName} (Created: ${s.createdAt})`));
    } else {
      console.log('✅ No students without enrollments found');
    }

    // Count enrollments without payments
    const enrollmentsWithoutPaymentsCount = await prisma.enrollment.count({
      where: {
        payments: {
          none: {}
        }
      }
    });

    if (enrollmentsWithoutPaymentsCount > 0) {
      console.log(`\n⚠️  Found ${enrollmentsWithoutPaymentsCount} enrollment(s) without payments`);
      // Get first 10 examples
      const examples = await prisma.enrollment.findMany({
        where: {
          payments: {
            none: {}
          }
        },
        include: {
          student: {
            select: { studentId: true, firstName: true, lastName: true }
          }
        },
        take: 10
      });
      console.log('   Examples (first 10):');
      examples.forEach(e => console.log(`     - ${e.enrollmentId}: ${e.student.firstName} ${e.student.lastName} (${e.reviewType}) - Status: ${e.status}`));
    } else {
      console.log('\n✅ No enrollments without payments found');
    }

    // 7. Summary statistics
    console.log('\n📊 Summary Statistics:');
    const [totalStudents, totalEnrollments, totalPayments, activeStudents, pendingStudents, pendingEnrollments, verifiedEnrollments, completedEnrollments, completedPayments, pendingPayments] = await Promise.all([
      prisma.student.count(),
      prisma.enrollment.count(),
      prisma.payment.count(),
      prisma.student.count({ where: { status: 'active' } }),
      prisma.student.count({ where: { status: 'pending' } }),
      prisma.enrollment.count({ where: { status: 'pending' } }),
      prisma.enrollment.count({ where: { status: 'verified' } }),
      prisma.enrollment.count({ where: { status: 'completed' } }),
      prisma.payment.count({ where: { status: 'completed' } }),
      prisma.payment.count({ where: { status: 'pending' } })
    ]);

    console.log(`   Total Students: ${totalStudents}`);
    console.log(`   - Active Students: ${activeStudents}`);
    console.log(`   - Pending Students: ${pendingStudents}`);
    console.log(`   Total Enrollments: ${totalEnrollments}`);
    console.log(`   - Pending Enrollments: ${pendingEnrollments}`);
    console.log(`   - Verified Enrollments: ${verifiedEnrollments}`);
    console.log(`   - Completed Enrollments: ${completedEnrollments}`);
    console.log(`   Total Payments: ${totalPayments}`);
    console.log(`   - Completed Payments: ${completedPayments}`);
    console.log(`   - Pending Payments: ${pendingPayments}`);

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