import React, { useState, useEffect } from 'react';

interface Slide {
  src: string;
  caption: string;
}

const Slideshow: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Recupera i dati delle slide dal backend
  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/slides'); 
      const data = await response.json();
      console.log(data);
      setSlides(data.slides);
    } catch (error) {
      console.error('Error fetching slides:', error);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    fetchSlides();

    // Timer per cambiare slide automaticamente
    const slideInterval = setInterval(nextSlide, 3000);

    // Pulizia del timer quando il componente viene smontato
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="relative w-full h-[600px] mb-10">
      {/* Slideshow container */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`mySlides fade ${
            index === currentSlide ? 'block' : 'hidden'
          } w-full h-full relative`}
        >
          <div className="numbertext absolute top-0 left-0 text-white text-sm p-2">
            {index + 1} / {slides.length}
          </div>
          <img src={slide.src} alt={slide.caption} className="w-full h-full object-cover" />
          <div className="text absolute bottom-0 left-0 w-full text-center text-white text-sm p-2 bg-black bg-opacity-50">
            {slide.caption}
          </div>
        </div>
      ))}

      {/* Next and previous buttons */}
      <a
        className="prev absolute top-1/2 left-0 transform -translate-y-1/2 p-4 text-white font-bold text-lg bg-black bg-opacity-50 hover:bg-opacity-75 cursor-pointer"
        onClick={prevSlide}
      >
        &#10094;
      </a>
      <a
        className="next absolute top-1/2 right-0 transform -translate-y-1/2 p-4 text-white font-bold text-lg bg-black bg-opacity-50 hover:bg-opacity-75 cursor-pointer"
        onClick={nextSlide}
      >
        &#10095;
      </a>

      {/* Dots */}
      <div className="text-center mt-4">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot h-4 w-4 rounded-full inline-block mx-1 cursor-pointer ${
              index === currentSlide ? 'bg-gray-700' : 'bg-gray-400'
            }`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;


// import React, { useState, useEffect } from 'react';

// interface Slide {
//   src: string;
//   caption: string;
// }

// const Slideshow: React.FC = () => {
//   const [slides, setSlides] = useState<Slide[]>([]);
//   const [currentSlide, setCurrentSlide] = useState(0);

//   // recuperare i dati dal backend
//   const fetchSlides = async () => {
//     try {
//       const response = await fetch('/api/slides'); 
//       const data: Slide[] = await response.json();
//       setSlides(data);
//     } catch (error) {
//       console.error('Error fetching slides:', error);
//     }
//   };

//   const nextSlide = () => {
//     setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1));
//   };

//   const goToSlide = (index: number) => {
//     setCurrentSlide(index);
//   };

//   useEffect(() => {
//     fetchSlides();

//     // timer per cambiare slide automaticamente 
//     const slideInterval = setInterval(nextSlide, 3000);

//     // Pulizia del timer quando il componente viene smontato
//     return () => clearInterval(slideInterval);
//   }, []);

//   return (
//     <div className="relative w-full h-[600px] mb-10">
//       {/* Slideshow container */}
//       {slides.map((slide, index) => (
//         <div
//           key={index}
//           className={`mySlides fade ${
//             index === currentSlide ? 'block' : 'hidden'
//           } w-full h-full relative`}
//         >
//           <div className="numbertext absolute top-0 left-0 text-white text-sm p-2">
//             {index + 1} / {slides.length}
//           </div>
//           <img src={slide.src} alt={slide.caption} className="w-full h-full object-cover" />
//           <div className="text absolute bottom-0 left-0 w-full text-center text-white text-sm p-2 bg-black bg-opacity-50">
//             {slide.caption}
//           </div>
//         </div>
//       ))}

//       {/* Next and previous buttons */}
//       <a
//         className="prev absolute top-1/2 left-0 transform -translate-y-1/2 p-4 text-white font-bold text-lg bg-black bg-opacity-50 hover:bg-opacity-75 cursor-pointer"
//         onClick={prevSlide}
//       >
//         &#10094;
//       </a>
//       <a
//         className="next absolute top-1/2 right-0 transform -translate-y-1/2 p-4 text-white font-bold text-lg bg-black bg-opacity-50 hover:bg-opacity-75 cursor-pointer"
//         onClick={nextSlide}
//       >
//         &#10095;
//       </a>

//       {/* Dots */}
//       <div className="text-center mt-4">
//         {slides.map((_, index) => (
//           <span
//             key={index}
//             className={`dot h-4 w-4 rounded-full inline-block mx-1 cursor-pointer ${
//               index === currentSlide ? 'bg-gray-700' : 'bg-gray-400'
//             }`}
//             onClick={() => goToSlide(index)}
//           ></span>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Slideshow;
