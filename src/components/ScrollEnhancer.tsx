'use client';

import { useEffect, useState } from 'react';

// Use a type that extends WheelEvent without conflicting with existing properties
interface LegacyWheelProperties {
  wheelDelta?: number;
  wheelDeltaY?: number;
  wheelDeltaX?: number;
  axis?: number;
  HORIZONTAL_AXIS?: number;
}

// This function normalizes wheel events across browsers
const normalizeWheel = (event: WheelEvent & LegacyWheelProperties) => {
  let spinX = 0;
  let spinY = 0;
  let pixelX = 0;
  let pixelY = 0;

  // Legacy support for momentum scrolling on trackpads
  if (event.detail) {
    spinY = event.detail;
  }
  if (event.wheelDelta) {
    spinY = -event.wheelDelta / 120;
  }
  if (event.wheelDeltaY) {
    spinY = -event.wheelDeltaY / 120;
  }
  if (event.wheelDeltaX) {
    spinX = -event.wheelDeltaX / 120;
  }

  // Side scrolling on FF with DOMMouseScroll
  if (event.axis && event.axis === event.HORIZONTAL_AXIS) {
    spinX = spinY;
    spinY = 0;
  }

  pixelX = spinX * 10;
  pixelY = spinY * 10;

  return {
    spinX,
    spinY,
    pixelX,
    pixelY,
    delta: Math.abs(pixelY) > Math.abs(pixelX) ? pixelY : pixelX,
  };
};

interface ScrollEnhancerProps {
  damping?: number;
  sensitivity?: number;
}

// Function to detect if the device is mobile
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check screen size first (most reliable for responsive design)
  if (window.innerWidth <= 768) return true;
  
  // Fallback to user agent check
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Regular expression for mobile devices
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  return mobileRegex.test(userAgent);
};

export default function ScrollEnhancer({ 
  damping = 0.1, 
  sensitivity = 1.0 
}: ScrollEnhancerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if mobile on mount
    setIsMobile(isMobileDevice());
    
    // Update on resize to handle orientation changes or browser resizing
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Skip all scrolling logic for mobile devices
    if (typeof window === 'undefined' || isMobile) return;

    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;
    let scrollingEnabled = true;
    let rafId: number | null = null;
    let lastScrollTime = Date.now();
    const scrollDuration = 2000; // ms for scroll animation

    const smoothScrollLoop = () => {
      // Only apply smooth scrolling if we're not currently scrolling normally
      if (scrollingEnabled) {
        const now = Date.now();
        const elapsedTime = now - lastScrollTime;
        
        // Gradually reduce the damping factor as time passes to create a natural deceleration
        const dynamicDamping = damping * Math.min(1, elapsedTime / scrollDuration);
        
        // Calculate the distance to scroll
        const delta = targetScrollY - currentScrollY;
        
        // If we're very close to the target, just set it directly to avoid tiny movements
        if (Math.abs(delta) < 0.1) {
          currentScrollY = targetScrollY;
        } else {
          // Apply damping for smooth deceleration
          currentScrollY += delta * dynamicDamping;
        }
        
        // Apply the scroll position
        window.scrollTo(0, currentScrollY);
      }
      
      rafId = requestAnimationFrame(smoothScrollLoop);
    };

    const handleWheel = (e: WheelEvent) => {
      // Prevent the default scroll behavior
      e.preventDefault();
      
      // Normalize the wheel event for consistent behavior across browsers
      const normalized = normalizeWheel(e as WheelEvent & LegacyWheelProperties);
      
      // Calculate the target scroll position with a multiplier for sensitivity
      targetScrollY += normalized.delta * sensitivity;
      
      // Ensure we don't scroll below 0 or beyond the document height
      targetScrollY = Math.max(0, Math.min(targetScrollY, document.body.scrollHeight - window.innerHeight));
      
      // Update the last scroll time for our damping calculation
      lastScrollTime = Date.now();
      
      // Temporarily disable normal scrolling to avoid conflicts
      scrollingEnabled = true;
    };

    // Start the smooth scroll animation loop
    rafId = requestAnimationFrame(smoothScrollLoop);

    // Add the wheel event listener with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Clean up on unmount
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('wheel', handleWheel);
    };
  }, [damping, sensitivity, isMobile]);

  return null;
} 