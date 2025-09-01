import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@coeusreview.com' },
    update: {},
    create: {
      email: 'admin@coeusreview.com',
      name: 'Admin User',
      password: adminPassword,
    },
  });
  
  console.log({ admin });
  
  // Create about content
  const aboutContent = await prisma.aboutContent.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      vision: 'To be the leading review and training center in the Philippines, recognized for excellence in preparing professionals for licensure examinations and continuous professional development.',
      mission: 'To provide high-quality review programs and professional development seminars that equip individuals with the knowledge, skills, and confidence needed to excel in their chosen fields and contribute meaningfully to society.',
      goals: 'Achieve consistently high passing rates in licensure examinations\nProvide up-to-date and relevant training materials\nMaintain a team of expert and dedicated lecturers\nExpand our reach to serve more aspiring professionals',
      story: 'Coeus Review & Training Specialist, Inc. was founded in 2013 by Dr. Maria Santos, a passionate educator with a vision to transform professional education in the Philippines. What began as a small review center with just two classrooms and three lecturers has grown into one of the country\'s most respected training institutions.',
    },
  });
  
  console.log({ aboutContent });
  
  // Create site settings
  const siteSettings = await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'Coeus Review & Training Specialist, Inc.',
      contactEmail: 'info@coeus.com',
      contactPhone: '(02) 8123-4567',
      address: '123 Education Ave, Manila, Philippines',
      socialLinks: JSON.stringify({
        facebook: 'https://facebook.com/coeus',
        twitter: 'https://twitter.com/coeus',
        instagram: 'https://instagram.com/coeus',
      }),
    },
  });
  
  console.log({ siteSettings });
  
  // Create sample programs
  const programs = await Promise.all([
    prisma.program.upsert({
      where: { id: 'criminology-review' },
      update: {},
      create: {
        id: 'criminology-review',
        title: 'Criminology Board Exam Review',
        description: 'Comprehensive review for Criminology board examination',
        image: '/image-1.jpg',
        category: 'criminology',
        features: 'Mock exams, Study materials, Expert lecturers',
        duration: 12,
        price: 15000
      }
    }),
    prisma.program.upsert({
      where: { id: 'cpd-seminar' },
      update: {},
      create: {
        id: 'cpd-seminar',
        title: 'CPD Seminar Program',
        description: 'Continuing Professional Development seminars',
        image: '/image-2.jpg',
        category: 'cpd',
        features: 'CPD units, Certificates, Professional development',
        duration: 4,
        price: 5000
      }
    })
  ]);
  
  console.log({ programs });
  
  // Create sample lecturers
  const lecturers = await Promise.all([
    prisma.lecturer.upsert({
      where: { id: 'lecturer-1' },
      update: {},
      create: {
        id: 'lecturer-1',
        name: 'Dr. John Doe',
        photo: '/lecturer1.jpg',
        position: 'Criminology Expert',
        credentials: 'PhD, 20+ years experience',
        bio: 'Dr. John Doe is a renowned criminology expert with over 20 years of experience in criminal law and procedure. He has helped thousands of students pass their licensure examinations.',
        specialization: 'Criminal Law and Procedure',
        category: 'criminology',
        subjects: 'Criminal Law, Criminal Procedure, Criminology'
      }
    }),
    prisma.lecturer.upsert({
      where: { id: 'lecturer-2' },
      update: {},
      create: {
        id: 'lecturer-2',
        name: 'Ms. Jane Smith',
        photo: '/lecturer2.jpg',
        position: 'Nursing Specialist',
        credentials: 'RN, MSN, 15+ years experience',
        bio: 'Ms. Jane Smith is a dedicated nursing specialist with extensive experience in medical-surgical nursing. She brings compassion and expertise to every lecture.',
        specialization: 'Medical-Surgical Nursing',
        category: 'nursing',
        subjects: 'Medical-Surgical Nursing, Fundamentals of Nursing'
      }
    }),
    prisma.lecturer.upsert({
      where: { id: 'lecturer-3' },
      update: {},
      create: {
        id: 'lecturer-3',
        name: 'Mr. Alex Lee',
        photo: '/lecturer3.jpg',
        position: 'CPD Facilitator',
        credentials: 'CPD Certified, 10+ years experience',
        bio: 'Mr. Alex Lee is a certified CPD facilitator who specializes in professional development programs. He helps professionals stay current with industry trends.',
        specialization: 'Professional Development',
        category: 'cpd',
        subjects: 'Professional Development, Leadership, Ethics'
      }
    })
  ]);
  
  console.log({ lecturers });
  
  // Create sample news events
  const newsEvents = await Promise.all([
    prisma.newsEvent.upsert({
      where: { id: 'news-1' },
      update: {},
      create: {
        id: 'news-1',
        title: 'Coeus Celebrates 10 Years of Excellence',
        content: 'This year marks a significant milestone for Coeus Review & Training Specialist, Inc. as we celebrate our 10th anniversary. Over the past decade, we have helped thousands of students achieve their professional goals through our comprehensive review programs and CPD seminars.',
        summary: 'Coeus Review celebrates 10 years of helping students achieve their professional goals.',
        image: '/news-1.jpg',
        date: new Date('2023-06-01'),
        category: 'news',
        featured: true
      }
    }),
    prisma.newsEvent.upsert({
      where: { id: 'event-1' },
      update: {},
      create: {
        id: 'event-1',
        title: 'Upcoming Criminology Review Batch',
        content: 'Join our next Criminology Review batch starting this September. Limited slots available. Early bird discount until August 15.',
        summary: 'New Criminology Review batch starting September with early bird discount.',
        image: '/event-1.jpg',
        date: new Date('2023-09-01'),
        category: 'event',
        featured: false
      }
    })
  ]);
  
  console.log({ newsEvents });
  
  // Create sample testimonials
  const testimonials = await Promise.all([
    prisma.testimonial.upsert({
      where: { id: 'testimonial-1' },
      update: {},
      create: {
        id: 'testimonial-1',
        name: 'Maria Santos',
        role: 'Criminology Graduate',
        text: 'Coeus helped me pass my exam with flying colors! The review materials were comprehensive and the practice tests prepared me well for the actual exam.',
        image: '/learning-1.jpg',
        rating: 5
      }
    }),
    prisma.testimonial.upsert({
      where: { id: 'testimonial-2' },
      update: {},
      create: {
        id: 'testimonial-2',
        name: 'Juan Dela Cruz',
        role: 'Nursing Student',
        text: 'The lecturers are very knowledgeable and supportive. They go above and beyond to ensure we understand complex concepts.',
        image: '/image-1.jpg',
        rating: 5
      }
    }),
    prisma.testimonial.upsert({
      where: { id: 'testimonial-3' },
      update: {},
      create: {
        id: 'testimonial-3',
        name: 'Ana Reyes',
        role: 'Licensed Nurse',
        text: 'Highly recommend their review programs! I was struggling with certain topics but their specialized approach helped me overcome my challenges.',
        image: '/image-2.jpg',
        rating: 4
      }
    })
  ]);
  
  console.log({ testimonials });
  
  // Create sample students with photos
  const students = await Promise.all([
    prisma.student.upsert({
      where: { studentId: 'STU-2024-001' },
      update: {},
      create: {
        studentId: 'STU-2024-001',
        firstName: 'Maria',
        lastName: 'Santos',
        middleInitial: 'P',
        gender: 'Female',
        birthday: new Date('1998-05-15'),
        age: 25,
        birthPlace: 'Manila, Philippines',
        contactNumber: '+639123456789',
        email: 'maria.santos@email.com',
        address: '123 Rizal Street, Manila',
        region: 'National Capital Region',
        province: 'Metro Manila',
        city: 'Manila',
        barangay: 'Ermita',
        zipCode: '1000',
        guardianFirstName: 'Jose',
        guardianLastName: 'Santos',
        guardianContact: '+639987654321',
        guardianAddress: '123 Rizal Street, Manila',
        relationship: 'Father',
        schoolName: 'University of the Philippines',
        course: 'Bachelor of Science in Criminology',
        yearGraduated: '2020',
        howDidYouHear: 'Social Media',
        photoUrl: '/learning-1.jpg',
        status: 'active'
      }
    }),
    prisma.student.upsert({
      where: { studentId: 'STU-2024-002' },
      update: {},
      create: {
        studentId: 'STU-2024-002',
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        gender: 'Male',
        birthday: new Date('1999-03-22'),
        age: 24,
        birthPlace: 'Quezon City, Philippines',
        contactNumber: '+639234567890',
        email: 'juan.delacruz@email.com',
        address: '456 EDSA, Quezon City',
        region: 'National Capital Region',
        province: 'Metro Manila',
        city: 'Quezon City',
        barangay: 'Diliman',
        zipCode: '1100',
        guardianFirstName: 'Rosa',
        guardianLastName: 'Dela Cruz',
        guardianContact: '+639876543210',
        guardianAddress: '456 EDSA, Quezon City',
        relationship: 'Mother',
        schoolName: 'Ateneo de Manila University',
        course: 'Bachelor of Science in Nursing',
        yearGraduated: '2021',
        howDidYouHear: 'Referral',
        photoUrl: '/image-1.jpg',
        status: 'graduated'
      }
    }),
    prisma.student.upsert({
      where: { studentId: 'STU-2024-003' },
      update: {},
      create: {
        studentId: 'STU-2024-003',
        firstName: 'Ana',
        lastName: 'Reyes',
        middleInitial: 'M',
        gender: 'Female',
        birthday: new Date('1997-11-08'),
        age: 26,
        birthPlace: 'Cebu City, Philippines',
        contactNumber: '+639345678901',
        email: 'ana.reyes@email.com',
        address: '789 Colon Street, Cebu City',
        region: 'Central Visayas',
        province: 'Cebu',
        city: 'Cebu City',
        barangay: 'Lahug',
        zipCode: '6000',
        guardianFirstName: 'Pedro',
        guardianLastName: 'Reyes',
        guardianContact: '+639765432109',
        guardianAddress: '789 Colon Street, Cebu City',
        relationship: 'Father',
        schoolName: 'University of San Carlos',
        course: 'Bachelor of Science in Criminology',
        yearGraduated: '2019',
        howDidYouHear: 'Website',
        photoUrl: '/image-2.jpg',
        status: 'active'
      }
    })
  ]);
  
  console.log({ students });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });