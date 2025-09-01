const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkEnrollmentPhotos() {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        photo: { not: null }
      },
      select: {
        id: true,
        photo: true,
        student: {
          select: {
            id: true,
            studentId: true,
            firstName: true,
            lastName: true
          }
        }
      },
      take: 5
    });

    console.log(`Found ${enrollments.length} enrollments with photos`);
    
    enrollments.forEach(enrollment => {
      console.log(`\nStudent: ${enrollment.student.firstName} ${enrollment.student.lastName} (${enrollment.student.studentId})`);
      console.log(`Student ID: ${enrollment.student.id}`);
      console.log(`Has photo in enrollment: ${!!enrollment.photo}`);
      if (enrollment.photo) {
        console.log(`Photo starts with: ${enrollment.photo.substring(0, 50)}...`);
      }
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEnrollmentPhotos();