"use client";

import { useState } from 'react';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = (item: string) => {
    setActiveItem(item);
    setIsOpen(false); // Chiude il menu mobile
  };

  return (
    <header className="relative bg-bianco p-4">
      {/* Links for larger screens */}
      <div className="hidden md:flex space-x-6">
        <a
          href="#"
          onClick={() => handleClick('cultura')}
          className={`text-verde hover:text-verde hover:font-bold ${activeItem === 'cultura' ? 'font-bold' : ''}`}
        >
          cultura
        </a>
        <a
          href="#"
          onClick={() => handleClick('food')}
          className={`text-verde hover:text-verde hover:font-bold ${activeItem === 'food' ? 'font-bold' : ''}`}
        >
          food
        </a>
        <a
          href="#"
          onClick={() => handleClick('attività')}
          className={`text-verde hover:text-verde hover:font-bold ${activeItem === 'attività' ? 'font-bold' : ''}`}
        >
          attività
        </a>
        <a
          href="#"
          onClick={() => handleClick('proponi evento')}
          className={`text-verde hover:text-verde hover:font-bold ${activeItem === 'proponi evento' ? 'font-bold' : ''}`}
        >
          proponi evento
        </a>
      </div>

      {/* Hamburger Menu */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="text-verde focus:outline-none">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              // Icona "X" quando il menu è aperto
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              // Icona hamburger quando il menu è chiuso
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-0 bg-bianco  rounded-none z-50">
          <div className="flex flex-col items-center space-y-1 p-4 text-center">
            <a
              href="#"
              onClick={() => handleClick('cultura')}
              className={`block text-verde hover:text-verde hover:font-bold ${activeItem === 'cultura' ? 'font-bold' : 'font-normal'} py-2`}
            >
              cultura
            </a>
            <a
              href="#"
              onClick={() => handleClick('food')}
              className={`block text-verde hover:text-verde hover:font-bold ${activeItem === 'food' ? 'font-bold' : 'font-normal'} py-2`}
            >
              food
            </a>
            <a
              href="#"
              onClick={() => handleClick('attività')}
              className={`block text-verde hover:text-verde hover:font-bold ${activeItem === 'attività' ? 'font-bold' : 'font-normal'} py-2`}
            >
              attività
            </a>
            <a
              href="#"
              onClick={() => handleClick('proponi evento')}
              className={`block text-verde hover:text-verde hover:font-bold ${activeItem === 'proponi evento' ? 'font-bold' : 'font-normal'} py-2`}
            >
              proponi evento
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
