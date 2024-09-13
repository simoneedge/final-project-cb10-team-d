import Card from "../../../src/components/Card";
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
    const res = await fetch(`http://localhost:3000/api/events/${id}`, {
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error(
        `Errore nella richiesta: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    console.log(data);
    return data.event; // Assicurati di accedere all'evento specifico
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
          <p className="mt-6">{event.description}</p>
          <div className="mt-8">
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Tag:{" "}
              </strong>{" "}
              {event.tag?.join(", ")}
            </p>
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Data inizio:
              </strong>{" "}
              {event.dateStart}
            </p>
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Data fine:
              </strong>{" "}
              {event.dateEnd}
            </p>
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Prezzo:{" "}
              </strong>
              {event.price === "0" ? "Ingresso gratuito" : `â‚¬ ${event.price}`}
            </p>
            <p>
              <strong className="text-xl font-titolo mb-4 text-rosso">
                Luogo:{" "}
              </strong>{" "}
              {event.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
