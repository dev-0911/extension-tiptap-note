// src/components/Note/NoteTools.tsx
import React, { useState } from 'react';

interface NoteToolsProps {
  onEmojiSelect?: (emoji: string) => void;
  onTagAdd?: () => void;
  onTimeAdd?: () => void;
  onTemplateAdd?: () => void;
  onScreenshotAdd?: () => void;
  wordCount?: number;
  charCount?: number;
}

const NoteTools: React.FC<NoteToolsProps> = ({
  onEmojiSelect,
  onTagAdd,
  onTimeAdd,
  onTemplateAdd,
  onScreenshotAdd,
  wordCount,
  charCount
}) => {
  const [showAITools, setShowAITools] = useState(false);

  const tools = [
    {
      icon: "😊",
      label: "Add emoji",
      onClick: () => onEmojiSelect?.("😊"),
    },
    {
      icon: "🏷️",
      label: "Add tag",
      onClick: onTagAdd,
    },
    {
      icon: "⏰",
      label: "Add timestamp",
      onClick: onTimeAdd,
    },
    {
      icon: "📄",
      label: "Add template",
      onClick: onTemplateAdd,
    }
  ];

  return (
    <div className="flex justify-between items-center border-t dark:border-gray-700 pt-2 pb-1 px-2 text-xs">
      <div className="flex">
        {tools.map((tool, index) => (
          <button
            key={index}
            onClick={tool.onClick}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors mr-1"
            title={tool.label}
          >
            <span className="text-base">{tool.icon}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {(charCount !== undefined || wordCount !== undefined) && (
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            {charCount !== undefined && <span>{charCount}c</span>}
            {wordCount !== undefined && <span>{wordCount}w</span>}
          </div>
        )}
        
        <button
          onClick={() => setShowAITools(!showAITools)}
          className="px-2 py-1 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-full hover:opacity-90 transition-opacity flex items-center gap-1 text-xs"
        >
          <span>✨</span>
          <span>AI</span>
        </button>
      </div>
    </div>
  );
};

export default NoteTools;