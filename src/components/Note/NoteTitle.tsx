import React, { useState } from 'react';

const NoteTitle: React.FC = () => {
  const [title, setTitle] = useState('');
  
  return (
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Click here to edit the title"
      className="w-full text-xl font-semibold outline-none dark:bg-transparent dark:text-white dark:placeholder-gray-400"
    />
  );
};

export default NoteTitle;