"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

export default function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState(null);
  const containerRef = useRef(null);

  const goTo = useCallback((index) => {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    setCurrentIndex(index);
  }, [images.length]);

  const handleDragStart = (clientX) => {
    setDragStart(clientX);
  };

  const handleDragEnd = (clientX) => {
    if (dragStart === null) return;
    const diff = dragStart - clientX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goTo(currentIndex + 1);
      } else {
        goTo(currentIndex - 1);
      }
    }
    setDragStart(null);
  };

  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative w-full rounded-xl overflow-hidden">
        <img
          src={images[0]}
          alt="Post image"
          className="w-full aspect-[4/3] object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl cursor-grab active:cursor-grabbing select-none"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseUp={(e) => handleDragEnd(e.clientX)}
        onMouseLeave={() => setDragStart(null)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
      >
        <motion.div
          className="flex"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="w-full flex-shrink-0"
            >
              <img
                src={img}
                alt={`Image ${i + 1}`}
                className="w-full aspect-[4/3] object-cover pointer-events-none"
                draggable={false}
              />
            </div>
          ))}
        </motion.div>

        {/* Contador */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Setas de navegação */}
        <button
          onClick={() => goTo(currentIndex - 1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => goTo(currentIndex + 1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots de navegação */}
      <div className="flex justify-center gap-2 mt-3">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "bg-[#3b82f6] w-6"
                : "bg-gray-600 hover:bg-gray-500 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
