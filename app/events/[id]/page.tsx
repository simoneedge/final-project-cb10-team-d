"use client";

import { useEffect, useState } from "react";
import Card from "@/src/components/Card";

interface Event {
  _id: string;
  title?: string;
  image?: string;
  tag?: string[];
  description?: string;
  date?: string;
  price?: string;
  location?: string;
  color: string;
}

const getData = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/events", {
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error(
        `Errore nella richiesta: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "Errore sconosciuto durante il fetch dei dati"
    );
  }
};

const EventDetailPage = ({ params }: { params: { id: string } }) => {
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const result = await getData();

        const events = Array.isArray(result) ? result : [result];

        const foundEvent = events.find((ev) => ev._id === params.id);

        setEvent(foundEvent || null);
      } catch (error) {
        console.error("Errore nel caricamento dei dati:", error);
      }
    };

    fetchEvent();
  }, [params.id]);

  if (!event) {
    return <div>Caricamento...</div>;
  }

  return (
    <div className="p-4">
      <Card
        backgroundColor={event?.color}
        title={event?.title}
        imageSrc={event?.image}
      />
      <p className="mt-4">{event.description}</p>
      <div className="mt-2">
        <p>
          <strong>Tag:</strong> {event.tag?.join(", ")}
        </p>
        <p>
          <strong>Data:</strong> {event.date}
        </p>
        <p>
          <strong>Prezzo:</strong> {event.price}
        </p>
        <p>
          <strong>Luogo:</strong> {event.location}
        </p>
      </div>
    </div>
  );
};

export default EventDetailPage;
