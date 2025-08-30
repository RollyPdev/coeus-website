const { PrismaClient } = require('@prisma/client');

async function addPhotoField() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Adding photo fields to Student table...');
    
    // Add photo field
    await prisma.$executeRawUnsafe('ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "photo" TEXT;');
    console.log('✅ Added photo field');
    
    // Add photoUrl field  
    await prisma.$executeRawUnsafe('ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "photoUrl" TEXT;');
    console.log('✅ Added photoUrl field');
    
    console.log('🎉 Photo fields added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding photo fields:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addPhotoField();