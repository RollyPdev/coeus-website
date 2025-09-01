const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkStudentPhotos() {
  try {
    const studentsWithPhotos = await prisma.student.findMany({
      where: {
        OR: [
          { photo: { not: null } },
          { photoUrl: { not: null } }
        ]
      },
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        photo: true,
        photoUrl: true
      }
    });

    console.log(`Found ${studentsWithPhotos.length} students with photos`);
    
    if (studentsWithPhotos.length > 0) {
      studentsWithPhotos.forEach(student => {
        console.log(`\nStudent: ${student.firstName} ${student.lastName} (${student.studentId})`);
        console.log(`ID: ${student.id}`);
        console.log(`Has photo: ${!!student.photo}`);
        console.log(`Has photoUrl: ${!!student.photoUrl}`);
        if (student.photo) {
          console.log(`Photo length: ${student.photo.length} characters`);
          console.log(`Photo starts with: ${student.photo.substring(0, 30)}...`);
        }
      });
    } else {
      console.log('No students have photos. They may have been uploaded but not saved properly.');
    }

    // Also check total students
    const totalStudents = await prisma.student.count();
    console.log(`\nTotal students in database: ${totalStudents}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStudentPhotos();