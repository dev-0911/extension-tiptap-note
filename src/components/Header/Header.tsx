import React from 'react';
import NewNoteButton from './NewNoteButton';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="text-xl font-semibold dark:text-white">Quick Notes</div>
      <NewNoteButton />
      <button 
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors dark:text-gray-300"
        aria-label="Menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>
    </header>
  );
};

export default Header;