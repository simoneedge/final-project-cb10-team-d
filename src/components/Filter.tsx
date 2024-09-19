import React, { Dispatch, SetStateAction } from "react";
import Search from "./Search";
import SwitchBox from "./SwitchBox";
import Button from "./Button";

interface IFilter {
  onSearch: (query: string) => void;
  isFree: boolean;
  setIsFree: Dispatch<SetStateAction<boolean>>;
  onTodayClick: () => void;
  onTomorrowClick: () => void;
  onNextWeekClick: () => void;
}

function Filter(props: IFilter) {
  const {
    onSearch,
    isFree,
    setIsFree,
    onTodayClick,
    onTomorrowClick,
    onNextWeekClick,
  } = props;

  return (
    <div className="flex flex-row items-center gap-6 p-4 bg-gray-50 shadow-md mb-10 mt-10 card-container2">
  {/* Campo di ricerca */}
  <div className="w-full md:w-full flex-1">
    <Search onSearch={onSearch} />
  </div>

  {/* Filtri */}
  <div className="flex flex-wrap  gap-4 mt-4 md:mt-0">
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
  </div>
</div>

  );
}

export default Filter;
