import React from "react";

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
    const res = await fetch(`http://localhost:3000/api/cultures/${id}`, {
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error(
        `Errore nella richiesta: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    return data.event;
  } catch (error: any) {
    throw new Error(
      error.message || "Errore sconosciuto durante il fetch dei dati"
    );
  }
};

const EventDetailPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const event = await getData(id);

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

      {/* Rettangolo rosso con titolo */}
      <div className="bg-verde w-full py-4 mb-4">
        <div className="max-w-5xl mx-auto px-5 p-3">
          <h1 className="text-white text-4xl font-titolo font-bold text-left">
            {event?.title}
          </h1>
        </div>
      </div>

      {/* Dettagli dell'evento */}
      <div className="p-5 max-w-5xl mx-auto text-black">
        {/* Altri dettagli */}
        <div className="mt">
          {event.tag && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Tag:{" "}
              </strong>
              {event.tag.join(", ")}
            </p>
          )}
          {event.dateStart && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Data inizio:
              </strong>
              {event.dateStart}
            </p>
          )}
          {event.dateEnd && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Data fine:
              </strong>
              {event.dateEnd}
            </p>
          )}
          {event.price && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Prezzo:{" "}
              </strong>
              {event.price === "0"
                ? "Ingresso gratuito"
                : ` ${event.price}€`}
            </p>
          )}
          {event.location && (
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Luogo:{" "}
              </strong>
              {event.location}
            </p>
          )}
        </div>

        {/* Descrizione dell'evento */}
        <p className="mt-6">{event.description}</p>
      </div>
    </div>
  );
};

export default EventDetailPage;
