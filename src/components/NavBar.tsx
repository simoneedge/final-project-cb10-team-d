"use client";

import { useState } from 'react';
import Link from 'next/link';
import LoginButton from './Login';
import Search from './Search';


interface NavLink {
  name: string;
  href: string;
}

interface NavBarProps {
  links?: NavLink[]; 
}

const NavBar = ({ links = [] }: NavBarProps) => { 
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = (item: string) => {
    setActiveItem(item);
    setIsOpen(false); 
  };

  return (
    <header className="relative bg-bianco p-4">
      <div className="hidden md:flex space-x-6">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => handleClick(link.name)}
            className={`text-verde hover:text-verde hover:font-bold ${
              activeItem === link.name ? 'font-bold' : ''
            }`}
          >
            {link.name}
          </Link>
        ))}
        <LoginButton/>
        <Search/>
      </div>


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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
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

      {/* Menu mobile */}
      {isOpen && (
        
        <div className="absolute top-full left-0 w-full mt-0 bg-bianco rounded-none z-50">
          <div className="flex flex-col items-center space-y-1 p-4 text-center">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => handleClick(link.name)}
                className={`block text-verde hover:text-verde hover:font-bold ${
                  activeItem === link.name ? 'font-bold' : 'font-normal'
                } py-2`}
              >
                {link.name}
              </Link>
            ))}
            <LoginButton/>
            
          </div>
        </div>
        
        
      )}
    </header>
  );
};

export default NavBar;
