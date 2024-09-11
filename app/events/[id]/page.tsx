'use client';

import { useEffect, useState } from 'react';
import Card from '@/src/components/Card';

interface Event {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  color: string;
}

const EventDetailPage = ({ params }: { params: { id: string } }) => {
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchedEvent = {
      id: params.id,
      title: 'Event Title',
      description: 'Detailed description of the event.',
      imageSrc: 'https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg',
      color: '#4E614E',
    };
    setEvent(fetchedEvent);
  }, [params.id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Card
        backgroundColor={event.color}
        title={event.title}
        imageSrc={event.imageSrc}
      />
      <p className="mt-4">{event.description}</p>
    </div>
  );
};

export default EventDetailPage;
