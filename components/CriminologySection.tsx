import React from 'react';

const CriminologySection = () => {
  const subjects = [
    "Criminal Law and Jurisprudence",
    "Law Enforcement Administration",
    "Criminalistics",
    "Crime Detection and Investigation",
    "Criminal Sociology",
    "Correctional Administration"
  ];

  return (
    <section className="py-20 bg-white" id="criminology">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Criminology Review Program</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our comprehensive Criminology Review Program is designed to prepare you for the Criminologist Licensure Examination with expert-led sessions and practice tests.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src="/learning-1.jpg" 
              alt="Criminology Review" 
              className="w-full h-64 object-cover"
            />
            <div className="p-6 bg-gradient-to-br from-blue-50 to-white">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Program Overview</h3>
              <p className="text-gray-700 mb-4">
                Our Criminology Review Program offers a comprehensive approach to preparing for the Criminologist Licensure Examination. With expert lecturers, up-to-date materials, and proven methodologies, we ensure you&apos;re well-equipped for success.
              </p>
              <p className="text-gray-700">
                The program includes intensive review sessions, mock examinations, and personalized coaching to address your specific needs and areas for improvement.
              </p>
            </div>
          </div>

          <div className="bg-blue-700 text-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-6">Key Subjects Covered</h3>
            <ul className="space-y-4">
              {subjects.map((subject, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-6 w-6 text-blue-300 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{subject}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-3">Program Duration</h4>
              <p className="text-blue-100">
                6 months intensive review (Weekend classes available)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 shadow-md">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">Why Choose Our Criminology Review?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="text-blue-700 mb-3">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Comprehensive Materials</h4>
              <p className="text-gray-600">Updated review materials aligned with the latest examination requirements.</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="text-blue-700 mb-3">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Expert Instructors</h4>
              <p className="text-gray-600">Learn from experienced criminologists and law enforcement professionals.</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="text-blue-700 mb-3">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Proven Track Record</h4>
              <p className="text-gray-600">High passing rates and numerous topnotchers in previous examinations.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a 
            href="#contact" 
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            Enroll in Criminology Review
          </a>
        </div>
      </div>
    </section>
  );
};

export default CriminologySection;