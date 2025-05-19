import React from 'react';

const NewNoteButton: React.FC = () => {
  return (
    <button 
      className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:text-gray-900 px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
      aria-label="Create new note"
    >
      <span>+</span>
      <span>New note</span>
    </button>
  );
};

export default NewNoteButton;