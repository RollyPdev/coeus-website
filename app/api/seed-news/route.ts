import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    // Clear existing news events
    await prisma.newsEvent.deleteMany();

    // Add the news events
    const newsEvents = [
      {
        title: "Upcoming Criminology Review Batch",
        content: "Join our comprehensive Criminology Review program starting this September. Early bird discount available for the first 50 enrollees. Our expert instructors will guide you through all the essential topics needed to pass the Criminologist Licensure Examination.",
        summary: "New Criminology Review batch starting September with early bird discount.",
        image: "/learning-1.jpg",
        date: new Date("2023-09-01"),
        category: "event",
        featured: true
      },
      {
        title: "Coeus Celebrates 10 Years of Excellence",
        content: "We are proud to celebrate our 10th anniversary of providing quality review programs and helping thousands of students pass their licensure examinations. Over the years, we have maintained a high passing rate and continue to be a trusted name in professional review and training.",
        summary: "Coeus Review celebrates 10 years of helping students achieve their professional goals.",
        image: "/image-1.jpg",
        date: new Date("2023-06-01"),
        category: "news",
        featured: false
      },
      {
        title: "New Nursing Review Program",
        content: "We are excited to announce our enhanced Nursing Review Program featuring updated curriculum and expert instructors. The program includes comprehensive study materials, mock examinations, and personalized coaching to ensure your success in the nursing licensure examination.",
        summary: "Introducing our enhanced Nursing Review Program with updated curriculum.",
        image: "/image-1.jpg",
        date: new Date("2023-08-15"),
        category: "news",
        featured: false
      },
      {
        title: "Career Development Workshop",
        content: "Enhance your career prospects with our comprehensive workshop covering resume writing, interview skills, and networking. This full-day event will provide you with practical tools and strategies to advance your professional career.",
        summary: "Join our career development workshop for professional growth.",
        image: "/learning-1.jpg",
        date: new Date("2023-07-20"),
        category: "event",
        featured: false
      },
      {
        title: "Professional Development Seminar",
        content: "Join us for a day of learning and networking with industry professionals. This seminar will cover the latest trends and best practices in your field, providing valuable insights for career advancement.",
        summary: "Enhance your professional skills with our comprehensive seminar.",
        image: "/learning-1.jpg",
        date: new Date("2023-05-10"),
        category: "event",
        featured: false
      }
    ];

    for (const newsEvent of newsEvents) {
      await prisma.newsEvent.create({
        data: newsEvent
      });
    }

    return NextResponse.json({ message: 'News events seeded successfully!' });
  } catch (error) {
    console.error('Error seeding news events:', error);
    return NextResponse.json({ error: 'Failed to seed news events' }, { status: 500 });
  }
}