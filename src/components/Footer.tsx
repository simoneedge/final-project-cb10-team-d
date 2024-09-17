import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="relative flex flex-col items-center">
    <div className="w-full bg-white flex flex-col items-center py-6">
      <div className="flex items-center space-x-6">
        <Image
          src="/siclipulse-02.svg"
          alt="SiciliPulse Logo"
          width={200}
          height={200}
        />
        <Link href="/about" className="text-verde hover:text-verde hover:font-bold">
          Chi siamo
        </Link>
      </div>
    </div>

      <div className="w-full border-b-4 border-rosso"></div>
      <div className="bg-giallo flex justify-between items-center w-full py-4 px-4">
        <p className="text-xs text-gray-700 scale-80">
        ©2024 SiciliPulse | Tutti i diritti sono riservati
        </p>
        <div className="flex space-x-3">
          <Image
            src="/instagram.svg"
            alt="Instagram Icon"
            width={20}
            height={20}
            className="cursor-pointer"
            style={{
              filter:
                'invert(20%) sepia(70%) saturate(3000%) hue-rotate(-10deg) brightness(90%) contrast(120%)',
            }}
          />
          <Image
            src="/fb.svg"
            alt="Facebook Icon"
            width={20}
            height={20}
            className="cursor-pointer"
            style={{
              filter:
                'invert(20%) sepia(70%) saturate(3000%) hue-rotate(-10deg) brightness(90%) contrast(120%)',
            }}
          />
          <Image
            src="/youtube.svg"
            alt="YouTube Icon"
            width={20}
            height={20}
            className="cursor-pointer"
            style={{
              filter:
                'invert(20%) sepia(70%) saturate(3000%) hue-rotate(-10deg) brightness(90%) contrast(120%)',
            }}
          />
        </div>
      </div>

    </footer>
  );
};

export default Footer;
