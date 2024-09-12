'use client'

import React from 'react';
import EventForm from '@/src/components/EventForm';


const handleFormSubmit = (data: { nome: string; cognome: string; email: string; settore: string; messaggio: string }) => {
  console.log('Dati inviati:', data);
};

export default function ProponiEventoPage() {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gray-100 relative">
    <div className="p-4">
      <h1 className="text-4xl font-titolo mb-4 text-rosso">Proponi Evento</h1>
      <EventForm onSubmit={handleFormSubmit} />
    </div>
  </div>
  );
}
