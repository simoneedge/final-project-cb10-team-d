
'use client';

import { useEffect, useState } from 'react';
import Button from '@/src/components/Button';
import Card from '@/src/components/Card';
import ScrollToTopButton from '@/src/components/ScrollToTopButton';
import NavBar from '@/src/components/NavBar';
import { IEvent } from './(models)/Event';
import Link from 'next/link';
import ArrowButton from '@/src/components/ArrowButton';

const getData = async (): Promise<{ events: IEvent[] }> => {
  try {
    const res = await fetch('http://localhost:3000/api/events', { cache: 'no-cache' });
    const data = await res.json();
    return data;
  } catch (error: any) {
    throw Error(error.message);
  }
};

const HomePage = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setEvents(data.events);
        console.log(data);
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gray-100 relative">
      {/* <NavBar /> */}
      <main className="flex flex-col items-center justify-center flex-grow space-y-4">
        <Button />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {events.length > 0 ? (
          events.map((event, index) => (
            <Card
              key={event._id || index}
              backgroundColor={event.color || '#4E614E'}
              title={event.title || 'Pasta di mandorle'}
              imageSrc={event.image || 'https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg'}
              size={index === 4 ? 'large' : 'small'}
              link={<Link href={`/events/${event._id}`}><ArrowButton /></Link>}
            />
          ))
        ) : (
          <p>Loading events...</p>
        )}
      </main>
      <ScrollToTopButton />
    </div>
  );
};

export default HomePage;
