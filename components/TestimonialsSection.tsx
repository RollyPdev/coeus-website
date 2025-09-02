"use client";
import React, { useState, useEffect, useCallback } from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  image: string;
  rating: number;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance the slider
  const nextSlide = () => {
    if (isAnimating || testimonials.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        // Fallback to static data
        setTestimonials([
          { id: '1', name: 'Maria Santos', role: 'Criminology Graduate', text: 'Coeus helped me pass my exam with flying colors!', image: '/learning-1.jpg', rating: 5 },
          { id: '2', name: 'Juan Dela Cruz', role: 'Nursing Student', text: 'The lecturers are very knowledgeable and supportive.', image: '/image-1.jpg', rating: 5 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAnimating || testimonials.length === 0) return;
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAnimating, testimonials.length]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white" id="testimonials">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }
  
  // Calculate the indices of visible testimonials (3 at a time)
  const visibleIndices = testimonials.length > 0 ? [
    currentIndex % testimonials.length,
    (currentIndex + 1) % testimonials.length,
    (currentIndex + 2) % testimonials.length
  ] : [];
  
  const prevSlide = () => {
    if (isAnimating || testimonials.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  // Generate star rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <svg 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white" id="testimonials">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">What Our Students Say</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">Hear from our successful graduates and students about their experience with Coeus Review.</p>
        </div>
        
        <div className="relative">
          {/* Testimonials slider */}
          <div className="flex justify-center gap-4 md:gap-8 px-4">
            {testimonials.length > 0 && visibleIndices.map((idx, i) => (
              <div 
                key={idx} 
                className={`relative w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 transition-all duration-500 transform ${
                  isAnimating ? 'opacity-80 scale-95' : 'opacity-100 scale-100'
                } ${i === 1 ? 'md:scale-110 z-10' : 'z-0'} min-h-[280px] flex flex-col`}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                </div>
                
                <div className="pt-6 text-center flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-center mb-3">
                      {testimonials[idx] && renderStars(testimonials[idx].rating)}
                    </div>
                    
                    <p className="italic text-gray-700 mb-6 text-sm leading-relaxed">&quot;{testimonials[idx]?.text}&quot;</p>
                  </div>
                  
                  <div className="flex items-center justify-center mt-auto">
                    <img 
                      src={testimonials[idx]?.image} 
                      alt={testimonials[idx]?.name} 
                      className="w-14 h-14 rounded-full border-2 border-blue-600 object-cover mr-3" 
                    />
                    <div className="text-left">
                      <h4 className="font-bold text-blue-900">{testimonials[idx]?.name}</h4>
                      <p className="text-sm text-gray-600">{testimonials[idx]?.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation arrows */}
          <button 
            onClick={prevSlide} 
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-700 rounded-full p-2 shadow-md z-20 transition-all duration-300 hidden md:block"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextSlide} 
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-700 rounded-full p-2 shadow-md z-20 transition-all duration-300 hidden md:block"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Dots navigation */}
        {testimonials.length > 0 && (
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (isAnimating) return;
                setIsAnimating(true);
                setCurrentIndex(idx);
                setTimeout(() => setIsAnimating(false), 500);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-blue-600 w-6' : 'bg-blue-300 hover:bg-blue-400'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
            ))}
          </div>
        )}
        
        {/* CTA */}
        <div className="text-center mt-12">
          <a 
            href="#contact" 
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            Join Our Success Stories
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;