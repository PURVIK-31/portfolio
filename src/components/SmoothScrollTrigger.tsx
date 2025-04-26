'use client';

import React, { useEffect, useRef } from 'react';

interface SmoothScrollTriggerProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  distance?: number;
  threshold?: number;
}

const SmoothScrollTrigger: React.FC<SmoothScrollTriggerProps> = ({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.8,
  distance = 50,
  threshold = 0.1,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            const element = entry.target as HTMLElement;
            
            // Initial styles (hidden and translated)
            let initialTransform = '';
            switch (direction) {
              case 'up':
                initialTransform = `translateY(${distance}px)`;
                break;
              case 'down':
                initialTransform = `translateY(-${distance}px)`;
                break;
              case 'left':
                initialTransform = `translateX(${distance}px)`;
                break;
              case 'right':
                initialTransform = `translateX(-${distance}px)`;
                break;
            }
            
            element.style.opacity = '0';
            element.style.transform = initialTransform;
            element.style.transition = `opacity ${duration}s ease ${delay}s, transform ${duration}s ease ${delay}s`;
            
            // Force a reflow before applying the animation
            void element.offsetHeight;
            
            // Animate to visible
            setTimeout(() => {
              element.style.opacity = '1';
              element.style.transform = 'translate(0)';
            }, 10);
            
            hasAnimated.current = true;
          }
        });
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay, direction, duration, distance, threshold]);

  return (
    <div ref={ref} style={{ overflow: 'hidden', willChange: 'transform, opacity' }}>
      {children}
    </div>
  );
};

export default SmoothScrollTrigger; 