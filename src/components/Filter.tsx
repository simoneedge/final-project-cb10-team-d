import React, { Dispatch, SetStateAction } from 'react'
import Search from './Search'
import SwitchBox from './SwitchBox'
import Button from './Button'

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
        <div>
            <Search onSearch={onSearch} /> {/* Passa la funzione handleSearch */}
            <SwitchBox
                label={'Gratis'}
                value={isFree}
                setValue={setIsFree} // Aggiorna lo stato booleano isFree
            />
            <Button
                label={'oggi'}
                onClick={onTodayClick}
            />
            <Button
                label={'domani'}
                onClick={onTomorrowClick}
            />
            <Button
                label={'prossima settimana'}
                onClick={onNextWeekClick}
            />
        </div>
    )
}

export default Filter

