import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 

interface Slide {
  src: string;
  title: string;
  link: string; 
}

interface SlideshowProps {
  images: Slide[];
}

const Slideshow = ({ images }:SlideshowProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
 
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide, images.length]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? images.length - 1 : prevSlide - 1
    );

    
  };

  return (
    <div className="relative w-full h-[553px] md:h-[500px] lg:h-[600px] mb-10">
      {images.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div className="absolute top-0 left-0 text-white text-sm p-2 bg-black bg-opacity-50">
            {index + 1} / {images.length}
          </div>

          
          <Link href={slide.link}>
            <img
              src={slide.src}
              alt={slide.title}
              className="w-full h-full object-cover cursor-pointer"
            />
          </Link>

          <div className="absolute bottom-0 left-0 w-full text-center text-white text-xl p-4 bg-black bg-opacity-60">
            {slide.title}
          </div>
        </div>
      ))}

      <button
        className="absolute top-1/2 left-0 transform -translate-y-1/2 p-4 text-white font-bold text-lg bg-black bg-opacity-50 hover:bg-opacity-75 cursor-pointer"
        onClick={prevSlide}
      >
        &#10094;
      </button>
      <button
        className="absolute top-1/2 right-0 transform -translate-y-1/2 p-4 text-white font-bold text-lg bg-black bg-opacity-50 hover:bg-opacity-75 cursor-pointer"
        onClick={nextSlide}
      >
        &#10095;
      </button>
    </div>
  );
};

export default Slideshow;
