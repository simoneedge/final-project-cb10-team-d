import Card from '@/src/components/Card'; 
import Button from '@/src/components/Button'; 
import React from 'react';

export default function AttivitaPage() {
  return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-giallo">Attività</h1>
          <Button label="Filtri" /> 
        </div>
        <div className="space-y-4">
          <Card
            backgroundColor="#F2B85A"
            title="Paste di mandorle"
            imageSrc="https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
          />
          <Card
            backgroundColor="#F2B85A"
            title="Paste di mandorle"
            imageSrc="https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
          />
          <Card
            backgroundColor="#F2B85A"
            title="Paste di mandorle"
            imageSrc="https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
          />
          <Card
            backgroundColor="#F2B85A"
            title="Paste di mandorle"
            imageSrc="https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
          />
        </div>
      </div>
  );
}
