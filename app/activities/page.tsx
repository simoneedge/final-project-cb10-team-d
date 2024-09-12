"use client";

import { useRouter } from "next/navigation";
import Card from "@/src/components/Card";
import Button from "@/src/components/Button";
import React, { useEffect, useState } from "react";
import { IFood } from "../(models)/Foods"; 
const fetchData = async () => {
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
  const [activities, setActivities] = useState<IFood[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData();
        setActivities(data.activities); 
      } catch (error: any) {
        setErrorMessage("Failed to load data.");
      }
    };

    loadData();
  }, []);

  const handleArrowClick = (id: string) => {
    router.push(`/events/${id}`);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-giallo">Attività</h1>
        <Button label="Filtri" />
      </div>
      <div className="space-y-4">
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {activities.map((activity) => (
          <Card
            key={activity._id}
            backgroundColor="#F2B85A"
            title={activity.title || "No title available"}
            imageSrc={activity.image || "default-image-url"} 
            onArrowClick={() => handleArrowClick(activity._id)}
          />
        ))}
      </div>
    </div>
  );
}
