'use client';

import React, { useEffect, useRef, useState } from 'react';

interface PastelHero3DProps {
  /** Optional external mouse position normalized from -1 to 1 across the parent hero section */
  pointerOffset?: { x: number; y: number };
}

export default function PastelHero3D({ pointerOffset }: PastelHero3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Sync external pointer offset from Hero section
  useEffect(() => {
    if (pointerOffset) {
      targetRef.current = {
        x: Math.max(-1, Math.min(1, pointerOffset.x)),
        y: Math.max(-1, Math.min(1, pointerOffset.y)),
      };
    }
  }, [pointerOffset]);

  // Smooth spring-like lerp animation loop
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    let time = 0;
    const animate = () => {
      time += 0.025;
      // Gentle idle breathing blended with smooth cursor tracking
      const idleX = Math.sin(time * 0.8) * 0.12;
      const idleY = Math.cos(time * 0.65) * 0.12;

      const goalX = targetRef.current.x + idleX;
      const goalY = targetRef.current.y + idleY;

      currentRef.current.x += (goalX - currentRef.current.x) * 0.075;
      currentRef.current.y += (goalY - currentRef.current.y) * 0.075;

      setTilt({
        x: currentRef.current.x,
        y: currentRef.current.y,
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Fallback local mouse handler if used standalone
  const handleLocalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (pointerOffset || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    targetRef.current = { x: nx, y: ny };
  };

  const handleLocalMouseLeave = () => {
    if (pointerOffset) return;
    targetRef.current = { x: 0, y: 0 };
  };

  const rotateY = tilt.x * 22;
  const rotateX = -tilt.y * 20;
  const shiftX = tilt.x * 10;
  const shiftY = tilt.y * 10;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleLocalMouseMove}
      onMouseLeave={handleLocalMouseLeave}
      aria-hidden="true"
      className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 select-none flex items-center justify-center"
      style={{ perspective: '900px' }}
    >
      {/* Ambient Pastel Aura Behind 3D Object */}
      <div
        className="absolute inset-2 rounded-full blur-2xl opacity-75 pointer-events-none transition-transform duration-300"
        style={{
          background:
            'radial-gradient(circle at 35% 35%, rgba(186,230,253,0.75), rgba(254,205,211,0.65), rgba(245,230,211,0.65))',
          transform: `translate3d(${-shiftX * 0.8}px, ${-shiftY * 0.8}px, 0)`,
        }}
      />

      {/* Main 3D Stage */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${shiftX * 0.4}px, ${shiftY * 0.4}px, 0)`,
          willChange: 'transform',
        }}
      >
        {/* Soft Ground Contact Shadow */}
        <div
          className="absolute bottom-2 w-24 h-5 rounded-full blur-md opacity-45 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(148,163,184,0.45) 0%, transparent 75%)',
            transform: `translateZ(-30px) translateX(${-shiftX * 0.9}px) scale(${1 - Math.abs(tilt.y) * 0.08})`,
          }}
        />

        {/* Back Layer: Soft Beige 3D Rounded Cushion / Base Block */}
        <div
          className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem]"
          style={{
            transform: `translateZ(-12px) rotate(-10deg) translate3d(${-shiftX * 0.35}px, ${-shiftY * 0.35}px, 0)`,
            background:
              'radial-gradient(circle at 30% 25%, #FFF9F2 0%, #F5E6D3 45%, #E4C9AA 88%, #D4B28E 100%)',
            boxShadow:
              'inset -6px -8px 16px rgba(180, 140, 100, 0.25), inset 6px 6px 14px rgba(255, 255, 255, 0.9), 0 18px 30px -10px rgba(180, 140, 105, 0.3)',
          }}
        />

        {/* Mid Layer: Pastel Sky Blue 3D Ring / Halo */}
        <div
          className="absolute w-32 h-32 sm:w-36 sm:h-36 pointer-events-none"
          style={{
            transform: `translateZ(18px) rotateX(62deg) rotateY(-18deg) translate3d(${shiftX * 0.4}px, ${shiftY * 0.4}px, 0)`,
            filter: 'drop-shadow(0 10px 16px rgba(125, 211, 252, 0.45))',
          }}
        >
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <defs>
              <linearGradient id="skyPastelRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0F9FF" />
                <stop offset="45%" stopColor="#BAE6FD" />
                <stop offset="100%" stopColor="#7DD3FC" />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="url(#skyPastelRing)"
              strokeWidth="12"
            />
            <path
              d="M 24 44 A 46 46 0 0 1 88 24"
              fill="none"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Centerpiece: Soft Pastel Pink 3D Clay Sphere (Baby Pearl) */}
        <div
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
          style={{
            transform: `translateZ(34px) translate3d(${shiftX * 0.55}px, ${shiftY * 0.55}px, 0)`,
            background:
              'radial-gradient(circle at 32% 28%, #FFF5F7 0%, #FECDD3 38%, #FDA4AF 78%, #F472B6 100%)',
            boxShadow:
              'inset -6px -8px 16px rgba(225, 29, 72, 0.22), inset 5px 5px 14px rgba(255, 255, 255, 0.92), 0 16px 28px -8px rgba(244, 63, 94, 0.32)',
          }}
        >
          {/* Specular Gloss Highlight tracking cursor */}
          <div
            className="absolute w-5 h-3.5 sm:w-6 sm:h-4 rounded-full bg-white/80 blur-[1px]"
            style={{
              top: `${18 - tilt.y * 5}%`,
              left: `${22 + tilt.x * 6}%`,
              transform: 'rotate(-28deg)',
            }}
          />
          {/* Subtle cute baby heart/star embossing inside the clay orb */}
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-sm opacity-90"
            fill="none"
          >
            <path
              d="M12 20.2C12 20.2 4.5 15.1 4.5 9.6C4.5 7.1 6.4 5.2 8.7 5.2C10.2 5.2 11.4 6 12 7.1C12.6 6 13.8 5.2 15.3 5.2C17.6 5.2 19.5 7.1 19.5 9.6C19.5 15.1 12 20.2 12 20.2Z"
              fill="rgba(255,255,255,0.72)"
            />
          </svg>
        </div>

        {/* Top-Right Floating Orb: Sky Blue Pastel Sphere */}
        <div
          className="absolute -top-0.5 right-1 sm:right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full"
          style={{
            transform: `translateZ(54px) translate3d(${shiftX * 0.95}px, ${shiftY * 0.95}px, 0)`,
            background:
              'radial-gradient(circle at 30% 25%, #F0F9FF 0%, #BAE6FD 45%, #7DD3FC 85%, #38BDF8 100%)',
            boxShadow:
              'inset -3px -4px 8px rgba(14, 165, 233, 0.28), inset 3px 3px 6px rgba(255, 255, 255, 0.95), 0 10px 18px -5px rgba(56, 189, 248, 0.4)',
          }}
        >
          <div className="absolute top-1.5 left-2 w-2.5 h-1.5 rounded-full bg-white/85 -rotate-25" />
        </div>

        {/* Bottom-Left Floating Orb: Warm Beige Pastel Pill/Sphere */}
        <div
          className="absolute bottom-1 left-1 sm:left-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full"
          style={{
            transform: `translateZ(48px) translate3d(${shiftX * 0.85}px, ${shiftY * 0.85}px, 0)`,
            background:
              'radial-gradient(circle at 30% 28%, #FFFDF9 0%, #F5E6D3 50%, #E2C3A1 92%)',
            boxShadow:
              'inset -3px -3px 7px rgba(168, 128, 88, 0.25), inset 3px 3px 6px rgba(255, 255, 255, 0.95), 0 10px 16px -4px rgba(190, 150, 110, 0.35)',
          }}
        >
          <div className="absolute top-1.5 left-1.5 w-2 h-1 rounded-full bg-white/85 -rotate-25" />
        </div>

        {/* Tiny Floating Pastel Pink Pearl */}
        <div
          className="absolute top-4 left-2 sm:left-3 w-4 h-4 sm:w-5 sm:h-5 rounded-full"
          style={{
            transform: `translateZ(64px) translate3d(${shiftX * 1.15}px, ${shiftY * 1.15}px, 0)`,
            background:
              'radial-gradient(circle at 30% 25%, #FFFFFF 0%, #FBCFE8 55%, #F9A8D4 100%)',
            boxShadow:
              'inset 1.5px 1.5px 4px rgba(255,255,255,0.95), 0 6px 12px rgba(244,114,182,0.35)',
          }}
        />
      </div>
    </div>
  );
}
