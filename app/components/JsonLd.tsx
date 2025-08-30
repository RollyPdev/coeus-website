'use client';

import React, { useEffect } from 'react';

export default function JsonLd() {
  useEffect(() => {
    // Add JSON-LD to the document head
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      'name': 'Coeus Review & Training Specialist, Inc.',
      'description': 'Leading review center for Criminology and Nursing board exams with proven track record of success.',
      'url': 'https://coeusreview.com',
      'logo': 'https://coeusreview.com/images/logo.png',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Barangay Punta Tabuc',
        'addressLocality': 'Roxas City',
        'addressRegion': 'Capiz',
        'postalCode': '5800',
        'addressCountry': 'PH'
      },
      'telephone': '(02) 8123-4567',
      'email': 'info@coeusreview.com',
      'sameAs': [
        'https://facebook.com/coeusreview',
        'https://twitter.com/coeusreview',
        'https://instagram.com/coeusreview'
      ],
      'offers': {
        '@type': 'Offer',
        'category': 'Educational Services',
        'availability': 'https://schema.org/InStock'
      }
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}