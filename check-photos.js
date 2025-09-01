const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPhotos() {
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
      take: 5
    });

    console.log('Found', students.length, 'students');
    
    students.forEach(student => {
      console.log(`\nStudent: ${student.firstName} ${student.lastName} (${student.studentId})`);
      console.log(`ID: ${student.id}`);
      console.log(`Has photo: ${!!student.photo}`);
      console.log(`Has photoUrl: ${!!student.photoUrl}`);
      if (student.photo) {
        console.log(`Photo starts with: ${student.photo.substring(0, 50)}...`);
      }
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPhotos();