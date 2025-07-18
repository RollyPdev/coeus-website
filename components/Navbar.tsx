"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrolled ? 'shadow-md backdrop-blur-md bg-white/90' : 'bg-white shadow-sm'}`}
      style={{
        WebkitBackdropFilter: scrolled ? 'blur(8px)' : 'none',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Coeus Logo" 
                className="h-10 w-auto mr-3 transition-transform duration-300" 
                style={{ transform: scrolled ? 'scale(0.95)' : 'scale(1)' }} 
              />
              <span className="font-bold text-lg md:text-xl text-blue-900 hidden sm:block">Coeus Review &amp; Training</span>
            </Link>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-blue-700 font-medium transition-colors">Home</Link>
            <div className="relative group">
              <button className="hover:text-blue-700 font-medium transition-colors flex items-center">
                Programs
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link href="/criminology" className="block px-4 py-2 hover:bg-blue-50 rounded-t-lg">Criminology</Link>
                <a href="#nursing" className="block px-4 py-2 hover:bg-blue-50">Nursing</a>
                <Link href="/cpd" className="block px-4 py-2 hover:bg-blue-50 rounded-b-lg">CPD Seminars</Link>
              </div>
            </div>
            <div className="relative group">
              <button className="hover:text-blue-700 font-medium transition-colors flex items-center">
                What&apos;s New
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link href="/news" className="block px-4 py-2 hover:bg-blue-50 rounded-t-lg">News &amp; Events</Link>
                <a href="#promo" className="block px-4 py-2 hover:bg-blue-50">Promo</a>
                <a href="#lecturers" className="block px-4 py-2 hover:bg-blue-50 rounded-b-lg">Review Lecturers</a>
              </div>
            </div>
            <Link href="/about" className="hover:text-blue-700 font-medium transition-colors">About Us</Link>
            <a href="#contact" className="rounded-full bg-blue-700 text-white px-6 py-2 font-medium shadow-md hover:bg-blue-800 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
              Enroll Now
            </a>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-blue-700 focus:outline-none focus:text-blue-700"
              aria-label="Toggle menu"
            >
              {!mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`} style={{ top: '60px' }}>
        <div className="px-4 pt-2 pb-4 space-y-1 h-full overflow-y-auto">
          <Link href="/" onClick={closeMobileMenu} className="block py-2 hover:text-blue-700">Home</Link>
          
          <div className="py-2">
            <div className="flex justify-between items-center hover:text-blue-700">
              <span>Programs</span>
            </div>
            <div className="pl-4 mt-1 space-y-1">
              <Link href="/criminology" onClick={closeMobileMenu} className="block py-1 text-sm text-gray-600 hover:text-blue-700">Criminology</Link>
              <a href="#nursing" onClick={closeMobileMenu} className="block py-1 text-sm text-gray-600 hover:text-blue-700">Nursing</a>
              <Link href="/cpd" onClick={closeMobileMenu} className="block py-1 text-sm text-gray-600 hover:text-blue-700">CPD Seminars</Link>
            </div>
          </div>
          
          <div className="py-2">
            <div className="flex justify-between items-center hover:text-blue-700">
              <span>What&apos;s New</span>
            </div>
            <div className="pl-4 mt-1 space-y-1">
              <Link href="/news" onClick={closeMobileMenu} className="block py-1 text-sm text-gray-600 hover:text-blue-700">News &amp; Events</Link>
              <a href="#promo" onClick={closeMobileMenu} className="block py-1 text-sm text-gray-600 hover:text-blue-700">Promo</a>
              <a href="#lecturers" onClick={closeMobileMenu} className="block py-1 text-sm text-gray-600 hover:text-blue-700">Review Lecturers</a>
            </div>
          </div>
          
          <Link href="/about" onClick={closeMobileMenu} className="block py-2 hover:text-blue-700">About Us</Link>
          <div className="pt-2">
            <a 
              href="#contact" 
              onClick={closeMobileMenu}
              className="block w-full text-center rounded-full bg-blue-700 text-white px-6 py-2 font-medium shadow-md hover:bg-blue-800 transition-colors"
            >
              Enroll Now
            </a>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeMobileMenu}
          style={{ top: '60px' }}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;