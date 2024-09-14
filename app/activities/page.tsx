"use client";

import Card from "@/src/components/Card";
import React, { useEffect, useState } from "react";
import { IActivity } from "../(models)/Activities";
import Link from "next/link";
import ArrowButton from "@/src/components/ArrowButton";
import { getDayOfYear } from "@/data/getDayOfYear";
import Filter from "@/src/components/Filter";
import { formattedDate } from "@/data/formattDate";

const fetchData = async (): Promise<{ activities: IActivity[] }> => {
  try {
    const res = await fetch("http://localhost:3000/api/activities", {
      cache: "no-cache",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    throw Error(error.message);
  }
};

export default function AttivitaPage() {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<IActivity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [today, setToday] = useState<number>(0);
  const [startNextWeek, setStartNextWeek] = useState<number | undefined>(undefined);
  const [endNextWeek, setEndNextWeek] = useState<number | undefined>(undefined);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData();
        setActivities(data.activities);
        setFilteredEvents(data.activities);
      } catch (error: any) {
        setErrorMessage("Failed to load data.");
      }
    };

    loadData();
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
    const daysUntilNextMonday = (8 - dayOfWeek) % 7; // Calcola i giorni mancanti fino al prossimo Lunedì
    const nextMonday = getDayOfYear(formattedDate()) + daysUntilNextMonday;
    const nextSunday = nextMonday + 6
    setStartNextWeek(nextMonday);
    setEndNextWeek(nextSunday);

    applyFilters(searchQuery, isFree, 0, nextMonday, nextSunday);
  };

  const applyFilters = (query: string, isFree: boolean, dayOfYear: number, startNextWeek?: number, endNextWeek?: number) => {
    let filtered = activities;

    // Filtro per la ricerca
    if (query !== '') {
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(query.toLowerCase()) ||
        event.location?.toLowerCase().includes(query.toLowerCase()) ||
        event.tag?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Filtro per eventi gratuiti/a pagamento
    if (isFree) {
      filtered = filtered.filter(event => event.price === '0');
    } else if (!isFree) {
      filtered = filtered.filter(event => event.price !== '0');
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
    applyFilters(searchQuery, isFree, today, startNextWeek, endNextWeek);
  }, [activities, searchQuery, isFree, today, startNextWeek, endNextWeek]);

  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gray-100 relative">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-titolo text-giallo">Attività</h1>
          <Filter
            onSearch={handleSearch}
            isFree={isFree}
            setIsFree={setIsFree}
            onTodayClick={handleTodayClick}
            onTomorrowClick={handleTomorrowClick}
            onNextWeekClick={handleNextWeekClick}
          />
        </div>
        <div className="space-y-4">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {filteredEvents.length > 0 ? (
            filteredEvents.map((activity) => (
              <Card
                key={activity._id}
                backgroundColor="#F2B85A"
                title={activity.title || "No title available"}
                imageSrc={activity.image || "default-image-url"}
                link={<Link href={`/activities/${activity._id}`}><ArrowButton /></Link>}
              />
            ))
          ) : (
            <p>No events found...</p>
          )}
        </div>
      </div>
    </div>
  );
}