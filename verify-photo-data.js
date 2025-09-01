const { PrismaClient } = require('@prisma/client');

async function verifyActualPhotoData() {
  const directPrisma = new PrismaClient();
  
  try {
    console.log('🔍 VERIFYING ACTUAL PHOTO DATA IN DATABASE...');
    
    // Check students that have actual photo data (not just photoUrl)
    const studentsWithRealPhotos = await directPrisma.$queryRaw`
      SELECT 
        id, 
        "firstName", 
        "lastName", 
        "studentId",
        CASE WHEN photo IS NOT NULL AND photo != '' THEN LENGTH(photo) ELSE 0 END as photo_size,
        CASE WHEN photo IS NOT NULL AND photo != '' THEN SUBSTRING(photo, 1, 50) ELSE 'NO_PHOTO' END as photo_preview,
        CASE WHEN "photoUrl" IS NOT NULL AND "photoUrl" != '' THEN LENGTH("photoUrl") ELSE 0 END as photourl_size,
        "photoUrl"
      FROM "Student" 
      WHERE photo IS NOT NULL AND photo != ''
    `;
    
    console.log(`\n📸 Students with ACTUAL photo data: ${studentsWithRealPhotos.length}`);
    
    if (studentsWithRealPhotos.length > 0) {
      console.log('\n🎯 ACTUAL PHOTOS FOUND:');
      studentsWithRealPhotos.forEach(row => {
        console.log({
          studentId: row.studentId,
          name: `${row.firstName} ${row.lastName}`,
          photoSize: `${row.photo_size} bytes`,
          photoPreview: row.photo_preview,
          isBase64: row.photo_preview.startsWith('data:') || row.photo_preview.startsWith('/9j/') || row.photo_preview.startsWith('iVBOR'),
          photoUrlSize: row.photourl_size,
          currentPhotoUrl: row.photoUrl
        });
      });
    }
    
    // Check students with only photoUrl (placeholder images)
    const studentsWithPlaceholders = await directPrisma.$queryRaw`
      SELECT 
        "firstName", 
        "lastName", 
        "studentId",
        "photoUrl"
      FROM "Student" 
      WHERE (photo IS NULL OR photo = '') AND ("photoUrl" IS NOT NULL AND "photoUrl" != '')
      LIMIT 5
    `;
    
    console.log(`\n🖼️  Students with placeholder images: ${studentsWithPlaceholders.length}`);
    studentsWithPlaceholders.forEach(row => {
      console.log({
        studentId: row.studentId,
        name: `${row.firstName} ${row.lastName}`,
        placeholderImage: row.photoUrl
      });
    });
    
    // Summary
    const totalWithPhotos = await directPrisma.$queryRaw`
      SELECT 
        COUNT(CASE WHEN photo IS NOT NULL AND photo != '' THEN 1 END) as real_photos,
        COUNT(CASE WHEN "photoUrl" IS NOT NULL AND "photoUrl" != '' THEN 1 END) as photo_urls,
        COUNT(*) as total_students
      FROM "Student"
    `;
    
    console.log('\n📊 SUMMARY:');
    console.log(`Real uploaded photos: ${totalWithPhotos[0].real_photos}`);
    console.log(`Photo URLs (placeholders): ${totalWithPhotos[0].photo_urls}`);
    console.log(`Total students: ${totalWithPhotos[0].total_students}`);
    
  } catch (error) {
    console.error('❌ Error verifying photo data:', error);
  } finally {
    await directPrisma.$disconnect();
  }
}

verifyActualPhotoData();