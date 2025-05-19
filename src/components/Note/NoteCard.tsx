// src/components/Note/NoteCard.tsx
import React from 'react';
import { Trash2, Star } from 'lucide-react';
import { Note } from '../../types/note';

export interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTagClick?: (tag: string) => void;
}

// Tag color mapping function with dark mode support
const getTagColor = (tag: string): string => {
  // Define tag colors with index signature for TypeScript
  const tagColors: {[key: string]: string} = {
    'work': 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100',
    'personal': 'bg-pink-100 text-pink-800 dark:bg-pink-700 dark:text-pink-100', 
    'inspiration': 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100',
    'inspo': 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100',
    'thoughts': 'bg-pink-100 text-pink-800 dark:bg-pink-700 dark:text-pink-100',
    'test': 'bg-pink-100 text-pink-800 dark:bg-pink-700 dark:text-pink-100',
  };
  
  if (tag in tagColors) {
    return tagColors[tag];
  }
  
  // Generate consistent color with dark mode support
  const defaultColors = [
    'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100',
    'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100',
    'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100',
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100',
    'bg-pink-100 text-pink-800 dark:bg-pink-700 dark:text-pink-100',
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-700 dark:text-indigo-100',
  ];
  
  const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % defaultColors.length;
  return defaultColors[index];
};

const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  onClick, 
  onDelete, 
  onToggleFavorite,
  onTagClick 
}) => {
  return (
    <div className={`note-card cursor-pointer ${note.favorite ? 'border-l-2 border-yellow-400' : ''}`} onClick={onClick}>
      <div className="flex justify-between items-start p-4">
        <div>
          <h3 className="title-medium">{note.title}</h3>
          <p className="text-secondary">Created just now</p>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(note.id);
            }}
            title={note.favorite ? "Remove from favorites" : "Add to favorites"}
            aria-label={note.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star 
              className={note.favorite ? "note-star-favorite" : "note-star-icon"} 
              fill={note.favorite ? "currentColor" : "none"} 
            />
          </button>
          
          <button 
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Delete this note?')) {
                onDelete(note.id);
              }
            }}
            title="Delete note"
            aria-label="Delete note"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {note.content && (
        <div className="px-4 pb-4">
          <p className="text-text-secondary dark:text-gray-300 line-clamp-2">{note.content}</p>
        </div>
      )}
      
      {/* Display tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1">
          {note.tags.map((tag, index) => (
            <span 
              key={index} 
              className={`${getTagColor(tag)} text-xs px-2 py-0.5 rounded-full cursor-pointer hover:opacity-90`}
              onClick={(e) => {
                e.stopPropagation();
                if (onTagClick) onTagClick(tag);
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteCard;