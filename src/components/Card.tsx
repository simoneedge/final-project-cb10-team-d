
import React from 'react';



import ArrowButton from './ArrowButton';
import BookmarkButton from './BookmarkButton';
import HeartButton from './HeartButton';

interface CardProps {
  backgroundColor: string;
}

const Card: React.FC<CardProps> = ({ backgroundColor }) => {
  return (
    <div className="max-w-xs overflow-hidden shadow-lg relative">
      <div className="relative">
        <div className="clip-path-bottom">
          <img
            src="https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg"
            alt="Paste di mandorle"
            className="object-cover w-full h-[200px]"
          />
        </div>
        <div className="absolute top-2 right-2 flex space-x-2">
          <HeartButton color={backgroundColor} />
          <BookmarkButton color={backgroundColor} />
        </div>
      </div>
      <div
        className="diagonal-line-container p-3 text-white relative"
        style={{ backgroundColor }} 
      >
        <div className="diagonal-line-top"></div>
        <h2 className="text-[16px] font-titolo mt-4">Paste di mandorle</h2>
        <div className="absolute bottom-2 right-2">
          <ArrowButton />
        </div>
      </div>
    </div>
  );
};

export default Card;
