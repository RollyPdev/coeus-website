import React from 'react';
import { Metadata } from 'next';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: 'About Us - Coeus Review & Training Specialist, Inc.',
  description: 'Learn about Coeus Review & Training Specialist, Inc. - our vision, mission, history, and leadership team. Founded in 2013, we are committed to excellence in professional education.',
  openGraph: {
    title: 'About Coeus Review & Training Specialist, Inc.',
    description: 'Discover our story, leadership team, and commitment to excellence in professional education since 2013.',
    url: 'https://coeus-incorporated.com/about',
    images: [
      {
        url: 'https://coeus-incorporated.com/image-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Coeus Review Center About Us',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Coeus Review & Training Specialist, Inc.',
    description: 'Learn about our journey of excellence in professional education since 2013.',
    images: ['https://coeus-incorporated.com/image-1.jpg'],
  },
};

// Sample data - replace with actual data
const boardMembers = [
  {
    name: "Dr. Maria Santos",
    position: "Chairperson",
    photo: "/board1.jpg",
    bio: "Dr. Santos has over 25 years of experience in education and professional training. She founded Coeus Review & Training Specialist, Inc. with a vision to provide high-quality review programs for aspiring professionals."
  },
  {
    name: "Atty. James Rodriguez",
    position: "Vice Chairperson",
    photo: "/board2.jpg",
    bio: "Atty. Rodriguez brings his legal expertise to ensure that all Coeus programs comply with regulatory requirements. He has been instrumental in developing the company's governance framework."
  },
  {
    name: "Dr. Carlos Mendoza",
    position: "Corporate Secretary",
    photo: "/board3.jpg",
    bio: "Dr. Mendoza oversees the academic quality of all review programs. His background in educational management ensures that Coeus maintains its high standards of teaching and learning."
  },
  {
    name: "Ms. Elena Cruz",
    position: "Treasurer",
    photo: "/board4.jpg",
    bio: "Ms. Cruz manages the financial aspects of the company. Her expertise in financial management has helped Coeus grow sustainably while maintaining affordable program fees for students."
  }
];

const staffMembers = [
  {
    name: "Mr. John Tan",
    position: "Operations Manager",
    photo: "/staff1.jpg"
  },
  {
    name: "Ms. Sarah Johnson",
    position: "Academic Coordinator",
    photo: "/staff2.jpg"
  },
  {
    name: "Mr. Michael Lee",
    position: "Marketing Director",
    photo: "/staff3.jpg"
  },
  {
    name: "Ms. Ana Reyes",
    position: "Student Affairs Officer",
    photo: "/staff4.jpg"
  },
  {
    name: "Mr. David Garcia",
    position: "IT Administrator",
    photo: "/staff5.jpg"
  },
  {
    name: "Ms. Sofia Mendoza",
    position: "Administrative Assistant",
    photo: "/staff6.jpg"
  }
];

export default function AboutPage() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <main className="pt-20">
        {/* Page Header */}
        <div className="bg-blue-900 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl text-blue-100 max-w-3xl">
                      Learn more about Coeus Review &amp; Training Specialist, Inc. and our commitment to excellence in professional education
            </p>
          </div>
        </div>
        
        {/* Vision, Mission, Goals Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 rounded-xl p-8 shadow-md">
                <div className="bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Our Vision</h2>
                <p className="text-gray-700">
                  To be the leading review and training center in the Philippines, recognized for excellence in preparing professionals for licensure examinations and continuous professional development.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-8 shadow-md">
                <div className="bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Our Mission</h2>
                <p className="text-gray-700">
                  To provide high-quality review programs and professional development seminars that equip individuals with the knowledge, skills, and confidence needed to excel in their chosen fields and contribute meaningfully to society.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-8 shadow-md">
                <div className="bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Our Goals</h2>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Achieve consistently high passing rates in licensure examinations</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Provide up-to-date and relevant training materials</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Maintain a team of expert and dedicated lecturers</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Expand our reach to serve more aspiring professionals</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Company Background and History */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Our Story</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2">
                  <img 
                    src="/logo.png" 
                    alt="Company History" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="lg:w-1/2 p-8">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">Our Journey of Excellence</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Coeus Review &amp; Training Specialist, Inc. was founded in 2013 by Dr. Maria Santos, a passionate educator with a vision to transform professional education in the Philippines. What began as a small review center with just two classrooms and three lecturers has grown into one of the country&apos;s most respected training institutions.
                    </p>
                    <p>
                      Named after Coeus, the Titan god of intellect and inquisitive minds in Greek mythology, our institution embodies the pursuit of knowledge and excellence. Over the years, we have expanded our programs to include Criminology and Nursing licensure review, as well as a wide range of CPD seminars for various professions.
                    </p>
                    <p>
                      Our growth has been driven by our commitment to quality education and the success of our students. With consistently high passing rates in licensure examinations and positive feedback from our CPD seminar attendees, we have established a reputation for excellence in professional education.
                    </p>
                    <p>
                      Today, Coeus Review & Training Specialist, Inc. operates in multiple locations across the Philippines, serving thousands of students annually. We continue to innovate our teaching methodologies and expand our offerings to meet the evolving needs of professionals in various fields.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Timeline */}
            <div className="mt-16 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-blue-900 mb-8 text-center">Our Milestones</h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
                
                {/* Timeline items */}
                <div className="relative z-10">
                  <div className="mb-12 flex items-center">
                    <div className="w-1/2 pr-8 text-right">
                      <h4 className="font-bold text-blue-700">2013</h4>
                      <p className="text-gray-700">Founded by Dr. Maria Santos with initial focus on Criminology review</p>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-blue-100"></div>
                    <div className="w-1/2 pl-8"></div>
                  </div>
                  
                  <div className="mb-12 flex items-center">
                    <div className="w-1/2 pr-8"></div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-blue-100"></div>
                    <div className="w-1/2 pl-8">
                      <h4 className="font-bold text-blue-700">2015</h4>
                      <p className="text-gray-700">Expanded to include Nursing licensure review programs</p>
                    </div>
                  </div>
                  
                  <div className="mb-12 flex items-center">
                    <div className="w-1/2 pr-8 text-right">
                      <h4 className="font-bold text-blue-700">2017</h4>
                      <p className="text-gray-700">Achieved 95% passing rate for Criminology board exam</p>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-blue-100"></div>
                    <div className="w-1/2 pl-8"></div>
                  </div>
                  
                  <div className="mb-12 flex items-center">
                    <div className="w-1/2 pr-8"></div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-blue-100"></div>
                    <div className="w-1/2 pl-8">
                      <h4 className="font-bold text-blue-700">2019</h4>
                      <p className="text-gray-700">Launched CPD seminar programs for various professions</p>
                    </div>
                  </div>
                  
                  <div className="mb-12 flex items-center">
                    <div className="w-1/2 pr-8 text-right">
                      <h4 className="font-bold text-blue-700">2021</h4>
                      <p className="text-gray-700">Introduced online review programs and virtual CPD seminars</p>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-blue-100"></div>
                    <div className="w-1/2 pl-8"></div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-1/2 pr-8"></div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-blue-100"></div>
                    <div className="w-1/2 pl-8">
                      <h4 className="font-bold text-blue-700">2023</h4>
                      <p className="text-gray-700">Celebrating 10 years of excellence in professional education</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Board of Directors */}
        <section className="py-16 bg-white" id="board">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Board of Directors</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Meet the leadership team guiding Coeus Review & Training Specialist, Inc. towards excellence and innovation in professional education.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {boardMembers.map((member, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-blue-900 mb-1">{member.name}</h3>
                    <p className="text-blue-700 font-medium mb-4">{member.position}</p>
                    <p className="text-gray-700 text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Staff */}
        <section className="py-16 bg-blue-50" id="staff">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Our Staff</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Our dedicated staff works tirelessly to ensure that our students receive the best possible education and support.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {staffMembers.map((member, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md text-center"
                >
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-blue-900 text-sm mb-1">{member.name}</h3>
                    <p className="text-gray-600 text-xs">{member.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Join the Coeus Family</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Be part of our growing community of successful professionals. Enroll in our programs today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/programs" 
                className="bg-white text-blue-700 hover:bg-blue-50 font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Explore Our Programs
              </a>
              <a 
                href="#contact" 
                className="bg-transparent hover:bg-white/20 text-white border-2 border-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}