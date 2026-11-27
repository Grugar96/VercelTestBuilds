'use client';
import { useEffect, useRef } from 'react';

// Muted 9:16 loop that only loads and plays while it's on screen.
export default function TeamClip({ clip, label }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { v.muted = true; v.play().catch(() => {}); } else v.pause();
    }, { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video ref={ref} src={`/video/team/${clip}.mp4`} poster={`/video/team/${clip}.jpg`} muted loop playsInline preload="none" aria-label={label} />
  );
}
