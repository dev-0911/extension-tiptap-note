// src/components/Note/TagInput.tsx
import React, { useState, useRef } from 'react';
import { X, Tag as TagIcon } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  allTags?: string[];
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange, allTags = [] }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const tagText = inputValue.trim();
    const cleanTag = tagText.toLowerCase();

    if (cleanTag && !tags.includes(cleanTag)) {
      onChange([...tags, cleanTag]);
    }
    setInputValue('');
    inputRef.current?.focus();
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  // Get color for a tag with strong dark mode contrast
  const getTagColor = (tag: string): string => {
    const colors = [
      // Blue
      'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100',
      // Green
      'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100',
      // Purple
      'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100',
      // Red
      'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100',
      // Pink
      'bg-pink-100 text-pink-800 dark:bg-pink-700 dark:text-pink-100',
      // Indigo
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-700 dark:text-indigo-100',
    ];

    const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="relative">
      <div
        className="flex flex-wrap items-center gap-1 py-1"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center text-gray-400 dark:text-gray-500 text-xs">
          <TagIcon className="h-3 w-3 mr-1" />
        </div>

        {tags.map((tag, index) => (
          <div
            key={index}
            className={`flex items-center ${getTagColor(tag)} text-xs px-2 py-0.5 rounded-full`}
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="ml-1 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="h-2 w-2" />
            </button>
          </div>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) {
              addTag();
            }
          }}
          className="min-w-[80px] bg-transparent text-xs flex-grow dark:text-gray-200 outline-none"
          placeholder="To add tags press Enter..."
        />
      </div>
    </div>
  );
};

export default TagInput;