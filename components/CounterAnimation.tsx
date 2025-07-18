"use client";

import React, { useState, useEffect, useRef } from 'react';

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

const CounterAnimation: React.FC<CounterProps> = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const timePassed = Date.now() - startTime;
      const progress = Math.min(timePassed / duration, 1);
      
      countRef.current = Math.floor(progress * end);
      setCount(countRef.current);
      
      if (progress === 1) {
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, isVisible]);

  return (
    <div ref={ref} className="inline-block">
      <span className="text-4xl font-bold">{count}</span>
      {suffix}
    </div>
  );
};

export default CounterAnimation;