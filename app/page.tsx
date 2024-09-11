
import Button from '@/src/components/Button';
import Card from '@/src/components/Card';
import ScrollToTopButton from '@/src/components/ScrollToTopButton';
import React from 'react';
import NavBar from '@/src/components/NavBar';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const links = [
  { name: 'Home', href: '/' },
  { name: 'Cultura', href: '/cultura' },
  { name: 'Food', href: '/food' },
  { name: 'Attività', href: '/attivita' },
  { name: 'Proponi Evento', href: '/events/propose' },
];

const HomePage = () => {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gray-100 relative">
      <NavBar links={links} />
      <main className="flex flex-col items-center justify-center flex-grow space-y-4">
        <Button/>
        <Card backgroundColor="#4E614E" title='Pasta di mandorle' imageSrc='https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg'/>

        <Card backgroundColor="#F2B85A" title='Pasta di mandorle' imageSrc='https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg' />

        <Card backgroundColor="#822225" title='Pasta di mandorle' imageSrc='https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg' />
      </main>

      <ScrollToTopButton />
    </div>
  );
};

export default HomePage;