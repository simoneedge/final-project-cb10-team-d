'use client';

import React from 'react';

interface EventFormProps {
  formData: {
    title: string;
    image: string;
    tag: string[];
    description: string;
    dateStart: string;
    dateEnd: string;
    price: string;
    location: string;
    category: string; 
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onTagChange: (tags: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const EventForm = ({ formData, onChange, onTagChange, onSubmit }: EventFormProps) => {
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTag = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      onTagChange([...formData.tag, selectedTag]);
    } else {
      onTagChange(formData.tag.filter(tag => tag !== selectedTag));
    }
  };

  // Funzione per ottenere la data odierna in formato yyyy-mm-dd
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // i mesi partono da 0
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form className="bg-white p-6 shadow-lg w-full max-w-xl space-y-8" onSubmit={onSubmit}>
        <select
          name="category"
          className="w-full border p-2 rounded"
          value={formData.category}
          onChange={onChange}
          required
        >
          <option value="">Seleziona Categoria</option>
          <option value="cultura">Cultura</option>
          <option value="food">Food</option>
          <option value="attività">Attività</option>
        </select>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Titolo"
            className="border p-2 w-full rounded"
            value={formData.title}
            onChange={onChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Luogo"
            className="border p-2 w-full rounded"
            value={formData.location}
            onChange={onChange}
            required
          />
        </div>
        <textarea
          name="description"
          placeholder="Descrizione"
          className="w-full border p-2 rounded"
          value={formData.description}
          onChange={onChange}
          required
        ></textarea>

        <fieldset className="border p-4 rounded">
          <legend className="font-bold">Seleziona uno o più tag:</legend>
          <div className="flex flex-wrap gap-4">
            {["concerti", "festival", "arte", "moda", "mostra", "workshop", "teatro", "spettacolo", "ristorante", "fiera", "sagra", "tradizione"].map((tag) => (
              <label key={tag} className="inline-flex items-center w-1/2 md:w-1/5">
                <input
                  type="checkbox"
                  value={tag}
                  checked={formData.tag.includes(tag)}
                  onChange={handleTagChange}
                  className="mr-2"
                />
                <span>{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="dateStart"
            placeholder="Data inizio"
            className="border p-2 w-full rounded"
            value={formData.dateStart}
            onChange={onChange}
            min={todayDate} // Imposta la data minima
            required
          />
          <input
            type="date"
            name="dateEnd"
            placeholder="Data fine"
            className="border p-2 w-full rounded"
            value={formData.dateEnd}
            onChange={onChange}
            min={todayDate} // Imposta la data minima
            required
          />
        </div>
        <input
          type="text"
          name="price"
          placeholder="Prezzo"
          className="w-full border p-2 rounded"
          value={formData.price}
          onChange={onChange}
          required
        />
        <button
          type="submit"
          className="border border-rosso bg-white text-rosso p-2 rounded hover:bg-rosso hover:text-white"
        >
          Crea Evento
        </button>
      </form>
    </div>
  );
};

export default EventForm;
