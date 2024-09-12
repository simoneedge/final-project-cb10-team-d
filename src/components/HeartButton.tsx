import React from 'react';

interface HeartButtonProps {
  color: string;
}

const HeartButton: React.FC<HeartButtonProps> = ({ color }) => {
  return (
    <button
      className="p-1"
      style={{ backgroundColor: color,
        marginTop: -10
       }} 
      title="Heart Button"
    >
      <svg
        className="w-4 h-4 text-white" 
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.344l1.172-1.172a4 4 0 115.656 5.656L10 18.828l-6.828-6.828a4 4 0 010-5.656z"></path>
      </svg>
    </button>
  );
};

export default HeartButton;