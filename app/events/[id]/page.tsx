'use client';

import { useEffect, useState } from 'react';
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

const EventDetailPage = ({ params }: { params: { id: string } }) => {
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchedEvent = {
      _id: params.id,
      title: 'Event Title',
      description: 'Detailed description of the event.',
      image: 'https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg',
      color: '#4E614E',
    };
    setEvent(fetchedEvent);
  }, [params.id]);

  if (!event) {
    return <div>Caricamento...</div>;
  }

  return (
    <div className="p-4">
      <Card
        backgroundColor={event.color}
        title={event.title}
        imageSrc={event.image}
      />
      <p className="mt-4">{event.description}</p>
    </div>
  );
};

export default EventDetailPage;
