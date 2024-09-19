"use client";
import { getDayOfYear } from "@/data/getDayOfYear";
import { useEffect, useState } from "react";
import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import ScrollToTopButton from "@/src/components/ScrollToTopButton";
import { IEvent } from "./(models)/Event";
import Link from "next/link";
import ArrowButton from "@/src/components/ArrowButton";
import Filter from "@/src/components/Filter";
import { formattedDate } from "@/data/formattDate";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loading from "@/src/components/Loading";
import Slideshow from "@/src/components/Slideshow";
import { User } from "firebase/auth";

const getData = async (
  page: number,
  limit: number
): Promise<{ events: IEvent[]; totalPages: number }> => {
  try {
    const res = await fetch(`/api/events?page=${page}&limit=${limit}`, {
      cache: "no-cache",
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching data:", error.message);
      throw Error(error.message);
    } else {
      throw Error("Unknown error occurred");
    }
  }
};

const getRandomSlides = (items: IEvent[], count: number): IEvent[] => {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFree, setIsFree] = useState<boolean>(false);
  const [today, setToday] = useState<number>(0);
  const [startNextWeek, setStartNextWeek] = useState<number | undefined>(
    undefined
  );
  const [endNextWeek, setEndNextWeek] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [slideshowImages, setSlideshowImages] = useState<
    { src: string; title: string }[]
  >([]);
  const [favoriteEventTitle, setFavoriteEventTitle] = useState<string[]>([]);

  // Stato per la paginazione
  const [currentPage, setCurrentPage] = useState<number>(1); // Pagina corrente
  const [totalPages, setTotalPages] = useState<number>(1); // Numero di pagine totali
  const limit = 12; // Numero di eventi per pagina

  // Funzione per recuperare i preferiti dell'utente
  const fetchFavorites = async (email: string | null) => {
    try {
      const response = await fetch(`/api/profiles?email=${email}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const favoriteTitle = data.profile.events.map(
        (event: { title: string }) => event.title
      );
      setFavoriteEventTitle(favoriteTitle);
    } catch (error) {
      console.error("Errore nel recupero dei preferiti:", error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      if (currentUser) {
        setUser(currentUser);
        console.log(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getData(currentPage, limit);
        setEvents(data.events);
        setFilteredEvents(data.events);
        setTotalPages(data.totalPages);

        // Recupera i preferiti se l'utente è autenticato
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const userEmail = user.email;
          await fetchFavorites(userEmail);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage("Failed to load data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const randomSlides = getRandomSlides(events, 5);
    const images = randomSlides.map((event) => ({
      src:
        event.image || "https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg",
      title: event.title || "Default Title",
    }));
    setSlideshowImages(images);
  }, [events]); // Solo quando 'events' cambia

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, isFree, today);
  };

  const handleTodayClick = () => {
    const date = formattedDate();
    const dayOfYear = getDayOfYear(date);
    setToday(dayOfYear);
    applyFilters(searchQuery, isFree, dayOfYear);
  };

  const handleTomorrowClick = () => {
    const date = formattedDate(1);
    const dayOfYear = getDayOfYear(date);
    setToday(dayOfYear);
    applyFilters(searchQuery, isFree, dayOfYear);
  };

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

  const applyFilters = (
    query: string,
    isFree: boolean,
    dayOfYear: number,
    startNextWeek?: number,
    endNextWeek?: number
  ) => {
    let filtered = events;

    if (query !== "") {
      filtered = filtered.filter(
        (event) =>
          event.title?.toLowerCase().includes(query.toLowerCase()) ||
          event.location?.toLowerCase().includes(query.toLowerCase()) ||
          event.tag?.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          )
      );
    }

    if (isFree) {
      filtered = filtered.filter((event) => event.price === "0");
    } else if (!isFree) {
      filtered = filtered.filter((event) => event.price !== "0");
    }

    if (dayOfYear) {
      filtered = filtered.filter((event) => {
        const startEvent = event.dateStart ? getDayOfYear(event.dateStart) : -1;
        const endEvent = event.dateEnd ? getDayOfYear(event.dateEnd) : -1;

        return dayOfYear >= startEvent && dayOfYear <= endEvent;
      });
    }

    if (startNextWeek !== undefined && endNextWeek !== undefined) {
      filtered = filtered.filter((event) => {
        const startEvent = event.dateStart ? getDayOfYear(event.dateStart) : -1;
        const endEvent = event.dateEnd ? getDayOfYear(event.dateEnd) : -1;
        return startEvent <= endNextWeek && endEvent >= startNextWeek;
      });
    }

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    applyFilters(searchQuery, isFree, today, startNextWeek, endNextWeek);
  }, [events, searchQuery, isFree, today, startNextWeek, endNextWeek]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  /*   const randomSlides = getRandomSlides(events, 5);
    const slideshowImages = randomSlides.map(event => ({
      src: event.image || 'https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg',
      title: event.title || 'Default Title',
    })); */

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
          <Loading /> // Mostra l'animazione di caricamento
        ) : (
          <div className="card-container grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 items-start w-full">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <div
                  key={event._id || index}
                  className={`${(index + 1) % 4 === 0 ? "col-span-3" : "col-span-1"
                    } w-full md:w-auto flex justify-center transform hover:scale-105 transition-transform duration-300 custom-shadow`} // Mantieni 'flex justify-center' qui
                >
                  <Card
                    isLiked={
                      event.title
                        ? favoriteEventTitle.includes(event.title)
                        : false
                    }
                    eventId={event._id}
                    backgroundColor={event.color || "#4E614E"}
                    title={event.title || "Pasta di mandorle"}
                    imageSrc={
                      event.image ||
                      "https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
                    }
                    size={(index + 1) % 4 === 0 ? "large" : "small"}
                    onHeartClick={() =>
                      fetchFavorites(getAuth().currentUser?.email || "")
                    }
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
      {/* Controlli di paginazione */}

      <div className="pagination-controls flex justify-center m-10">
        <Button
          onClick={handlePreviousPage}
          label="Previous"
          className="flex items-center justify-center ml-4 w-28 px-4 py-2 text-center border-2 border-rosso text-rosso bg-bianco hover:bg-rosso hover:text-bianco font-bold disabled:bg-gray-300  disabled:opacity-50"
          disabled={currentPage === 1}
        />
        <span className="text-center px-4 py-2 text-gray-700 font-medium">
          {currentPage} of {totalPages}
        </span>
        <Button
          onClick={handleNextPage}
          label="Next"
          className="flex items-center justify-center ml-4 w-28 px-4 py-2 text-center border-2 border-rosso text-rosso bg-bianco hover:bg-rosso hover:text-bianco font-bold disabled:bg-gray-300  disabled:opacity-50"
          disabled={currentPage === totalPages}
        />
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default HomePage;
