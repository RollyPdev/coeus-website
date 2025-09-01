const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const programs = [
  {
    title: 'Review for Criminology Licensure Examination',
    description: 'Comprehensive review program designed to prepare students for the Criminologist Licensure Examination with expert instructors and proven methodologies.',
    image: '/images/criminology-program.jpg',
    category: 'criminology',
    features: 'Expert instructors, Comprehensive materials, Mock examinations, Performance tracking, Flexible schedules',
    duration: 12,
    price: 15000,
    schedule: 'Weekends and Weekdays Available'
  },
  {
    title: 'Nursing Review Program',
    description: 'Intensive nursing review program to help nursing graduates pass the Philippine Nursing Licensure Examination with confidence.',
    image: '/images/nursing-program.jpg',
    category: 'nursing',
    features: 'NCLEX-style questions, Clinical case studies, Expert nursing faculty, Study materials, Online resources',
    duration: 10,
    price: 18000,
    schedule: 'Flexible Schedule Options'
  },
  {
    title: 'Continuing Professional Development',
    description: 'Professional development seminars and workshops for licensed professionals to maintain and enhance their skills.',
    image: '/images/cpd-program.jpg',
    category: 'cpd',
    features: 'CPD units, Professional certificates, Industry experts, Networking opportunities, Online and onsite options',
    duration: 4,
    price: 5000,
    schedule: 'Monthly Sessions'
  }
];

async function seedPrograms() {
  try {
    console.log('Seeding programs...');
    
    // Clear existing programs first
    await prisma.program.deleteMany({});
    console.log('Cleared existing programs');
    
    for (const program of programs) {
      await prisma.program.create({
        data: program
      });
      console.log(`✓ Created: ${program.title}`);
    }
    
    console.log('Programs seeded successfully!');
  } catch (error) {
    console.error('Error seeding programs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedPrograms();