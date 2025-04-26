'use client';

import React, { useEffect, useState, useRef } from 'react';

interface CursorProps {
  size?: number;
  color?: string;
  trailOpacity?: number;
  smoothing?: number;
  trailCount?: number;
}

interface Position {
  x: number;
  y: number;
  timestamp?: number;
}

const RippleCursor: React.FC<CursorProps> = ({
  size = 8,
  color = 'rgba(0, 180, 255, 0.8)',
  trailOpacity = 0.5,
  smoothing = 0.2,
  trailCount = 3,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<Position>({ x: 0, y: 0 });
  const mousePositionRef = useRef<Position>({ x: 0, y: 0 });
  const trailPositionsRef = useRef<Position[]>([]);
  const rafRef = useRef<number | null>(null);

  // Initialize trail positions
  useEffect(() => {
    const initialPositions = Array(trailCount).fill({ x: 0, y: 0, timestamp: Date.now() });
    trailPositionsRef.current = initialPositions;
    setPositions(initialPositions);
  }, [trailCount]);

  useEffect(() => {
    setIsMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { 
        x: e.clientX, 
        y: e.clientY,
        timestamp: Date.now()
      };
    };
    
    const updateCursorPosition = () => {
      // Update main cursor position with smooth movement
      positionRef.current.x += (mousePositionRef.current.x - positionRef.current.x) * smoothing;
      positionRef.current.y += (mousePositionRef.current.y - positionRef.current.y) * smoothing;
      
      // Update trail positions with increasing delay
      const newTrailPositions = [...trailPositionsRef.current];
      
      // Shift trail positions
      for (let i = trailCount - 1; i > 0; i--) {
        newTrailPositions[i] = { 
          x: newTrailPositions[i-1].x,
          y: newTrailPositions[i-1].y,
          timestamp: Date.now()
        };
      }
      
      // Set the first trail position to follow the cursor
      newTrailPositions[0] = { 
        x: positionRef.current.x,
        y: positionRef.current.y,
        timestamp: Date.now()
      };
      
      trailPositionsRef.current = newTrailPositions;
      setPositions([...newTrailPositions]);
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
      }
      
      rafRef.current = requestAnimationFrame(updateCursorPosition);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(updateCursorPosition);
    
    // Initial cursor position at center of screen to avoid offscreen issues
    mousePositionRef.current = { 
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2,
      timestamp: Date.now()
    };
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [smoothing, trailCount]);
  
  if (!isMounted) return null;
  
  return (
    <>
      {/* Main cursor */}
      <div 
        ref={cursorRef}
        className="fixed pointer-events-none z-[99999]"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: size,
          height: size,
          marginLeft: -size/2,
          marginTop: -size/2,
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 15px ${color}`,
          transform: `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`,
          willChange: 'transform',
          transition: 'width 0.2s, height 0.2s',
        }}
      />
      
      {/* Trail elements */}
      {positions.map((pos, index) => (
        <div 
          key={index}
          className="fixed pointer-events-none z-[99998]"
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: size * (1 + index * 0.5),
            height: size * (1 + index * 0.5),
            marginLeft: -(size * (1 + index * 0.5))/2,
            marginTop: -(size * (1 + index * 0.5))/2,
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: `1px solid ${color.replace(/\d+(\.\d+)?\)$/, (trailOpacity / (index + 1)) + ')')}`,
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            opacity: (trailCount - index) / trailCount * trailOpacity,
            transition: `transform ${0.1 * (index + 1)}s ease-out, opacity 0.5s ease-out`,
          }}
        />
      ))}
    </>
  );
};

export default RippleCursor; 