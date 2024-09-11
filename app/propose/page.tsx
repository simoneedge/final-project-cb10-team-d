'use client'

import React from 'react';
import EventForm from '@/src/components/EventForm';


const handleFormSubmit = (data: { nome: string; cognome: string; email: string; settore: string; messaggio: string }) => {
  console.log('Dati inviati:', data);
};

export default function ProponiEventoPage() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-verde">Proponi Evento</h1>
      <EventForm onSubmit={handleFormSubmit} />
    </div>
  );
}
