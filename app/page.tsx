'use client';

import { useEffect, useState } from 'react';
import Button from '@/src/components/Button';
import Card from '@/src/components/Card';
import ScrollToTopButton from '@/src/components/ScrollToTopButton';
import { IEvent } from './(models)/Event';
import Link from 'next/link';
import ArrowButton from '@/src/components/ArrowButton';
import Search from '@/src/components/Search'; // Importa il componente Search
import SwitchBox from '@/src/components/SwitchBox';

const getData = async (): Promise<{ events: IEvent[] }> => {
  try {
    const res = await fetch('http://localhost:3000/api/events', { cache: 'no-cache' });
    const data = await res.json();
    return data;
  } catch (error: any) {
    throw Error(error.message);
  }
};

// 10-05-24
// 65 number

const getDayOfYear = (dateStr: string): number => {
  // Parsing della stringa data
  const [day, month, year] = dateStr.split('-').map(Number);

  // Crea una data a partire dall'anno, mese e giorno (l'anno è completo, per esempio 2024)
  const date = new Date(year, month - 1, day); // JavaScript usa 0-based per i mesi

  // Calcola il giorno dell'anno
  const start = new Date(date.getFullYear(), 0, 0); // Inizio dell'anno
  const diff = date.getTime() - start.getTime(); // Differenza in millisecondi
  const oneDay = 1000 * 60 * 60 * 24; // Millisecondi in un giorno
  const dayOfYear = Math.floor(diff / oneDay);

  return dayOfYear;
};

console.log(getDayOfYear('13-09-2024'));

const HomePage = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); // Stato per l'input di ricerca
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFree, setIsFree] = useState(false); // Cambiato da stringa a booleano
  const [today, setToday] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setEvents(data.events);
        setFilteredEvents(data.events); // Inizialmente mostra tutti gli eventi
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, isFree, today);
  };

  const handleClick = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDate = day + '-' + month + '-' + year;
    const dayOfYear = getDayOfYear(formattedDate);
    // 256
    setToday(dayOfYear);
    applyFilters(searchQuery, isFree, dayOfYear);
    console.log(dayOfYear)

  }

  const applyFilters = (query: string, isFree: boolean, dayOfYear: number) => {
    let filtered = events;

    // Filtro per la ricerca
    if (query !== '') {
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(query.toLowerCase()) || // Filtro per titolo
        event.location?.toLowerCase().includes(query.toLowerCase()) || // Filtro per location
        event.tag?.some(tag => tag.toLowerCase().includes(query.toLowerCase())) // Filtro per tag
      );
    }

    // Filtro per eventi gratuiti/a pagamento
    if (isFree) {
      filtered = filtered.filter(event => event.price === '0'); // Solo eventi gratuiti
    } else if (!isFree) {
      filtered = filtered.filter(event => event.price !== '0'); // Solo eventi a pagamento
    }
    // Filtro per la data odierna
    // Filtro per la data odierna
    if (dayOfYear) {
      filtered = filtered.filter(event => {
        const startDayOfYear = event.dateStart ? getDayOfYear(event.dateStart) : -1;
        const endDayOfYear = event.dateEnd ? getDayOfYear(event.dateEnd) : -1;

        console.log('startDayOfYear:', startDayOfYear);
        console.log('endDayOfYear:', endDayOfYear);
        console.log('dayOfYear:', dayOfYear);

        // Applica il filtro solo se ci sono date valide
        return (
          (dayOfYear >= startDayOfYear) &&
          (dayOfYear <= endDayOfYear)
        );
      });
    }

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    applyFilters(searchQuery, isFree, today); // Applica i filtri ogni volta che cambia isFree o searchQuery
  }, [events, searchQuery, isFree]);

  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gray-100 relative text-verde">
      <Search onSearch={handleSearch} /> {/* Passa la funzione handleSearch */}
      <SwitchBox
        label={'Gratis'}
        value={isFree}
        setValue={setIsFree} // Aggiorna lo stato booleano isFree
      />
      <Button
        label={'oggi'}
        onClick={handleClick}
      />
      <main className="flex flex-col items-center justify-center flex-grow space-y-4 text-verde">
      <Button />
  {errorMessage && <p className="text-red-500">{errorMessage}</p>}
  {filteredEvents.length > 0 ? (
    filteredEvents.map((event, index) => (
      <Card
        key={event._id || index}
        backgroundColor={event.color || '#4E614E'}
        title={event.title || 'Pasta di mandorle'}
        imageSrc={event.image || 'https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg'}
        size={(index + 1) % 5 === 0 ? 'large' : 'small'} // Ogni quinta card diventa large
        link={<Link href={`/events/${event._id}`}><ArrowButton /></Link>}
      />
    ))
  ) : (
    <p>No events found...</p> // Messaggio se non ci sono eventi corrispondenti
  )}
</main>
      <ScrollToTopButton />
    </div>
  );
};

export default HomePage;