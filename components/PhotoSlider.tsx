"use client";

import React, { useState, useEffect } from 'react';

// Sample slider images - replace with your actual images
const sliderImages = [
  {
    url: '/background-image.jpg',
    title: 'Achieve Excellence',
    subtitle: 'With our comprehensive review programs',
  },
  {
    url: '/image-1.jpg',
    title: 'Expert Lecturers',
    subtitle: 'Learn from industry professionals',
  },
  {
    url: '/image-2.jpg',
    title: 'Modern Facilities',
    subtitle: 'Conducive learning environment',
  },
  {
    url: '/image-3.jpg',
    title: 'Proven Results',
    subtitle: 'High passing rates in licensure exams',
  },
];

const PhotoSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, isAnimating]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden" id="home">
      {/* Slides */}
      {sliderImages.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(${slide.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: index === currentSlide ? 10 : 0,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 md:px-8">
            <div className={`transform transition-all duration-1000 delay-300 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">{slide.title}</h1>
              <p className="text-xl md:text-2xl text-center max-w-2xl mx-auto">{slide.subtitle}</p>
              <div className="mt-8 flex justify-center space-x-4">
                <a 
                  href="#programs" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Explore Programs
                </a>
                <a 
                  href="#contact" 
                  className="bg-transparent hover:bg-white/20 text-white border-2 border-white font-medium py-3 px-6 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation arrows */}
      <button 
        onClick={prevSlide} 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={nextSlide} 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm transition-all duration-300"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Dots navigation */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center space-x-2">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoSlider;
