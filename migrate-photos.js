const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migratePhotos() {
  try {
    const studentsWithPhotoUrl = await prisma.student.findMany({
      where: {
        photoUrl: { not: null },
        photo: null
      },
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        photoUrl: true
      }
    });

    console.log(`Found ${studentsWithPhotoUrl.length} students with photoUrl to migrate`);
    
    for (const student of studentsWithPhotoUrl) {
      await prisma.student.update({
        where: { id: student.id },
        data: {
          photo: student.photoUrl,
          photoUrl: null
        }
      });
      console.log(`Migrated photo for ${student.firstName} ${student.lastName} (${student.studentId})`);
    }
    
    console.log('Photo migration completed!');
  } catch (error) {
    console.error('Error migrating photos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migratePhotos();