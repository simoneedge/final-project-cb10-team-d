import React, { Dispatch, SetStateAction } from 'react';
import Search from './Search';
import SwitchBox from './SwitchBox';
import Button from './Button';

interface IFilter {
  onSearch: (query: string) => void;
  isFree: boolean;
  setIsFree: Dispatch<SetStateAction<boolean>>;
  onTodayClick: () => void;
  onTomorrowClick: () => void;
  onNextWeekClick: () => void;
}

function Filter(props: IFilter) {
  const { onSearch, isFree, setIsFree, onTodayClick, onTomorrowClick, onNextWeekClick } = props;

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 ml-2 mb-10 mt-10">
      {/* Campo di ricerca */}
      <div className="w-full md:w-auto">
        <Search onSearch={onSearch} />
      </div>
      
      {/* Filtri */}
      <div className="flex flex-wrap md:flex-nowrap gap-4 mt-4 md:mt-0">
        <Button 
          label={'Oggi'}
          onClick={onTodayClick}
          className="flex items-center justify-between gap-3 px-3 py-2 border-2 border-rosso text-rosso bg-bianco hover:bg-rosso hover:text-bianco font-bold"
        />
        <Button
          label={'Domani'}
          onClick={onTomorrowClick}
          className="flex items-center justify-between gap-3 px-3 py-2 border-2 border-rosso text-rosso bg-bianco hover:bg-rosso hover:text-bianco font-bold"
        />
        <Button
          label={'Prossima settimana'}
          onClick={onNextWeekClick}
          className="flex items-center justify-between gap-3 px-3 py-2 border-2 border-rosso text-rosso bg-bianco hover:bg-rosso hover:text-bianco font-bold"
        />
        <SwitchBox
          label={'Gratis'}
          value={isFree}
          setValue={setIsFree} // Aggiorna lo stato booleano isFree
        />
      </div>
    </div>
  );
}

export default Filter;
