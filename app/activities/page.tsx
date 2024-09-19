"use client";

import Card from "@/src/components/Card";
import React, { useEffect, useState } from "react";
import { IActivity } from "../(models)/Activities";
import Link from "next/link";
import ArrowButton from "@/src/components/ArrowButton";
import { getDayOfYear } from "@/data/getDayOfYear";
import Filter from "@/src/components/Filter";
import { formattedDate } from "@/data/formattDate";
import Loading from "@/src/components/Loading";
import CategoryBanner from "@/src/components/CategoryBanner";
import { getAuth } from "firebase/auth";

// Funzione per recuperare i dati delle culture
const fetchData = async (
  page: number,
  limit: number
): Promise<{ activities: IActivity[]; totalPages: number }> => {
  try {
    const res = await fetch(`/api/activities?page=${page}&limit=${limit}`, {
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
      throw new Error(error.message);
    } else {
      throw new Error("Unknown error occurred");
    }
  }
};

export default function CulturePage() {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<IActivity[]>([]);
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
        (event: { title: string }) => event.title
      );
      setFavoriteEventTitle(favoriteTitle);
    } catch (error) {
      console.error("Errore nel recupero dei preferiti:", error);
    }
  };

  // Stato per la paginazione
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  // Effetto per caricare i dati iniziali
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchData(currentPage, limit);
        setActivities(data.activities);
        setFilteredEvents(data.activities);
        setTotalPages(data.totalPages);
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
  }, [currentPage]);

  // Funzione per gestire la ricerca
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

  // Funzione per applicare i filtri agli eventi
  const applyFilters = (
    query: string,
    isFree: boolean,
    dayOfYear: number,
    startNextWeek?: number,
    endNextWeek?: number
  ) => {
    let filtered = activities;

    filtered = filtered.filter(
      (event) =>
        Boolean(event.reviewed) === true || event.reviewed === undefined
    );
    // Filtro per la query di ricerca
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

    // Filtro per eventi gratuiti
    if (isFree) {
      filtered = filtered.filter((event) => event.price === "0");
    } else {
      filtered = filtered.filter((event) => event.price !== "0");
    }

    // Filtro per il giorno specifico
    if (dayOfYear) {
      filtered = filtered.filter((event) => {
        const startEvent = event.dateStart ? getDayOfYear(event.dateStart) : -1;
        const endEvent = event.dateEnd ? getDayOfYear(event.dateEnd) : -1;
        return dayOfYear >= startEvent && dayOfYear <= endEvent;
      });
    }

    // Filtro per la prossima settimana
    if (startNextWeek !== undefined && endNextWeek !== undefined) {
      filtered = filtered.filter((event) => {
        const startEvent = event.dateStart ? getDayOfYear(event.dateStart) : -1;
        const endEvent = event.dateEnd ? getDayOfYear(event.dateEnd) : -1;
        return startEvent <= endNextWeek && endEvent >= startNextWeek;
      });
    }

    setFilteredEvents(filtered);
  };

  // Applica i filtri quando gli stati cambiano
  useEffect(() => {
    applyFilters(searchQuery, isFree, today, startNextWeek, endNextWeek);
  }, [activities, searchQuery, isFree, today, startNextWeek, endNextWeek]);

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
  const handleResetFilters = () => {
    setSearchQuery("");
    setIsFree(false);
    setToday(0);
    setStartNextWeek(undefined);
    setEndNextWeek(undefined);
    setFilteredEvents(activities); // Reset events
  };

  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gray-100 relative">
      <CategoryBanner label="Activity" backgroundColor={"bg-giallo"} />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
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
        </div>
        <div className="card-container grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 justify-items-center items-start">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {loading ? (
            <Loading />
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((activity, index) => (
              <div
                  key={activity._id || index}
                  className="col-span-1 w-full md:w-auto  justify-center transform hover:scale-105 transition-transform duration-300 custom-shadow" // Mantieni 'flex justify-center' qui
                >
              <Card
                eventId={activity._id}
                key={activity._id || index}
                backgroundColor="#F2B85A"
                title={activity.title || "No title available"}
                imageSrc={activity.image || "default-image-url"}
                link={
                  <Link href={`/activities/${activity._id}`}>
                    <ArrowButton />
                  </Link>
                }
                isLiked={
                  activity.title
                    ? favoriteEventTitle.includes(activity.title)
                    : false
                }
                onHeartClick={() =>
                  fetchFavorites(getAuth().currentUser?.email || "")
                }
              />
              </div>
              <div
                key={activity._id || index}
                className="col-span-1 w-full md:w-auto  justify-center transform hover:scale-105 transition-transform duration-300 custom-shadow" // Mantieni 'flex justify-center' qui
              >
                <Card
                  eventId={activity._id}
                  key={activity._id || index}
                  backgroundColor="#F2B85A"
                  title={activity.title || "No title available"}
                  imageSrc={activity.image || "default-image-url"}
                  link={
                    <Link href={`/activities/${activity._id}`}>
                      <ArrowButton />
                    </Link>
                  }
                  isLiked={
                    activity.title
                      ? favoriteEventTitle.includes(activity.title)
                      : false
                  }
                  onHeartClick={() =>
                    fetchFavorites(getAuth().currentUser?.email || "")
                  }
                />
              </div>
            ))
          ) : (
            <p className="justify-items-center">No events found...</p>
          )}
        </div>
        {/* Controlli di paginazione */}
        <div className="pagination-controls flex justify-center m-10">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="mr-4 w-32 px-4 py-2 bg-gray-700 text-white rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-50 text-center"
          >
            Previous
          </button>
          <span className="text-center px-4 py-2 text-gray-700 font-medium">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="ml-4 w-32 px-4 py-2 bg-gray-700 text-white rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-50 text-center"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
