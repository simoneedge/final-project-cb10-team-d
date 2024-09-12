"use client";

import { useRouter } from "next/navigation";
import Card from "@/src/components/Card";
import Button from "@/src/components/Button";
import React from "react";

export default function CulturaPage() {
  const router = useRouter();

  const handleArrowClick = (id: string) => {
    router.push(`/events/${id}`);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-verde">Cultura</h1>
        <Button label="Filtri" />
      </div>
      <div className="space-y-4">
        <Card
          backgroundColor="#4E614E"
          title="Paste di mandorle"
          imageSrc="https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
          onArrowClick={() => handleArrowClick("1")}
        />
        <Card
          backgroundColor="#4E614E"
          title="Paste di mandorle"
          imageSrc="https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
          onArrowClick={() => handleArrowClick("2")}
        />
        <Card
          backgroundColor="#4E614E"
          title="Paste di mandorle"
          imageSrc="https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
          onArrowClick={() => handleArrowClick("3")}
        />
        <Card
          backgroundColor="#4E614E"
          title="Paste di mandorle"
          imageSrc="https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
          onArrowClick={() => handleArrowClick("4")}
        />
      </div>
    </div>
  );
}
