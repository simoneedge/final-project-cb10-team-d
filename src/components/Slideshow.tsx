import React, { useState, useEffect } from 'react';

interface Slide {
  src: string;
  title: string;
}

interface SlideshowProps {
  images: Slide[];
}

const Slideshow: React.FC<SlideshowProps> = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Cambia slide dopo qualche secondo
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    // Pulizia dell'intervallo quando il componente viene smontato
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
    <div className="relative w-full h-[553px] md:h-[500px] lg:h-[600px] mb-10 font-titolo">
      {/* Slideshow container */}
      {images.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div className="absolute top-0 left-0 text-white text-sm p-2 bg-black bg-opacity-50">
            {index + 1} / {images.length}
          </div>
          <img
            src={slide.src}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full text-center text-white text-xl p-4 bg-black bg-opacity-60">
            {slide.title}
          </div>
        </div>
      ))}

      {/* Next and previous buttons */}
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
