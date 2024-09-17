'use client';

import Card from "@/src/components/Card";
import React, { useEffect, useState } from "react";
import { IFood } from "../(models)/Foods";
import Link from "next/link";
import ArrowButton from "@/src/components/ArrowButton";
import { getDayOfYear } from "@/data/getDayOfYear";
import Filter from "@/src/components/Filter";
import { formattedDate } from "@/data/formattDate";
import Loading from "@/src/components/Loading"; 
import CategoryBanner from "@/src/components/CategoryBanner";

// Funzione per recuperare i dati dei cibi
const fetchData = async (): Promise<{ foods: IFood[] }> => {
  try {
    const res = await fetch("http://localhost:3000/api/foods", {
      cache: "no-cache",
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log("Fetched foods:", data.foods); // Log di debug
    return data;
  } catch (error: any) {
    console.error("Error fetching data:", error.message); // Log di errore
    throw Error(error.message);
  }
};

export default function FoodPage() {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<IFood[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [today, setToday] = useState<number>(0);
  const [startNextWeek, setStartNextWeek] = useState<number | undefined>(undefined);
  const [endNextWeek, setEndNextWeek] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Effetto per caricare i dati iniziali
  useEffect(() => {
    const loadData = async () => {
      setLoading(true); 
      try {
        const data = await fetchData();
        setFoods(data.foods);
        setFilteredEvents(data.foods);
      } catch (error: any) {
        console.error("Failed to load data:", error); // Log di errore
        setErrorMessage("Failed to load data.");
      } finally {
        setLoading(false); 
      }
    };

    loadData();
  }, []);

  // Funzione per gestire la ricerca
  const handleSearch = (query: string) => {
    console.log("Search query:", query); // Log di debug
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
  const applyFilters = (query: string, isFree: boolean, dayOfYear: number, startNextWeek?: number, endNextWeek?: number) => {
    let filtered = foods;

    // Filtro per la query di ricerca
    if (query !== '') {
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(query.toLowerCase()) || 
        event.location?.toLowerCase().includes(query.toLowerCase()) || 
        event.tag?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Filtro per eventi gratuiti
    if (isFree) {
      filtered = filtered.filter(event => event.price === '0'); 
    } else {
      filtered = filtered.filter(event => event.price !== '0');
    }

    // Filtro per il giorno specifico
    if (dayOfYear) {
      filtered = filtered.filter(event => {
        const startEvent = event.dateStart ? getDayOfYear(event.dateStart) : -1;
        const endEvent = event.dateEnd ? getDayOfYear(event.dateEnd) : -1;
        return dayOfYear >= startEvent && dayOfYear <= endEvent;
      });
    }

    // Filtro per la prossima settimana
    if (startNextWeek !== undefined && endNextWeek !== undefined) {
      filtered = filtered.filter(event => {
        const startEvent = event.dateStart ? getDayOfYear(event.dateStart) : -1;
        const endEvent = event.dateEnd ? getDayOfYear(event.dateEnd) : -1;
        return startEvent <= endNextWeek && endEvent >= startNextWeek;
      });
    }

    console.log("Filtered events:", filtered); // Log di debug per verificare i risultati dei filtri
    setFilteredEvents(filtered);
  };

  // Applica i filtri quando gli stati cambiano
  useEffect(() => {
    applyFilters(searchQuery, isFree, today, startNextWeek, endNextWeek);
  }, [foods, searchQuery, isFree, today, startNextWeek, endNextWeek]);

  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gray-100 relative">
      <CategoryBanner label="Food" backgroundColor={"bg-rosso"} />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Filter
            onSearch={handleSearch}
            isFree={isFree}
            setIsFree={setIsFree}
            onTodayClick={handleTodayClick}
            onTomorrowClick={handleTomorrowClick}
            onNextWeekClick={handleNextWeekClick}
          />
        </div>
        <div className="card-container grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center items-start">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {loading ? (
            <Loading /> 
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((food, index) => (
              <Card
                key={food._id || index}
                backgroundColor="#822225"
                title={food.title || "No title available"}
                imageSrc={food.image || "default-image-url"}
                link={<Link href={`/food/${food._id}`}><ArrowButton /></Link>}
              />
            ))
          ) : (
            <p className="justify-items-center">No events found...</p>
          )}
        </div>
      </div>
    </div>
  );
}
