const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestStudents() {
  try {
    const students = [
      {
        id: 'student-1',
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        email: 'juan.delacruz@email.com',
        phone: '09123456789',
        address: 'Manila, Philippines',
        status: 'active',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      },
      {
        id: 'student-2', 
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria.santos@email.com',
        phone: '09234567890',
        address: 'Quezon City, Philippines',
        status: 'active',
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date()
      },
      {
        id: 'student-3',
        firstName: 'Jose',
        lastName: 'Rizal',
        email: 'jose.rizal@email.com', 
        phone: '09345678901',
        address: 'Calamba, Laguna',
        status: 'active',
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date()
      }
    ];

    for (const student of students) {
      await prisma.student.create({
        data: student
      });
      console.log(`Created student: ${student.firstName} ${student.lastName}`);
    }

    // Create corresponding enrollments
    const enrollments = [
      {
        id: 'enroll-1',
        enrollmentId: 'COEUS-2024-001',
        studentId: 'student-1',
        reviewType: 'Criminology Board Exam Review',
        batch: 'Batch 2024-A',
        startDate: new Date('2024-01-20'),
        paymentMethod: 'Cash',
        amount: 15000,
        paymentStatus: 'paid',
        status: 'COMPLETED',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      },
      {
        id: 'enroll-2',
        enrollmentId: 'COEUS-2024-002', 
        studentId: 'student-2',
        reviewType: 'Criminology Board Exam Review',
        batch: 'Batch 2024-A',
        startDate: new Date('2024-02-15'),
        paymentMethod: 'GCash',
        amount: 15000,
        paymentStatus: 'paid',
        status: 'COMPLETED',
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date()
      },
      {
        id: 'enroll-3',
        enrollmentId: 'COEUS-2024-003',
        studentId: 'student-3', 
        reviewType: 'Criminology Board Exam Review',
        batch: 'Batch 2024-B',
        startDate: new Date('2024-03-10'),
        paymentMethod: 'Bank Transfer',
        amount: 15000,
        paymentStatus: 'paid',
        status: 'COMPLETED',
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date()
      }
    ];

    for (const enrollment of enrollments) {
      await prisma.enrollment.create({
        data: enrollment
      });
      console.log(`Created enrollment: ${enrollment.enrollmentId}`);
    }

    console.log('✅ Test students and enrollments created successfully!');
  } catch (error) {
    console.error('Error creating test students:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestStudents();