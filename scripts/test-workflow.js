const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testWorkflow() {
  try {
    console.log('🧪 Testing Enrollment Workflow...\n');
    
    // Check current state
    const students = await prisma.student.findMany({
      include: {
        enrollments: true
      }
    });
    
    console.log('📊 Current Database State:');
    students.forEach(student => {
      console.log(`👤 ${student.firstName} ${student.lastName} (${student.studentId})`);
      console.log(`   Student Status: ${student.status}`);
      student.enrollments.forEach(enrollment => {
        console.log(`   📋 Enrollment ${enrollment.enrollmentId}: ${enrollment.status}`);
      });
      console.log('');
    });
    
    // Test the workflow logic
    console.log('🔄 Workflow Test Results:');
    students.forEach(student => {
      const hasCompletedEnrollment = student.enrollments.some(e => 
        e.status === 'COMPLETED' || e.status === 'completed'
      );
      
      const shouldBeInStudentManagement = student.status === 'active';
      const hasCorrectStatus = hasCompletedEnrollment ? student.status === 'active' : true;
      
      console.log(`👤 ${student.firstName} ${student.lastName}:`);
      console.log(`   ✅ Has completed enrollment: ${hasCompletedEnrollment}`);
      console.log(`   ✅ Will appear in Student Management: ${shouldBeInStudentManagement}`);
      console.log(`   ✅ Has correct status: ${hasCorrectStatus}`);
      
      if (hasCompletedEnrollment && !shouldBeInStudentManagement) {
        console.log(`   ⚠️  WARNING: Student has completed enrollment but won't appear in Student Management!`);
      }
      console.log('');
    });
    
    console.log('📋 Summary:');
    console.log(`   Total Students: ${students.length}`);
    console.log(`   Students with COMPLETED enrollments: ${students.filter(s => s.enrollments.some(e => e.status === 'COMPLETED')).length}`);
    console.log(`   Students with 'active' status (shown in Student Management): ${students.filter(s => s.status === 'active').length}`);
    
  } catch (error) {
    console.error('❌ Error testing workflow:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testWorkflow();