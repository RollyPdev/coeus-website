"use client";
import React, { useState } from 'react';

const seminars = [
  {
    id: 1,
    title: "Professional Ethics and Ethical Standards",
    date: "June 15, 2023",
    time: "9:00 AM - 4:00 PM",
    location: "Main Hall, Coeus Training Center",
    speaker: "Dr. Maria Santos",
    cpd: 8,
    image: "/seminar1.jpg",
    description: "This seminar focuses on professional ethics and standards across various disciplines. Participants will learn about ethical decision-making frameworks and how to apply them in professional settings."
  },
  {
    id: 2,
    title: "Leadership and Management in Professional Practice",
    date: "July 22, 2023",
    time: "9:00 AM - 5:00 PM",
    location: "Conference Room A, Coeus Training Center",
    speaker: "Prof. James Rodriguez",
    cpd: 10,
    image: "/seminar2.jpg",
    description: "Develop essential leadership and management skills needed to excel in your professional field. This seminar covers team management, conflict resolution, and effective communication strategies."
  },
  {
    id: 3,
    title: "Digital Transformation in Professional Services",
    date: "August 10, 2023",
    time: "1:00 PM - 6:00 PM",
    location: "Virtual (Zoom)",
    speaker: "Engr. Ana Reyes",
    cpd: 6,
    image: "/seminar3.jpg",
    description: "Learn how digital technologies are transforming professional services and how to adapt to these changes. Topics include digital tools, cybersecurity, and leveraging technology for professional growth."
  },
  {
    id: 4,
    title: "Research Methodologies and Evidence-Based Practice",
    date: "September 5, 2023",
    time: "9:00 AM - 4:00 PM",
    location: "Main Hall, Coeus Training Center",
    speaker: "Dr. Carlos Mendoza",
    cpd: 8,
    image: "/seminar4.jpg",
    description: "This seminar covers research methodologies and how to implement evidence-based practices in your professional field. Participants will learn how to evaluate research and apply findings to their work."
  }
];

const SeminarPreviewSection = () => {
  const [selectedSeminar, setSelectedSeminar] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white" id="upcoming-seminars">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Upcoming CPD Seminars</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Enhance your professional development with our accredited CPD seminars. Earn CPD units while gaining valuable knowledge and skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {seminars.map((seminar) => (
            <div 
              key={seminar.id} 
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={seminar.image} 
                  alt={seminar.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-blue-700 text-white px-3 py-1 rounded-bl-lg">
                  {seminar.cpd} CPD Units
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">{seminar.title}</h3>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{seminar.date}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{seminar.time}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{seminar.location}</span>
                </div>
                
                <p className="text-gray-700 mb-6 line-clamp-2">{seminar.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Speaker:</span> {seminar.speaker}
                  </div>
                  <a 
                    href="#registration" 
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Register
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="#all-seminars" 
            className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800 transition-colors"
          >
            View all upcoming seminars
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SeminarPreviewSection;