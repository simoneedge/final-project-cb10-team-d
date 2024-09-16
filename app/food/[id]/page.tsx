'use client';

import Card from "../../../src/components/Card";
import React, { useEffect, useState } from "react";
import Loading from "../../../src/components/Loading"; // Importa il componente di loading

interface Event {
  _id: string;
  title?: string;
  image?: string;
  tag?: string[];
  description?: string;
  dateStart?: string;
  dateEnd?: string;
  price?: string;
  location?: string;
  color: string;
}

const getData = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/foods/${id}`, {
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error(
        `Errore nella richiesta: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    return data.event; // Assicurati di accedere all'evento specifico
  } catch (error: any) {
    throw new Error(
      error.message || "Errore sconosciuto durante il fetch dei dati"
    );
  }
};

const EventDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true); // Stato per il caricamento
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true); // Inizia il caricamento
      try {
        const fetchedEvent = await getData(id);
        setEvent(fetchedEvent);
      } catch (error: any) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false); // Termina il caricamento
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <Loading />; // Mostra l'animazione di caricamento durante il fetching
  }

  if (errorMessage) {
    return <p className="text-red-500">{errorMessage}</p>; // Mostra l'errore se presente
  }

  return (
    <div className="p-5 min-h-screen bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto text-black">
        <div className="flex justify-center items-center">
          <Card
            backgroundColor={event?.color}
            title={event?.title}
            imageSrc={event?.image}
          />
        </div>

        <div className="flex flex-col items-start text-left">
          <p className="mt-6">{event?.description}</p>
          <div className="mt-8">
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Tag:{" "}
              </strong>{" "}
              {event?.tag?.join(", ")}
            </p>
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Data inizio:
              </strong>{" "}
              {event?.dateStart}
            </p>
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Data fine:
              </strong>{" "}
              {event?.dateEnd}
            </p>
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Prezzo:{" "}
              </strong>
              {event?.price === "0" ? "Ingresso gratuito" : ` ${event?.price}€`}
            </p>
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Luogo:{" "}
              </strong>{" "}
              {event?.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
