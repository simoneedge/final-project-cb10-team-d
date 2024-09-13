"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '@/firebaseConfig'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
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
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = (item: string) => {
    setActiveItem(item);
    setIsOpen(false);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUserEmail(null);
    });
  };

  return (
    <header className="relative bg-bianco p-4">
      <div className="hidden md:flex space-x-6 items-center">
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
        {userEmail ? (
  <>
    <Link href="/profile">
      <div className="flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full cursor-pointer">
        {userEmail.charAt(0).toUpperCase()}
      </div>
    </Link>
    <button onClick={handleLogout} className="text-verde ml-2">
      LOGOUT
    </button>
  </>
) : (
  <LoginButton />
)}
        <Search />
      </div>

      {/* Mobile Menu Toggle */}
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

      {/* Mobile Menu */}
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
            {userEmail ? (
              <>
                <div className="flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="text-verde">
                  LOGOUT
                </button>
              </>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
