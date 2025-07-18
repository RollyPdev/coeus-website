import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@coeus.com' },
    update: {},
    create: {
      email: 'admin@coeus.com',
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });