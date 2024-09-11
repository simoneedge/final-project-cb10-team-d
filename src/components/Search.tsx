import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Search() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Desktop */}
      <div className="hidden md:flex items-center border border-gray-300 p-1 bg-white h-6">
        <input
          type="text"
          placeholder="Cerca..."
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
            className="absolute left-0 w-full border-none outline-none p-1 text-sm"
            style={{ paddingLeft: '2rem' }}
          />
        )}
      </div>
    </div>
  );
}

export default Search;
