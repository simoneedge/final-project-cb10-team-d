"use client";

import Card from "@/src/components/Card";
import Button from "@/src/components/Button";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ArrowButton from "@/src/components/ArrowButton";
import { ICulture } from "../(models)/Culture";

const fetchData = async (): Promise<{ cultures: ICulture[] }> => { // Cambia 'events' in 'cultures'
  try {
    const res = await fetch("http://localhost:3000/api/cultures", {
      cache: "no-cache",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    throw Error(error.message);
  }
};

export default function CulturaPage() {
  const [cultures, setCultures] = useState<ICulture[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  /*   const router = useRouter(); */

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData();
        console.log(data);
        setCultures(data.cultures);
      } catch (error: any) {
        setErrorMessage("Failed to load data.");
      }
    };

    loadData();
  }, []);

  /*   const handleArrowClick = (id: string) => {
      router.push(`/events/${id}`);
    }; */

  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gray-100 relative">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-titolo text-verde">Cultura</h1>
          <Button label="Filtri" />
        </div>
        <div className="space-y-4">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {cultures.map((culture, index) => (
            <Card
              key={culture._id || index}
              backgroundColor="#4E614E"
              title={culture.title || "No title available"}
              imageSrc={culture.image || "default-image-url"}
              link={<Link href={`/culture/${culture._id}`}><ArrowButton /></Link>}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
