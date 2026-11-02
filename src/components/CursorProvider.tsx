'use client';

import { useEffect, useState } from 'react';
import RippleCursor from './RippleCursor';

// Only mount the decorative cursor for mouse users who haven't asked for reduced motion.
// Touch devices and reduced-motion users skip the per-frame animation entirely.
export default function CursorProvider() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  if (!enabled) return null;

  return (
    <RippleCursor
      size={12}
      color="rgba(0, 180, 255, 0.9)"
      trailOpacity={0.4}
      smoothing={0.15}
    />
  );
}
