const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixWorkflowStatus() {
  try {
    console.log('🔧 Fixing workflow status...\n');
    
    // Find student with VERIFIED enrollment but active status
    const student = await prisma.student.findFirst({
      where: { studentId: 'STU-92B1F8' },
      include: { enrollments: true }
    });
    
    if (student) {
      const hasCompletedEnrollment = student.enrollments.some(e => 
        e.status === 'COMPLETED' || e.status === 'completed'
      );
      
      const hasVerifiedEnrollment = student.enrollments.some(e => 
        e.status === 'VERIFIED' || e.status === 'verified'
      );
      
      console.log(`👤 ${student.firstName} ${student.lastName}:`);
      console.log(`   Current student status: ${student.status}`);
      console.log(`   Has COMPLETED enrollment: ${hasCompletedEnrollment}`);
      console.log(`   Has VERIFIED enrollment: ${hasVerifiedEnrollment}`);
      
      if (hasVerifiedEnrollment && !hasCompletedEnrollment && student.status === 'active') {
        console.log('   🔄 Fixing: Setting student status to pending (enrollment is only VERIFIED, not COMPLETED)');
        
        await prisma.student.update({
          where: { id: student.id },
          data: { status: 'pending' }
        });
        
        console.log('   ✅ Student status updated to pending');
      } else if (hasCompletedEnrollment && student.status !== 'active') {
        console.log('   🔄 Fixing: Setting student status to active (enrollment is COMPLETED)');
        
        await prisma.student.update({
          where: { id: student.id },
          data: { status: 'active' }
        });
        
        console.log('   ✅ Student status updated to active');
      } else {
        console.log('   ✅ Student status is correct');
      }
    }
    
    console.log('\n🎉 Workflow status fix completed!');
    
  } catch (error) {
    console.error('❌ Error fixing workflow status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixWorkflowStatus();