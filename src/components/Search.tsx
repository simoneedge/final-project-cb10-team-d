import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface SearchProps {
  onSearch: (query: string) => void;
}

function Search({ onSearch }: SearchProps) {
  const [query, setQuery] = useState(''); // Stato locale per l'input

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value); // Esegui la ricerca quando l'input cambia
  };

  return (
    <div className="flex items-center border-2 border-rosso border-gray-300 p-5 bg-white h-10 w-full  mr-20">
      <input
        type="text"
        placeholder="Cerca..."
        value={query}
        onChange={handleChange}
        className="flex-1 border-none outline-none p-2 text-sm h-full"
      />
      <button className="bg-transparent border-none cursor-pointer p-2">
        <i className="fas fa-search text-gray-600 text-xs"></i>
      </button>
    </div>
  );
}

export default Search;
