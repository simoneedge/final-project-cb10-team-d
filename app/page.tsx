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
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Loading from '@/src/components/Loading';
import Slideshow from '@/src/components/Slideshow';

// Funzione per ottenere i dati degli eventi
const getData = async (): Promise<{ events: IEvent[] }> => {
  try {
    const res = await fetch('http://localhost:3000/api/events', { cache: 'no-cache' });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('Errore durante il recupero dei dati:', error);
    throw Error(error.message);
  }
};

// Funzione per ottenere slides casuali
const getRandomSlides = (items: IEvent[], count: number): IEvent[] => {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  console.log('Shuffled slides:', shuffled);
  return shuffled.slice(0, count);
};

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [today, setToday] = useState<number>(0);
  const [startNextWeek, setStartNextWeek] = useState<number | undefined>(undefined);
  const [endNextWeek, setEndNextWeek] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Gestisce l'autenticazione dell'utente
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ? currentUser : null);
    });

    return () => unsubscribe();
  }, []);

  // Recupera i dati degli eventi all'inizializzazione
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getData();
        setEvents(data.events);
        setFilteredEvents(data.events); // Inizialmente filtra tutti gli eventi
      } catch (error: any) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Gestisce la ricerca
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, isFree, today);
  };

  // Filtra eventi di oggi
  const handleTodayClick = () => {
    const date = formattedDate();
    const dayOfYear = getDayOfYear(date);
    setToday(dayOfYear);
    applyFilters(searchQuery, isFree, dayOfYear);
  };

  // Filtra eventi di domani
  const handleTomorrowClick = () => {
    const date = formattedDate(1);
    const dayOfYear = getDayOfYear(date);
    setToday(dayOfYear);
    applyFilters(searchQuery, isFree, dayOfYear);
  };

  // Filtra eventi della prossima settimana
  const handleNextWeekClick = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilNextMonday = (8 - dayOfWeek) % 7;
    const nextMonday = getDayOfYear(formattedDate()) + daysUntilNextMonday;
    const nextSunday = nextMonday + 6;
    setStartNextWeek(nextMonday);
    setEndNextWeek(nextSunday);
    applyFilters(searchQuery, isFree, 0, nextMonday, nextSunday);
  };

  // Applica i filtri agli eventi
  const applyFilters = (query: string, isFree: boolean, dayOfYear: number, startNextWeek?: number, endNextWeek?: number) => {
    let filtered = events;

    // Filtra per query di ricerca
    if (query !== '') {
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(query.toLowerCase()) ||
        event.location?.toLowerCase().includes(query.toLowerCase()) ||
        event.tag?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Filtra per prezzo
    if (isFree) {
      filtered = filtered.filter(event => event.price === '0');
    } else {
      filtered = filtered.filter(event => event.price !== '0');
    }

    // Filtra per giorno specifico
    if (dayOfYear) {
      filtered = filtered.filter(event => {
        const startEvent = event.dateStart ? getDayOfYear(event.dateStart) : -1;
        const endEvent = event.dateEnd ? getDayOfYear(event.dateEnd) : -1;
        return dayOfYear >= startEvent && dayOfYear <= endEvent;
      });
    }

    // Filtra per intervallo della prossima settimana
    if (startNextWeek !== undefined && endNextWeek !== undefined) {
      filtered = filtered.filter(event => {
        const startEvent = event.dateStart ? getDayOfYear(event.dateStart) : -1;
        const endEvent = event.dateEnd ? getDayOfYear(event.dateEnd) : -1;
        return startEvent <= endNextWeek && endEvent >= startNextWeek;
      });
    }

    setFilteredEvents(filtered);
  };

  // Effetto che applica i filtri ogni volta che cambiano gli stati
  useEffect(() => {
    applyFilters(searchQuery, isFree, today, startNextWeek, endNextWeek);
  }, [events, searchQuery, isFree, today, startNextWeek, endNextWeek]);

  const randomSlides = getRandomSlides(events, 5);
  const slideshowImages = randomSlides.map(event => ({
    src: event.image || 'https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg',
    title: event.title || 'Default Title',
  }));

  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gray-100 relative text-verde">
      <Slideshow images={slideshowImages} />
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

        {loading ? (
          <Loading />
        ) : (
          <div className="card-container grid grid-cols-1 md:grid-cols-3 gap-4 items-start w-full">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <div
                  key={event._id || index}
                  className={`${(index + 1) % 4 === 0 ? 'col-span-3' : 'col-span-1'
                    } w-full md:w-auto flex justify-center`}
                >
                  <Card
                    eventId={event._id}
                    backgroundColor={event.color || '#4E614E'}
                    title={event.title || 'Pasta di mandorle'}
                    imageSrc={
                      event.image ||
                      'https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg'
                    }
                    size={(index + 1) % 4 === 0 ? 'large' : 'small'}
                    link={
                      <Link href={`/events/${event._id}`}>
                        <ArrowButton />
                      </Link>
                    }
                  />
                </div>
              ))
            ) : (
              <p className="justify-items-center">No events found...</p>
            )}
          </div>
        )}
      </main>
      <ScrollToTopButton />
    </div>
  );
};

export default HomePage;
