'use client';

import EventForm from '@/src/components/EventForm';
import { useState } from 'react';

const fetchUnsplashImage = async (keywords: string[]): Promise<string> => {
  const accessKey = 'xrl-d5mGda3B79duvjalC99m_jQ00I3MzfOzrkO5ksM';
  const query = keywords.join('+');
  const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=1&client_id=${accessKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    } else {
      return '';
    }
  } catch (error) {
    console.error('Errore nella fetch di Unsplash', error);
    return '';
  }
};

const formatDate = (date: string) => {
  const [year, month, day] = date.split('-');
  return `${day}-${month}-${year}`;
};

export default function ProposePage() {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    tag: [] as string[],
    description: '',
    dateStart: '',
    dateEnd: '',
    price: '',
    location: '',
    category: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTagChange = (tags: string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      tag: tags,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    const formattedData = {
      ...formData,
      dateStart: formatDate(formData.dateStart),
      dateEnd: formatDate(formData.dateEnd),
    };

    // Debug: Controllo delle date formattate dd-mm-yyyy
    console.log('Formatted Date Start:', formattedData.dateStart);
    console.log('Formatted Date End:', formattedData.dateEnd);

    // Costruisce dinamicamente l'URL dell'API in base alla categoria
    const apiEndpointCategory = `/api/${formData.category}`;
    console.log('API Endpoint:', apiEndpointCategory);
    const apiEndpointEvents = '/api/events';

    const keywords = [formData.title, formData.location];
    const imageUrl = await fetchUnsplashImage(keywords);

    const finalFormData = {
      ...formattedData,
      image: imageUrl || formData.image,
    };

    try {
      // Eseguiamo entrambe le richieste POST contemporaneamente
      const [responseCategory, responseEvents] = await Promise.all([
        fetch(apiEndpointCategory, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(finalFormData),
        }),

        fetch(apiEndpointEvents, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(finalFormData),
        }),
      ]);



      // Gestione delle risposte
      if (responseCategory.ok && responseEvents.ok) {
        const dataCategory = await responseCategory.json();
        const dataEvents = await responseEvents.json();
        console.log('Event created in category:', dataCategory);
        console.log('Event created in events:', dataEvents);
      } else {
        console.error('Failed to create event in one or both APIs');
      }
    } catch (error) {
      console.error('Error creating event', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
      <div className="p-8">
        <h1 className="text-4xl font-titolo mb-4 ml-4 text-rosso">Proponi Evento</h1>
        <EventForm
          formData={formData}
          onChange={handleChange}
          onTagChange={handleTagChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}