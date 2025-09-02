const { PrismaClient } = require('@prisma/client');

async function testLecturerAPI() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 TESTING LECTURER FUNCTIONALITY...');
    
    // Check existing lecturers
    const lecturers = await prisma.lecturer.findMany({
      select: {
        id: true,
        name: true,
        position: true,
        category: true,
        specialization: true,
        photo: true
      }
    });
    
    console.log(`\n📚 Found ${lecturers.length} lecturers in database:`);
    
    if (lecturers.length > 0) {
      lecturers.forEach((lecturer, index) => {
        console.log(`${index + 1}. ${lecturer.name}`);
        console.log(`   Position: ${lecturer.position}`);
        console.log(`   Category: ${lecturer.category}`);
        console.log(`   Specialization: ${lecturer.specialization}`);
        console.log(`   Has Photo: ${lecturer.photo ? (lecturer.photo.startsWith('data:') ? 'Yes (Base64)' : 'Yes (URL)') : 'No'}`);
        console.log('');
      });
    } else {
      console.log('No lecturers found. You can add new lecturers through the admin panel.');
    }
    
    // Test API endpoint (GET)
    console.log('🌐 Testing API endpoint...');
    try {
      const response = await fetch('http://localhost:3000/api/lecturers');
      if (response.ok) {
        const apiData = await response.json();
        console.log(`✅ API GET /api/lecturers working - returned ${apiData.length} lecturers`);
      } else {
        console.log(`❌ API GET /api/lecturers failed with status: ${response.status}`);
      }
    } catch (apiError) {
      console.log('❌ API test failed - make sure server is running on localhost:3000');
    }
    
  } catch (error) {
    console.error('❌ Error testing lecturer functionality:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLecturerAPI();