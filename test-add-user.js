const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function testAddUser() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing user creation...');
    
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'Member',
        status: 'active'
      }
    });
    
    console.log('✅ User created successfully:', user);
    
  } catch (error) {
    console.error('❌ Error creating user:', error);
    
    // Try with raw SQL
    try {
      console.log('🔄 Trying with raw SQL...');
      const hashedPassword = await bcrypt.hash('password123', 12);
      
      const result = await prisma.$executeRaw`
        INSERT INTO "User" (id, email, password, name, role, status, "createdAt", "updatedAt")
        VALUES (${generateId()}, 'test2@example.com', ${hashedPassword}, 'Test User 2', 'Member', 'active', NOW(), NOW())
      `;
      
      console.log('✅ User created with raw SQL:', result);
      
    } catch (rawError) {
      console.error('❌ Raw SQL also failed:', rawError);
    }
  } finally {
    await prisma.$disconnect();
  }
}

function generateId() {
  return 'cm' + Math.random().toString(36).substr(2, 9);
}

testAddUser();