
import Card from '@/src/components/Card';

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

const getData = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/events/${id}`, { cache: 'no-cache' });

    if (!res.ok) {
      throw new Error(`Errore nella richiesta: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.event;  // Assicurati di accedere all'evento specifico
  } catch (error: any) {
    throw new Error(error.message || 'Errore sconosciuto durante il fetch dei dati');
  }
};

const EventDetailPage = async ({ params }: { params: { id: string } }) => {


  const { id } = params;

  const event = await getData(id);

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