"use client";

import Card from "@/src/components/Card";
import React, { useEffect, useState } from "react";
import { IEvent } from "../(models)/Event";
import Link from "next/link";
import ArrowButton from "@/src/components/ArrowButton";
import { getDayOfYear } from "@/data/getDayOfYear";
import Filter from "@/src/components/Filter";
import { formattedDate } from "@/data/formattDate";
import Loading from "@/src/components/Loading";
import CategoryBanner from "@/src/components/CategoryBanner";
import { getAuth } from "firebase/auth";
import ScrollToTopButton from "@/src/components/ScrollToTopButton";

const fetchData = async (): Promise<{ events: IEvent[] }> => {
  try {
    const res = await fetch(`/api/events`, { cache: "no-cache" });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching data:", error.message);
      throw Error(error.message);
    } else {
      throw Error("Unknown error occurred");
    }
  }
};

export default function CulturePage() {
  const [cultures, setCultures] = useState<IEvent[]>([]);
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
  const [favoriteEventTitle, setFavoriteEventTitle] = useState<string[]>([]);

  // Funzione per recuperare i preferiti dell'utente
  const fetchFavorites = async (email: string | null) => {
    try {
      const response = await fetch(`/api/profiles?email=${email}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const favoriteTitle = data.profile.events.map(
        (event: { title: string | undefined }) => event.title
      );
      setFavoriteEventTitle(favoriteTitle);
    } catch (error) {
      console.error("Errore nel recupero dei preferiti:", error);
    }
  };

  // Effetto per caricare i dati iniziali
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchData();
        setCultures(data.events);
        setFilteredEvents(data.events);
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
    loadData();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = cultures;

      if (searchQuery) {
        filtered = filtered.filter(
          (event) =>
            event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.tag?.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
      }

      if (isFree) {
        filtered = filtered.filter((event) => event.price === "0");
      }

      if (today) {
        filtered = filtered.filter((event) => {
          const startEvent = event.dateStart
            ? getDayOfYear(event.dateStart)
            : -1;
          const endEvent = event.dateEnd ? getDayOfYear(event.dateEnd) : -1;
          return today >= startEvent && today <= endEvent;
        });
      }

      if (startNextWeek !== undefined && endNextWeek !== undefined) {
        filtered = filtered.filter((event) => {
          const startEvent = event.dateStart
            ? getDayOfYear(event.dateStart)
            : -1;
          const endEvent = event.dateEnd ? getDayOfYear(event.dateEnd) : -1;
          return startEvent <= endNextWeek && endEvent >= startNextWeek;
        });
      }

      setFilteredEvents(filtered);
    };

    applyFilters();
  }, [cultures, searchQuery, isFree, today, startNextWeek, endNextWeek]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTodayClick = () => {
    const dayOfYear = getDayOfYear(formattedDate());
    setToday(dayOfYear);
  };

  const handleTomorrowClick = () => {
    const dayOfYear = getDayOfYear(formattedDate(1));
    setToday(dayOfYear);
  };

  const handleNextWeekClick = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilNextMonday = (8 - dayOfWeek) % 7;
    const nextMonday = getDayOfYear(formattedDate()) + daysUntilNextMonday;
    const nextSunday = nextMonday + 6;
    setStartNextWeek(nextMonday);
    setEndNextWeek(nextSunday);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setIsFree(false);
    setToday(0);
    setStartNextWeek(undefined);
    setEndNextWeek(undefined);
    setFilteredEvents(cultures);
  };

  return (
    <div className="flex flex-col  items-center min-h-screen bg-gray-100 relative">
      <CategoryBanner label="Cultura" backgroundColor={"bg-verde"} />

      <Filter
        query={searchQuery}
        onSearch={handleSearch}
        isFree={isFree}
        setIsFree={setIsFree}
        onTodayClick={handleTodayClick}
        onTomorrowClick={handleTomorrowClick}
        onNextWeekClick={handleNextWeekClick}
        onResetFilters={handleResetFilters}
      />

      <div className="card-container grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 items-start  mb-10">
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {loading ? (
          <Loading />
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((culture, index) => (
            <div
              key={culture._id || index}
              className="col-span-1 w-full md:w-auto  justify-center transform hover:scale-105 transition-transform duration-300 custom-shadow"
            >
              <Card
                dateEnd={culture.dateEnd}
                dateStart={culture.dateStart}
                eventId={culture._id}
                backgroundColor="#4E614E"
                title={culture.title || "No title available"}
                imageSrc={culture.image || "default-image-url"}
                link={
                  <Link href={`/events/${culture._id}`}>
                    <ArrowButton />
                  </Link>
                }
                isLiked={
                  culture.title
                    ? favoriteEventTitle.includes(culture.title)
                    : false
                }
                onHeartClick={() =>
                  fetchFavorites(getAuth().currentUser?.email || "")
                }
              />
            </div>
          ))
        ) : (
          <div className="flex justify-center text-center">
            <p className="text-center text-gray-800 text-xl font-bold flex justify-center items-center h-64">
              Nessun evento disponibile...
            </p>
          </div>
        )}
      </div>
      <ScrollToTopButton />
    </div>
  );
}
