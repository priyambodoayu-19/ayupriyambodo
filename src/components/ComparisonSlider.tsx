"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface ComparisonSliderProps {
  beforeLabel: string;
  afterLabel: string;
  beforeImage: string;
  afterImage: string;
  beforeDescription?: string;
  afterDescription?: string;
}

export default function ComparisonSlider({
  beforeLabel,
  afterLabel,
  beforeImage,
  afterImage,
  beforeDescription,
  afterDescription,
}: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    [containerRef]
  );

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div className="space-y-4">
      {/* Slider Viewport */}
      <div
        ref={containerRef}
        className="relative w-full aspect-16/9 rounded-xl overflow-hidden border border-[#E5E2DA] select-none cursor-ew-resize bg-[#141413]"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* "After" Image (Right / Bottom layer) */}
        <div className="absolute inset-0">
          <Image
            src={afterImage}
            alt={afterLabel}
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded bg-[#141413]/80 backdrop-blur-md text-[11px] font-mono text-[#FAF9F5] border border-white/10">
            {afterLabel}
          </div>
        </div>

        {/* "Before" Image (Left / Cropped Top layer) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="relative w-full h-full min-w-full">
            <Image
              src={beforeImage}
              alt={beforeLabel}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded bg-[#FAF9F5]/90 backdrop-blur-md text-[11px] font-mono text-[#141413] border border-black/10">
            {beforeLabel}
          </div>
        </div>

        {/* Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#FAF9F5] shadow-lg pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FAF9F5] text-[#141413] border border-[#DDD9CE] shadow-md flex items-center justify-center text-xs font-mono font-bold">
            ↔
          </div>
        </div>
      </div>

      {/* Explanatory Description Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="p-5 rounded-lg bg-[#F4F2EC] border border-[#E5E2DA]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881] block mb-1">
            {beforeLabel}
          </span>
          <p className="text-xs sm:text-sm text-[#5A5852] leading-relaxed">
            {beforeDescription}
          </p>
        </div>
        <div className="p-5 rounded-lg bg-[#F4F2EC] border border-[#E5E2DA]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881] block mb-1">
            {afterLabel}
          </span>
          <p className="text-xs sm:text-sm text-[#5A5852] leading-relaxed">
            {afterDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
