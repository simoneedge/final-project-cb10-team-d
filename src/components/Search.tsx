import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface SearchProps {
  onSearch: (query: string) => void; // Aggiungi la prop per la funzione di ricerca
}

function Search({ onSearch }: SearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(''); // Stato locale per l'input

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value); // Esegui la ricerca quando l'input cambia
  };

  return (
    <div className="relative">
      {/* Desktop */}
      <div className="hidden md:flex items-center border border-gray-300 p-1 bg-white h-6">
        <input
          type="text"
          placeholder="Cerca..."
          value={query}
          onChange={handleChange}
          className="flex-1 border-none outline-none p-1 text-sm h-4"
        />
        <button className="bg-transparent border-none cursor-pointer p-1">
          <i className="fas fa-search text-gray-600 text-xs"></i>
        </button>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center border-none p-1 bg-white h-6">
        <button
          className="bg-transparent border-none cursor-pointer p-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className="fas fa-search text-gray-600 text-xs"></i>
        </button>
        {isOpen && (
          <input
            type="text"
            placeholder="Cerca..."
            value={query}
            onChange={handleChange}
            className="absolute left-0 w-full border-none outline-none p-1 text-sm"
            style={{ paddingLeft: '2rem' }}
          />
        )}
      </div>
    </div>
  );
}

export default Search;