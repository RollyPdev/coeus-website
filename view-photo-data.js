const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function viewPhotoData() {
  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        photo: true,
        photoUrl: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    console.log('STUDENT PHOTO DATA TABLE');
    console.log('========================');
    console.log('');

    students.forEach(student => {
      console.log(`Student: ${student.firstName} ${student.lastName} (${student.studentId})`);
      console.log(`ID: ${student.id}`);
      
      if (student.photo) {
        console.log(`Photo: YES (${student.photo.length} chars) - ${student.photo.substring(0, 50)}...`);
      } else {
        console.log(`Photo: NO`);
      }
      
      if (student.photoUrl) {
        console.log(`PhotoUrl: YES - ${student.photoUrl}`);
      } else {
        console.log(`PhotoUrl: NO`);
      }
      
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

viewPhotoData();