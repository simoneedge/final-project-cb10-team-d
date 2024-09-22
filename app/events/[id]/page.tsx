"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
  article?: string;
  arrayImageArticle?: string[];
}

function parseTextToObject(text: string, setArticle: Dispatch<SetStateAction<{ title: string; subtitles: { subtitle: string; content: string }[]; content: string }[]>>): void {
  const lines = text.split('\n').map(line => line.trim());
  console.log(lines);
  const result: { title: string; subtitles: { subtitle: string; content: string }[]; content: string }[] = [];
  let currentTitle = '';
  let currentSubtitles: { subtitle: string; content: string }[] = [];
  let currentContent = '';

  lines.forEach(line => {
    if (line.startsWith('### ')) {
      // Aggiungi l'oggetto corrente se esiste
      if (currentTitle) {
        result.push({ title: currentTitle, subtitles: currentSubtitles, content: currentContent.trim() });
      }
      currentTitle = line.replace('### ', '').trim();
      currentSubtitles = []; // Resetta gli sottotitoli
      currentContent = ''; // Resetta il contenuto
    } else if (line.startsWith('## ')) {
      // Aggiungi l'oggetto corrente se esiste
      if (currentTitle) {
        result.push({ title: currentTitle, subtitles: currentSubtitles, content: currentContent.trim() });
      }
      currentTitle = line.replace('## ', '').trim();
      currentSubtitles = []; // Resetta gli sottotitoli
      currentContent = ''; // Resetta il contenuto
    } else if (line.startsWith('**')) {
      // Aggiungi il sottotitolo e il contenuto relativo all'array
      const subtitle = line.replace(/\*\*/g, '').trim();
      currentSubtitles.push({ subtitle, content: '' }); // Inizializza il contenuto per il sottotitolo
    } else if (line.startsWith('* ')) {
      // Skip standalone '*' lines
      return;
    } else if (line) {
      // Aggiungi il contenuto al sottotitolo più recente
      const lastIndex = currentSubtitles.length - 1;
      if (lastIndex >= 0) {
        currentSubtitles[lastIndex].content += line + ' '; // Aggiungi il contenuto
      } else {
        currentContent += line + ' '; // Aggiungi al contenuto principale se non ci sono sottotitoli
      }
    }
  });

  // Aggiungi l'ultimo oggetto se esiste
  if (currentTitle) {
    result.push({ title: currentTitle, subtitles: currentSubtitles, content: currentContent.trim() });
  }

  console.log(result);
  setArticle(result);
}
const getData = async (id: string) => {
  try {
    const res = await fetch(`/api/events/${id}`, {
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error(`Errore nella richiesta: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.event; // Assicurati di accedere all'evento specifico
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Errore sconosciuto durante il fetch dei dati");
    } else {
      throw new Error("Errore sconosciuto durante il fetch dei dati");
    }
  }
};

const EventDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [article, setArticle] = useState<{ title: string; subtitles: { subtitle: string; content: string }[]; content: string }[]>([]);



  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const fetchedEvent = await getData(id);
        setEvent(fetchedEvent);
        if (fetchedEvent?.article) {
          parseTextToObject(fetchedEvent.article, setArticle); // Chiamata a formatArticle
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Errore sconosciuto");
        }
      } finally {
        setLoading(false);
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
        <div className="w-full py-4 mb-4" style={{ backgroundColor: event.color }}>
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
              <strong className="text-xl font-titolo mb-4 text-rosso">Tag: </strong>
              {event.tag.join(", ")}
            </p>
          )}
          {event?.dateStart && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso mr-1">Data inizio:</strong>
              {event.dateStart}
            </p>
          )}
          {event?.dateEnd && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso mr-1">Data fine:</strong>
              {event.dateEnd}
            </p>
          )}
          {event?.price && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">Prezzo: </strong>
              {event.price === "0" ? "Ingresso gratuito" : `${event.price}€`}
            </p>
          )}
          {event?.location && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">Luogo: </strong>
              {event.location}
            </p>
          )}
        </div>

        {/* Descrizione dell'evento */}
        <p className="mt-6">{event?.description}</p>

        {article.map((item, index) => (
          <div key={index}>
            <h2 className="text-2xl font-bold mt-4">{item.title}</h2>
            {item.subtitles.map((sub, subIndex) => (
              <div key={subIndex}>
                <br />
                <h3 className="text-xl font-bold">{sub.subtitle}</h3>
                <h4>{sub.content}</h4> {/* Mostra il contenuto associato al sottotitolo */}
              </div>
            ))}
            <div>{item.content}</div>
          </div>
        ))}


        {/* Pulsante Torna indietro */}
        <button
          className="border-2 p-2 font-bold transition-colors duration-300 w-full md:w-auto mt-4"
          style={{
            borderColor: event?.color || "black",
            color: event?.color || "black",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = event?.color || "black";
            e.currentTarget.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = event?.color || "black";
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
