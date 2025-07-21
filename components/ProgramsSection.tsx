import React from 'react';

const programs = [
  {
    title: 'Criminologist Licensure Review',
    image: '/learning-1.jpg',
    description: 'Comprehensive review program designed to prepare aspiring criminologists for the licensure examination with expert-led sessions and practice tests.',
    features: ['Expert Lecturers', 'Mock Exams', 'Study Materials', 'Small Class Size']
  },
  {
    title: 'Nursing Licensure Review',
    image: '/background-image.jpg',
    description: 'Intensive review program for nursing graduates featuring specialized modules covering all exam areas with hands-on clinical simulations.',
    features: ['Clinical Simulations', 'Specialized Modules', 'Exam Techniques', 'Performance Analysis']
  },
  {
    title: 'CPD Seminars',
    image: '/background-image.jpg',
    description: 'Professional development seminars for licensed professionals across various fields to earn continuing professional development units.',
    features: ['Industry Updates', 'Networking', 'Certificate', 'Flexible Schedule']
  }
];

const ProgramsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50" id="programs">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Our Programs</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">Discover our specialized review programs and professional development seminars designed to help you achieve your career goals.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={program.image} 
                  alt={program.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
                <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">{program.title}</h3>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700 mb-4">{program.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {program.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <svg className="h-4 w-4 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <a 
                  href={program.title === 'Criminologist Licensure Review' ? '/criminology' : `#${program.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-block w-full text-center py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
                >
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
