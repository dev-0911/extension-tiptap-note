import React, { useState, useRef, useEffect } from 'react';

interface NoteMenuProps {
  onArchive?: () => void;
  onDelete?: () => void;
  onMoveToVideo?: () => void;
  onOpenInApp?: () => void;
  onShare?: () => void;
}

const NoteMenu: React.FC<NoteMenuProps> = ({
  onArchive,
  onDelete,
  onMoveToVideo,
  onOpenInApp,
  onShare,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    {
      label: 'Move to another video',
      icon: '⇄',
      onClick: onMoveToVideo,
    },
    {
      label: 'Open in app',
      icon: '↗️',
      onClick: onOpenInApp,
    },
    {
      label: 'Share',
      icon: '↗',
      onClick: onShare,
    },
    {
      label: 'Archive',
      icon: '📥',
      onClick: onArchive,
    },
    {
      label: 'Delete',
      icon: '🗑',
      onClick: onDelete,
      className: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        aria-label="Note options"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          className="text-gray-600 dark:text-gray-300"
        >
          <circle cx="12" cy="6" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="18" r="2" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
          <div className="text-lg font-semibold px-4 py-2 border-b dark:border-gray-700 dark:text-white">
            Note Options
          </div>
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick?.();
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 flex items-center gap-3 transition-colors ${item.className || ''}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteMenu;