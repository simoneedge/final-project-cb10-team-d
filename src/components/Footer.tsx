import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="relative flex flex-col items-center">
      <div className="w-full bg-white flex flex-col items-center py-6">
        <Image
          src="/siclipulse-02.svg" 
          alt="SiciliPulse Logo"
          width={100} 
          height={100}
        />
      </div>
      
      <div className="w-full border-b-4 border-rosso"></div>
      <div className="bg-giallo flex justify-between items-center w-full py-4 px-4">
        <p className="text-xs text-gray-700 scale-80 ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <div className="flex space-x-3">
          <Image
            src="/instagram.svg"  
            alt="Instagram Icon"
            width={20}
            height={20}
            className="cursor-pointer"
            style={{ filter: 'invert(20%) sepia(60%) saturate(2000%) hue-rotate(0deg) brightness(90%) contrast(110%)' }}
          />
          <Image
            src="/fb.svg" 
            alt="Facebook Icon"
            width={20}
            height={20}
            className="cursor-pointer"
            style={{ filter: 'invert(20%) sepia(60%) saturate(2000%) hue-rotate(0deg) brightness(90%) contrast(110%)' }} 
          />
          <Image
            src="/youtube.svg" 
            alt="YouTube Icon"
            width={20}
            height={20}
            className="cursor-pointer"
            style={{ filter: 'invert(20%) sepia(60%) saturate(2000%) hue-rotate(0deg) brightness(90%) contrast(110%)' }} 
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;