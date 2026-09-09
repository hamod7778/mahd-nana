'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Slide {
  id: string | number;
  image: string;
  badge?: string | null;
  title?: string;
  subtitle?: string | null;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80',
    title: '',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1000&q=80',
    title: '',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80',
    title: '',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
    title: '',
  },
];

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch dynamic banners from API
  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch('/api/banners');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setSlides(data);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic banners:', err);
      }
    }
    fetchBanners();
  }, []);

  // Auto-play interval
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) return null;

  return (
    <div className="relative flex justify-center w-full my-2">
      {/* Soft Glow Frame Behind Slider */}
      <div className="absolute -inset-3 bg-gradient-to-tr from-rose-300/30 via-pink-200/30 to-amber-200/30 rounded-[3rem] blur-xl opacity-70 pointer-events-none" />
      
      {/* Outer Clean Card Container */}
      <div className="relative w-full max-w-xl lg:max-w-2xl aspect-[4/3] sm:aspect-[16/11] min-h-[340px] sm:min-h-[420px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group bg-white">
        
        {/* Slides Images - Pure Clean Image Display Without Any Dark Overlay */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title || 'بنر المتجر'}
                className="w-full h-full object-cover transform scale-100 group-hover:scale-102 transition duration-700"
              />
            </div>
          );
        })}

        {/* Clean Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 border border-slate-200/60"
            >
              <ChevronRight className="w-5 h-5 text-slate-800" />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 border border-slate-200/60"
            >
              <ChevronLeft className="w-5 h-5 text-slate-800" />
            </button>

            {/* Bottom Clean Dots Indicator */}
            <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center items-center">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/70 shadow-md">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      idx === currentSlide
                        ? 'w-6 bg-rose-500 shadow-sm'
                        : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
