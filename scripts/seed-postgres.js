const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Seeding PostgreSQL database...');

    // Create test students
    const students = await prisma.student.createMany({
      data: [
        {
          studentId: 'STU-001',
          firstName: 'Juan',
          lastName: 'Dela Cruz',
          gender: 'Male',
          birthday: new Date('2000-01-15'),
          birthPlace: 'Manila',
          contactNumber: '09123456789',
          email: 'juan.delacruz@email.com',
          address: 'Manila, Philippines',
          guardianFirstName: 'Pedro',
          guardianLastName: 'Dela Cruz',
          guardianContact: '09111111111',
          guardianAddress: 'Manila, Philippines',
          status: 'active'
        },
        {
          studentId: 'STU-002',
          firstName: 'Maria',
          lastName: 'Santos',
          gender: 'Female',
          birthday: new Date('1999-05-20'),
          birthPlace: 'Quezon City',
          contactNumber: '09234567890',
          email: 'maria.santos@email.com',
          address: 'Quezon City, Philippines',
          guardianFirstName: 'Ana',
          guardianLastName: 'Santos',
          guardianContact: '09222222222',
          guardianAddress: 'Quezon City, Philippines',
          status: 'active'
        },
        {
          studentId: 'STU-003',
          firstName: 'Jose',
          lastName: 'Rizal',
          gender: 'Male',
          birthday: new Date('1998-12-30'),
          birthPlace: 'Calamba',
          contactNumber: '09345678901',
          email: 'jose.rizal@email.com',
          address: 'Calamba, Laguna',
          guardianFirstName: 'Francisco',
          guardianLastName: 'Rizal',
          guardianContact: '09333333333',
          guardianAddress: 'Calamba, Laguna',
          status: 'active'
        }
      ]
    });

    console.log(`✅ Created ${students.count} students`);

    // Get student IDs for enrollments
    const createdStudents = await prisma.student.findMany({
      select: { id: true, studentId: true }
    });

    // Create enrollments
    const enrollments = await prisma.enrollment.createMany({
      data: [
        {
          enrollmentId: 'COEUS-2024-001',
          studentId: createdStudents[0].id,
          reviewType: 'Criminology Board Exam Review',
          batch: 'Batch 2024-A',
          startDate: new Date('2024-01-20'),
          paymentMethod: 'Cash',
          amount: 15000,
          paymentStatus: 'paid',
          status: 'COMPLETED'
        },
        {
          enrollmentId: 'COEUS-2024-002',
          studentId: createdStudents[1].id,
          reviewType: 'Criminology Board Exam Review',
          batch: 'Batch 2024-A',
          startDate: new Date('2024-02-15'),
          paymentMethod: 'GCash',
          amount: 15000,
          paymentStatus: 'paid',
          status: 'COMPLETED'
        },
        {
          enrollmentId: 'COEUS-2024-003',
          studentId: createdStudents[2].id,
          reviewType: 'Criminology Board Exam Review',
          batch: 'Batch 2024-B',
          startDate: new Date('2024-03-10'),
          paymentMethod: 'Bank Transfer',
          amount: 15000,
          paymentStatus: 'paid',
          status: 'COMPLETED'
        }
      ]
    });

    console.log(`✅ Created ${enrollments.count} enrollments`);
    console.log('🎉 Database seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();