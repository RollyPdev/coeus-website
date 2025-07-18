import React from 'react';

const AboutCEOSection = () => {
  return (
    <section className="py-16 bg-gray-50 flex flex-col md:flex-row items-center" id="about-ceo">
      <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
        <img src="/ceo.jpg" alt="CEO" className="w-64 h-64 object-cover rounded-full border-4 border-blue-700 shadow-lg" />
      </div>
      <div className="md:w-1/2 px-8">
        <h2 className="text-3xl font-bold mb-4">About the CEO</h2>
        <p className="text-gray-700 mb-4">Our CEO is dedicated to providing the best review and training programs for professionals. With years of experience and a passion for education, they lead Coeus to excellence.</p>
        <button className="bg-blue-700 text-white px-6 py-2 rounded-full font-bold shadow hover:bg-blue-800 transition">Read More...</button>
      </div>
    </section>
  );
};

export default AboutCEOSection;
