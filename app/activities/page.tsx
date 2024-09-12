"use client";

import Card from "@/src/components/Card";
import Button from "@/src/components/Button";
import React, { useEffect, useState } from "react";
import { IActivity } from "../(models)/Activities";
import Link from "next/link";
import ArrowButton from "@/src/components/ArrowButton";

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


  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gray-100 relative">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-titolo text-giallo">Attività</h1>
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
              link={<Link href={`/activities/${activity._id}`}><ArrowButton /></Link>}

            />
          ))}
        </div>
      </div>
    </div>
  );
}
