import React from 'react';

interface BookmarkButtonProps {
  color: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ color }) => {
  return (
    <button
      className="p-1"
      style={{ backgroundColor: color,
        marginTop: -10 }}
      title="Bookmark Button"
    >
      <svg
        className="w-4 h-4 text-white" 
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 3a2 2 0 00-2 2v12a1 1 0 001.555.832l5.445-3.257 5.445 3.257A1 1 0 0017 17V5a2 2 0 00-2-2H5z"></path>
      </svg>
    </button>
  );
};

export default BookmarkButton;