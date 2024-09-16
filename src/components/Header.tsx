'use client';

import React from 'react';
import Image from 'next/image';
import NavBar from './NavBar';
import Search from './Search';
import { links } from '@/data/nav_link';
import { useMediaQuery } from 'react-responsive';
import Link from 'next/link';

const Header = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <header className="bg-bianco p-0 m-0">
      <div className="container mx-auto flex flex-row md:flex-row justify-between items-center">
        <div className="flex items-center">
          <Link href={'/'}>
            <Image
              src="/siclipulse-02.svg"
              alt="Logo"
              width={200}
              height={50}
            />
          </Link>
        </div>
        <NavBar links={links} />
      </div>
    </header>
  );
};

export default Header;
