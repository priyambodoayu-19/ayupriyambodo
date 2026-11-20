"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export interface CarouselSlideItem {
  caption: string;
  subcaption?: string;
  image?: string;
  aspect?: string;
}

export interface CarouselSettings {
  autoplay?: boolean;
  intervalSeconds?: number;
  showArrows?: boolean;
  showDots?: boolean;
}

interface CarouselSliderProps {
  items: CarouselSlideItem[];
  fallbackImage?: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "2.39/1" | string;
  settings?: CarouselSettings;
}

export default function CarouselSlider({
  items,
  fallbackImage = "/placeholder-nidhi-hero.svg",
  aspectRatio = "16/9",
  settings = {},
}: CarouselSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const {
    autoplay = false,
    intervalSeconds = 5,
    showArrows = true,
    showDots = true,
  } = settings;

  const totalSlides = items.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay timer
  useEffect(() => {
    if (!autoplay || isPaused || totalSlides <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, (intervalSeconds || 5) * 1000);

    return () => clearInterval(timer);
  }, [autoplay, isPaused, intervalSeconds, totalSlides]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];

  const aspectClasses: Record<string, string> = {
    "16/9": "aspect-16/9",
    "4/3": "aspect-4/3",
    "1/1": "aspect-square",
    "2.39/1": "aspect-[2.39/1]",
  };

  const aspectClass = aspectClasses[aspectRatio] || "aspect-16/9";

  return (
    <div
      className="space-y-4 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Viewport Frame */}
      <div
        className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden border border-[#E5E2DA] bg-[#141413] shadow-md`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Track */}
        {items.map((item, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={item.image || fallbackImage}
                alt={item.caption || `Slide ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="(max-width: 1400px) 100vw, 1400px"
              />
            </div>
          );
        })}

        {/* Ambient Top Index Badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-[#141413]/70 backdrop-blur-md text-[11px] font-mono text-[#FAF9F5] border border-white/10">
          <span>0{currentIndex + 1}</span>
          <span className="opacity-40">/</span>
          <span className="opacity-60">0{totalSlides}</span>
        </div>

        {/* Autoplay status indicator (if enabled) */}
        {autoplay && (
          <div className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-[#141413]/70 backdrop-blur-md text-[#FAF9F5] border border-white/10">
            {isPaused ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </div>
        )}

        {/* Navigation Arrows */}
        {showArrows && totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#FAF9F5]/90 hover:bg-[#FAF9F5] text-[#141413] border border-[#E5E2DA] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#FAF9F5]/90 hover:bg-[#FAF9F5] text-[#141413] border border-[#E5E2DA] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Information & Dot Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        {/* Caption & Subcaption */}
        <div className="space-y-1 max-w-2xl">
          <h4 className="font-editorial text-lg sm:text-xl text-[#141413] transition-all">
            {currentItem.caption}
          </h4>
          {currentItem.subcaption && (
            <p className="text-xs sm:text-sm text-[#64625C] leading-relaxed">
              {currentItem.subcaption}
            </p>
          )}
        </div>

        {/* Dot Pagination */}
        {showDots && totalSlides > 1 && (
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            {items.map((_, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`transition-all rounded-full cursor-pointer ${
                    isActive
                      ? "w-8 h-2 bg-[#141413]"
                      : "w-2 h-2 bg-[#D5D1C7] hover:bg-[#8A8881]"
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
