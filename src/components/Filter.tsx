import React, { Dispatch, SetStateAction } from "react";
import Search from "./Search";
import SwitchBox from "./SwitchBox";
import Button from "./Button";

interface IFilter {
  query: string;
  onSearch: (query: string) => void;
  isFree: boolean;
  setIsFree: Dispatch<SetStateAction<boolean>>;
  onTodayClick: () => void;
  onTomorrowClick: () => void;
  onNextWeekClick: () => void;
  onResetFilters: () => void; // Prop per resettare i filtri
}

function Filter({
  query,
  onSearch,
  isFree,
  setIsFree,
  onTodayClick,
  onTomorrowClick,
  onNextWeekClick,
  onResetFilters,
}: IFilter) {
  // Funzione per gestire il reset completo
  const handleReset = () => {
    onSearch(""); // Resetta il campo di ricerca
    setIsFree(false); // Resetta il filtro "Gratis"
    onResetFilters(); // Chiama la funzione di reset per i filtri temporali
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-4 mb-10 mt-10">
      {/* Campo di ricerca */}
      <div className="w-full md:w-auto flex-1">
        <Search
          query={query}
          onSearch={onSearch}
          onReset={() => onSearch("")} // Passa la funzione di reset
        />
      </div>

      {/* Filtri */}
      <div className="flex flex-wrap md:flex-nowrap gap-4 mt-4 md:mt-0">
        <Button
          label={"Oggi"}
          onClick={onTodayClick}
          className="px-4 py-2 border-2 border-rosso text-rosso bg-white hover:bg-rosso hover:text-white font-bold transition-colors duration-300"
        />
        <Button
          label={"Domani"}
          onClick={onTomorrowClick}
          className="px-4 py-2 border-2 border-rosso text-rosso bg-white hover:bg-rosso hover:text-white font-bold transition-colors duration-300"
        />
        <Button
          label={"Prossima settimana"}
          onClick={onNextWeekClick}
          className="px-4 py-2 border-2 border-rosso text-rosso bg-white hover:bg-rosso hover:text-white font-bold transition-colors duration-300"
        />

        {/* SwitchBox per il filtro Gratis */}
        <SwitchBox label={"Gratis"} value={isFree} setValue={setIsFree} />

        {/* Aggiungi il pulsante di reset */}
        <Button
          label={"Reset Filtri"}
          onClick={handleReset}
          className="px-4 py-2 border-2 border-gray-500 text-gray-500 bg-white hover:bg-gray-500 hover:text-white font-bold transition-colors duration-300"
        />
      </div>
    </div>
  );
}

export default Filter;
