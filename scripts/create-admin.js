const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@coeus.com',
        password: hashedPassword,
        name: 'Administrator'
      }
    })
    
    console.log('Admin user created successfully:')
    console.log('Email: admin@coeus.com')
    console.log('Password: admin123')
    console.log('User ID:', admin.id)
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('Admin user already exists with email: admin@coeus.com')
    } else {
      console.error('Error creating admin user:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()