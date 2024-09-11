 import Card from '@/src/components/Card'; 
import Button from '@/src/components/Button'; 
import React from 'react';

export default function FoodPage() {
  return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-rosso">Food</h1>
          <Button label="Filtri" /> 
        </div>
        <div className="space-y-4">
          <Card
            backgroundColor="#822225"
            title="Paste di mandorle"
            imageSrc="https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
          />
          <Card
            backgroundColor="#822225"
            title="Paste di mandorle"
            imageSrc="https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
          />
          <Card
            backgroundColor="#822225"
            title="Paste di mandorle"
            imageSrc="https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
          />
          <Card
            backgroundColor="#822225"
            title="Paste di mandorle"
            imageSrc="https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
          />
        </div>
      </div>
  );
}
