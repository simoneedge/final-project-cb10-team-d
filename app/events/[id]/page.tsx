"use client";

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
  article: string;
}

const getData = async (id: string) => {
  try {
    const res = await fetch(`/api/events/${id}`, {
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error(`
        Errore nella richiesta: ${res.status} ${res.statusText}
      `);
    }

    const data = await res.json();
    return data.event; // Assicurati di accedere all'evento specifico
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        error.message || "Errore sconosciuto durante il fetch dei dati"
      );
    } else {
      throw new Error("Errore sconosciuto durante il fetch dei dati");
    }
  }
};

interface IFormattedArticleProps {
  article: string;
  setTitles: (titles: string[]) => void;
  setParagraphs: (paragraphs: string[]) => void;
}

function formatArticle(props: IFormattedArticleProps) {
  const { article, setTitles, setParagraphs } = props;

  if (article) {
    const lines = article.split("\n");

    const titles: string[] = [];
    const paragraphs: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Se la linea inizia con ##, è un titolo di sezione
      if (line.startsWith("##")) {
        const title = line.replace("##", "").trim();
        titles.push(title);

        // Altrimenti, se la linea non è vuota, è un paragrafo
      } else if (line.length > 0) {
        paragraphs.push(line);
      }
    }

    // Aggiorna gli stati con i titoli e i paragrafi estratti
    setTitles(titles);
    setParagraphs(paragraphs);
  }
}

const EventDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Stato di caricamento
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Stati per titoli e paragrafi dell'articolo
  const [titles, setTitles] = useState<string[]>([]);
  const [paragraphs, setParagraphs] = useState<string[]>([]);

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true); // Inizia il caricamento
      try {
        const fetchedEvent = await getData(id);
        setEvent(fetchedEvent);
        console.log(fetchedEvent);

        // Chiama formatArticle se l'articolo è presente
        if (fetchedEvent.article) {
          formatArticle({
            article: fetchedEvent.article,
            setTitles,
            setParagraphs,
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Errore sconosciuto");
        }
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
    <div className="min-h-screen bg-gray-100">
      {/* Immagine dell'evento */}
      {event?.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-[60vh] object-cover"
        />
      )}

      {/* Rettangolo colorato con titolo */}
      {event ? (
        <div
          className="w-full py-4 mb-4"
          style={{ backgroundColor: event.color }}
        >
          <div className="max-w-5xl mx-auto px-5">
            <h1 className="text-white text-4xl font-titolo font-bold text-left">
              {event.title}
            </h1>
          </div>
        </div>
      ) : (
        <div className="w-full py-4 mb-4">
          <p>Evento non trovato.</p>
        </div>
      )}

      {/* Dettagli dell'evento */}
      <div className="p-5 max-w-5xl mx-auto text-black">
        {/* Altri dettagli */}
        <div className="mt-4">
          {event?.tag && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Tag:{" "}
              </strong>
              {event?.tag?.join(", ")}
            </p>
          )}
          {event?.dateStart && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso mr-1">
                Data inizio:
              </strong>
              {event?.dateStart}
            </p>
          )}
          {event?.dateEnd && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso mr-1">
                Data fine:
              </strong>
              {event?.dateEnd}
            </p>
          )}
          {event?.price && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Prezzo:{" "}
              </strong>
              {event?.price === "0" ? "Ingresso gratuito" : `${event.price}€`}
            </p>
          )}
          {event?.location && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Luogo:{" "}
              </strong>
              {event?.location}
            </p>
          )}
        </div>

        {/* Descrizione dell'evento */}
        <p className="mt-6">{event?.description}</p>

        {/* Articolo formattato */}
        <div className="mt-6">
          {titles.map((title, index) => (
            <React.Fragment key={index}>
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="mt-4">{paragraphs[index]}</p>
            </React.Fragment>
          ))}
        </div>

        {/* Pulsante Torna indietro */}
        <button
          className="border-2 p-2 font-bold transition-colors duration-300 w-full md:w-auto mt-4"
          style={{
            borderColor: event?.color || "black", // Colore dinamico del bordo
            color: event?.color || "black", // Colore dinamico del testo
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = event?.color || "black"; // Hover: cambia bg con event.color
            e.currentTarget.style.color = "white"; // Hover: testo bianco
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "white"; // Reset background a bianco
            e.currentTarget.style.color = event?.color || "black"; // Reset testo al colore dinamico
          }}
          onClick={goBack}
        >
          Torna indietro
        </button>
      </div>
    </div>
  );
};

export default EventDetailPage;
