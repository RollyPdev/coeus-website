"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // For our simplified base64 token format
        const decoded = atob(token);
        if (decoded.includes(':')) {
          const [email, timestamp] = decoded.split(':');
          const tokenAge = Date.now() - parseInt(timestamp);
          // Token valid for 24 hours (86400000 ms)
          if (tokenAge < 86400000) {
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        }
        // Invalid or expired token
        localStorage.removeItem('adminToken');
        router.push('/login');
      } catch (error) {
        localStorage.removeItem('adminToken');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">CR</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
