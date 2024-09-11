import Card from '@/src/components/Card'; 
import Button from '@/src/components/Button'; 
import React from 'react';

export default function CulturaPage() {
  return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-verde">Cultura</h1>
          <Button label="Filtri" /> {/* Pulsante per i filtri */}
        </div>
        <div className="space-y-4">
          {/* Esempi di Card */}
          <Card
            backgroundColor="#4E614E"
            title="Paste di mandorle"
            imageSrc="https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
          />
          <Card
            backgroundColor="#4E614E"
            title="Paste di mandorle"
            imageSrc="https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
          />
          <Card
            backgroundColor="#4E614E"
            title="Paste di mandorle"
            imageSrc="https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
          />
          <Card
            backgroundColor="#4E614E"
            title="Paste di mandorle"
            imageSrc="https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
          />
        </div>
      </div>
  );
}
