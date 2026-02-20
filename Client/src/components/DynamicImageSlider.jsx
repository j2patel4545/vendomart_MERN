// DynamicImageSlider.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const BASE_URL = "http://localhost:9999";

const DynamicImageSlider = ({ images = [], interval = 3000, className }) => {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const slider = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(slider);
  }, [images.length, interval]);

  if (!images || images.length === 0) return null;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className={`relative w-full h-64 md:h-96 overflow-hidden ${className}`}>
      {/* Images */}
      <AnimatePresence>
        {images.map((img, index) =>
          index === current ? (
            <motion.img
              key={index}
              src={`${BASE_URL}${img.slider_image}`}
              alt={`slide-${index}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-cover absolute top-0 left-0"
            />
          ) : null
        )}
      </AnimatePresence>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 z-10"
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 z-10"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${
              index === current ? "bg-blue-500" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DynamicImageSlider;
