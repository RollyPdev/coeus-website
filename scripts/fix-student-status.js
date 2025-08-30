const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixStudentStatus() {
  try {
    console.log('🔄 Fixing student status for completed enrollments...');
    
    // Find all enrollments with approved statuses
    const approvedEnrollments = await prisma.enrollment.findMany({
      where: {
        status: {
          in: ['completed', 'verified', 'approved']
        }
      },
      include: {
        student: true
      }
    });

    console.log(`📊 Found ${approvedEnrollments.length} approved enrollments`);

    // Update student status to active for approved enrollments
    for (const enrollment of approvedEnrollments) {
      if (enrollment.student && enrollment.student.status !== 'active') {
        await prisma.student.update({
          where: { id: enrollment.studentId },
          data: { status: 'active' }
        });
        
        console.log(`✅ Updated student ${enrollment.student.firstName} ${enrollment.student.lastName} to active status`);
      }
    }

    // Also check for students without any enrollment status but should be active
    const allStudents = await prisma.student.findMany({
      include: {
        enrollments: true
      }
    });

    console.log(`📊 Checking ${allStudents.length} total students`);

    for (const student of allStudents) {
      const hasApprovedEnrollment = student.enrollments.some(e => 
        ['completed', 'verified', 'approved'].includes(e.status)
      );
      
      if (hasApprovedEnrollment && student.status !== 'active') {
        await prisma.student.update({
          where: { id: student.id },
          data: { status: 'active' }
        });
        
        console.log(`✅ Updated student ${student.firstName} ${student.lastName} to active status (had approved enrollment)`);
      }
    }

    console.log('🎉 Student status fix completed!');
  } catch (error) {
    console.error('❌ Error fixing student status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixStudentStatus();