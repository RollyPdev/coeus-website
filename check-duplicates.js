const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDuplicates() {
  try {
    console.log('🔍 Checking for duplicate enrollments...\n');

    // Check duplicate enrollment IDs
    const duplicateEnrollmentIds = await prisma.enrollment.groupBy({
      by: ['enrollmentId'],
      _count: { enrollmentId: true },
      having: { enrollmentId: { _count: { gt: 1 } } }
    });

    // Check students with multiple enrollments
    const studentsWithMultipleEnrollments = await prisma.enrollment.groupBy({
      by: ['studentId'],
      _count: { studentId: true },
      having: { studentId: { _count: { gt: 1 } } }
    });

    // Check duplicate student enrollments in same program
    const duplicateStudentPrograms = await prisma.enrollment.groupBy({
      by: ['studentId', 'programId'],
      _count: { id: true },
      having: { id: { _count: { gt: 1 } } }
    });

    console.log('📊 DUPLICATE ANALYSIS:');
    console.log('=====================\n');

    // Report duplicate enrollment IDs
    if (duplicateEnrollmentIds.length > 0) {
      console.log('❌ DUPLICATE ENROLLMENT IDs:');
      for (const dup of duplicateEnrollmentIds) {
        console.log(`   ${dup.enrollmentId}: ${dup._count.enrollmentId} times`);
      }
      console.log();
    } else {
      console.log('✅ No duplicate enrollment IDs found\n');
    }

    // Report students with multiple enrollments
    if (studentsWithMultipleEnrollments.length > 0) {
      console.log('📝 STUDENTS WITH MULTIPLE ENROLLMENTS:');
      for (const student of studentsWithMultipleEnrollments) {
        const studentInfo = await prisma.student.findUnique({
          where: { id: student.studentId },
          select: { firstName: true, lastName: true, studentId: true }
        });
        console.log(`   ${studentInfo.firstName} ${studentInfo.lastName} (${studentInfo.studentId}): ${student._count.studentId} enrollments`);
      }
      console.log();
    } else {
      console.log('✅ No students with multiple enrollments\n');
    }

    // Report duplicate student-program combinations
    if (duplicateStudentPrograms.length > 0) {
      console.log('⚠️  DUPLICATE STUDENT-PROGRAM ENROLLMENTS:');
      for (const dup of duplicateStudentPrograms) {
        const enrollments = await prisma.enrollment.findMany({
          where: { 
            studentId: dup.studentId,
            programId: dup.programId
          },
          include: {
            student: { select: { firstName: true, lastName: true, studentId: true } },
            program: { select: { title: true } }
          }
        });
        
        const student = enrollments[0].student;
        const program = enrollments[0].program;
        console.log(`   ${student.firstName} ${student.lastName} enrolled in "${program?.title || 'Unknown Program'}" ${dup._count.id} times`);
      }
      console.log();
    } else {
      console.log('✅ No duplicate student-program enrollments\n');
    }

    // Summary
    const totalDuplicates = duplicateEnrollmentIds.length + duplicateStudentPrograms.length;
    if (totalDuplicates === 0) {
      console.log('🎉 NO DUPLICATES FOUND - Database is clean!');
    } else {
      console.log(`⚠️  Found ${totalDuplicates} types of duplicates that need attention`);
    }

  } catch (error) {
    console.error('Error checking duplicates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDuplicates();