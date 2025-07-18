"use client";

import { useState } from "react";

export default function AboutContentPage() {
  const [formData, setFormData] = useState({
    vision: "To be the leading review and training center in the Philippines, recognized for excellence in preparing professionals for licensure examinations and continuous professional development.",
    mission: "To provide high-quality review programs and professional development seminars that equip individuals with the knowledge, skills, and confidence needed to excel in their chosen fields and contribute meaningfully to society.",
    goals: "Achieve consistently high passing rates in licensure examinations\nProvide up-to-date and relevant training materials\nMaintain a team of expert and dedicated lecturers\nExpand our reach to serve more aspiring professionals",
    story: "Coeus Review & Training Specialist, Inc. was founded in 2013 by Dr. Maria Santos, a passionate educator with a vision to transform professional education in the Philippines. What began as a small review center with just two classrooms and three lecturers has grown into one of the country's most respected training institutions."
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage({
        type: 'success',
        text: 'About content updated successfully!'
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }, 1000);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">About Content</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label htmlFor="vision" className="block text-sm font-medium text-gray-700 mb-1">
            Vision
          </label>
          <textarea
            id="vision"
            name="vision"
            rows={4}
            value={formData.vision}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="mission" className="block text-sm font-medium text-gray-700 mb-1">
            Mission
          </label>
          <textarea
            id="mission"
            name="mission"
            rows={4}
            value={formData.mission}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">
            Goals (one per line)
          </label>
          <textarea
            id="goals"
            name="goals"
            rows={4}
            value={formData.goals}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="story" className="block text-sm font-medium text-gray-700 mb-1">
            Our Story
          </label>
          <textarea
            id="story"
            name="story"
            rows={6}
            value={formData.story}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}