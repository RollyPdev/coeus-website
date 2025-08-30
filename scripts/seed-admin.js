const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@coeus.com' },
      update: {
        password: hashedPassword,
        name: 'Administrator'
      },
      create: {
        email: 'admin@coeus.com',
        password: hashedPassword,
        name: 'Administrator'
      }
    });

    console.log('✅ Admin user created/updated successfully!');
    console.log('📧 Email: admin@coeus.com');
    console.log('🔑 Password: admin123');
    console.log('👤 User ID:', admin.id);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();