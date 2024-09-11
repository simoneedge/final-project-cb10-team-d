'use client';

import React from 'react';
import ArrowButton from './ArrowButton';
import BookmarkButton from './BookmarkButton';
import HeartButton from './HeartButton';

interface CardProps {
  backgroundColor: string;
  title: string;
  imageSrc: string;
  onArrowClick?: () => void;
  size?: 'small' | 'large'; 
}

const Card: React.FC<CardProps> = ({ backgroundColor, title, imageSrc, onArrowClick, size = 'small' }) => {
  const sizeClasses = size === 'large' ? 'max-w-md h-[300px]' : 'max-w-xs h-[200px]';

  return (
    <div className={`overflow-hidden shadow-lg relative ${size === 'large' ? 'max-w-md' : 'max-w-xs'}`}>
      <div className="relative">
        <div className="clip-path-bottom">
          <img
            src={imageSrc}
            alt={title}
            className={`object-cover w-full ${sizeClasses}`} 
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
        <h2 className="text-[16px] font-titolo mt-4">{title}</h2>
        <div className="absolute bottom-2 right-2 cursor-pointer" onClick={onArrowClick}>
          <ArrowButton />
        </div>
      </div>
    </div>
  );
};

export default Card;
