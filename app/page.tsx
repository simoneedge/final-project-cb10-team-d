'use client';
import { getDayOfYear } from '@/data/getDayOfYear';
import { useEffect, useState } from 'react';
import Button from '@/src/components/Button';
import Card from '@/src/components/Card';
import ScrollToTopButton from '@/src/components/ScrollToTopButton';
import { IEvent } from './(models)/Event';
import Link from 'next/link';
import ArrowButton from '@/src/components/ArrowButton';
import Filter from '@/src/components/Filter';
import { formattedDate } from '@/data/formattDate';

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
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); // Stato per l'input di ricerca
  const [isFree, setIsFree] = useState(false); // Cambiato da stringa a booleano
  const [today, setToday] = useState<number>(0);
  const [startNextWeek, setStartNextWeek] = useState<number | undefined>(undefined);
  const [endNextWeek, setEndNextWeek] = useState<number | undefined>(undefined);

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

  const handleTodayClick = () => {
    const date = formattedDate();
    const dayOfYear = getDayOfYear(date);
    setToday(dayOfYear);
    applyFilters(searchQuery, isFree, dayOfYear);
  }

  const handleTomorrowClick = () => {
    const date = formattedDate(1);
    const dayOfYear = getDayOfYear(date);
    setToday(dayOfYear);
    applyFilters(searchQuery, isFree, dayOfYear);
  }

  const handleNextWeekClick = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilNextMonday = (8 - dayOfWeek) % 7; // Calcola i giorni mancanti fino al prossimo Lunedì
    const nextMonday = getDayOfYear(formattedDate()) + daysUntilNextMonday;
    const nextSunday = nextMonday + 6
    setStartNextWeek(nextMonday);
    setEndNextWeek(nextSunday);

    applyFilters(searchQuery, isFree, 0, nextMonday, nextSunday);
  };
  const applyFilters = (query: string, isFree: boolean, dayOfYear: number, startNextWeek?: number, endNextWeek?: number) => {
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

    // Filtro per eventi del giorno specifico
    if (dayOfYear) {
      filtered = filtered.filter(event => {
        const startEvent = event.dateStart ? getDayOfYear(event.dateStart) : -1;
        const endEvent = event.dateEnd ? getDayOfYear(event.dateEnd) : -1;

        return dayOfYear >= startEvent && dayOfYear <= endEvent;
      });
    }

    // Filtro per la settimana prossima
    if (startNextWeek !== undefined && endNextWeek !== undefined) {
      filtered = filtered.filter(event => {
        const startEvent = event.dateStart ? getDayOfYear(event.dateStart) : -1;
        const endEvent = event.dateEnd ? getDayOfYear(event.dateEnd) : -1;
        return startEvent <= endNextWeek && endEvent >= startNextWeek;
      });
    }

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    applyFilters(searchQuery, isFree, today, startNextWeek, endNextWeek); // Applica i filtri ogni volta che cambia isFree o searchQuery
  }, [events, searchQuery, isFree, today, startNextWeek, endNextWeek]);

  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gray-100 relative text-verde">
      <Filter
        onSearch={handleSearch}
        isFree={isFree}
        setIsFree={setIsFree}
        onTodayClick={handleTodayClick}
        onTomorrowClick={handleTomorrowClick}
        onNextWeekClick={handleNextWeekClick}

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
              size={(index + 1) % 4 === 0 ? 'large' : 'small'} // Ogni quinta card diventa large

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