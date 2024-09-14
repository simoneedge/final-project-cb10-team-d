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

export default function TestPage() {
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
  
    const keywords = [formData.title, formData.location];
    const imageUrl = await fetchUnsplashImage(keywords);
  
    const finalFormData = {
      ...formattedData,
      image: imageUrl || formData.image,
    };
  
    // Debug: Verifica dei dati finali inviati
    console.log('Final Form Data:', finalFormData);
    console.log('Request size:', JSON.stringify(finalFormData).length);
  
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Event created:', data);
      } else {
        console.error('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event', error);
    }
  };

  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gray-100 relative">
      <div className="p-4">
        <h1 className="text-4xl font-titolo mb-4 text-rosso">Proponi Evento</h1>
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