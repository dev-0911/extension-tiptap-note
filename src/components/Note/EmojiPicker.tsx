import React from 'react';

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const frequentEmojis = [
    '😊', '👍', '❤️', '⭐', '🎉',
    '🔥', '✅', '💡', '⚡', '📌',
    '🎯', '💪', '🚀', '💻', '📝',
    '⏰', '📅', '🎨', '🔍', '💭'
  ];

  return (
    <div className="absolute bottom-16 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-72 border dark:border-gray-700 z-50">
      <div className="grid grid-cols-5 gap-2">
        {frequentEmojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;