'use client';

import RippleCursor from './RippleCursor';

export default function CursorProvider() {
  return (
    <RippleCursor 
      size={12}
      color="rgba(0, 180, 255, 0.9)"
      trailOpacity={0.4}
      smoothing={0.15}
    />
  );
} 