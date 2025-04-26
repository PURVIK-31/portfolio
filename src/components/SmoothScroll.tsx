'use client';

import React, { useEffect, useRef } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
  speed?: number;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ 
  children,
  speed = 0.1 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollingContainerRef = useRef<HTMLDivElement>(null);
  const currentScrollY = useRef(0);
  const targetScrollY = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Get the document height and set it to the scrolling container
    const setBodyHeight = () => {
      if (scrollingContainerRef.current) {
        document.body.style.height = `${scrollingContainerRef.current.getBoundingClientRect().height}px`;
      }
    };

    // Update scroll position with smooth animation
    const smoothScroll = () => {
      currentScrollY.current += (targetScrollY.current - currentScrollY.current) * speed;
      
      if (scrollingContainerRef.current) {
        scrollingContainerRef.current.style.transform = `translateY(${-currentScrollY.current}px)`;
      }
      
      rafRef.current = requestAnimationFrame(smoothScroll);
    };

    // Handle scroll events
    const handleScroll = () => {
      targetScrollY.current = window.scrollY;
    };

    // Handle resize events
    const handleResize = () => {
      setBodyHeight();
    };

    // Initialize
    setBodyHeight();
    requestAnimationFrame(smoothScroll);

    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      // Clean up
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [speed]);

  return (
    <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
      <div ref={scrollingContainerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', willChange: 'transform' }}>
        {children}
      </div>
    </div>
  );
};

export default SmoothScroll; 