import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className=" relative ">
      <div className="w-full border border-rosso"></div>
      <div className="w-full bg-white  py-6">
        <div className=" space-x-1">
          <Image
            src="/siclipulse-02.svg"
            alt="SiciliPulse Logo"
            width={200}
            height={50}
            className="my-4"
          />
        </div>
      </div>

      <div className="w-full border-b-4 border-rosso"></div>
      <div className="bg-giallo w-full   ">
        <p className=" text-gray-700 ">
          ©2024 SicilyPulse | Tutti i diritti sono riservati
        </p>

        <div className=" ">
          <Image
            src="/instagram.svg"
            alt="Instagram Icon"
            width={30}
            height={30}
            className="cursor-pointer"
            style={{
              filter:
                'invert(11%) sepia(82%) saturate(748%) hue-rotate(-10deg) brightness(60%) contrast(140%)',
            }}
          />
          <Image
            src="/fb.svg"
            alt="Facebook Icon"
            width={30}
            height={30}
            className="cursor-pointer"
            style={{
              filter:
                'invert(11%) sepia(82%) saturate(748%) hue-rotate(-10deg) brightness(60%) contrast(140%)',
            }}
          />
          <Image
            src="/youtube.svg"
            alt="YouTube Icon"
            width={30}
            height={30}
            className="cursor-pointer"
            style={{
              filter:
                'invert(11%) sepia(82%) saturate(748%) hue-rotate(-10deg) brightness(60%) contrast(140%)',
            }}
          />
        </div>
      </div>

    </footer>
  );
};

export default Footer;
