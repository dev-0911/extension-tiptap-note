// src/components/AppFooter.tsx
import React, { useState } from 'react';
import { Download, Trash2, Moon, Sun, Mail } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

interface AppFooterProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onExportNotes: () => void;
  onDeleteAllNotes: () => void;
}

const AppFooter: React.FC<AppFooterProps> = ({
  darkMode,
  onToggleDarkMode,
  onExportNotes,
  onDeleteAllNotes
}) => {
  const [showFeedback, setShowFeedback] = useState(false);

  const sendFeedbackEmail = () => {
    window.location.href = 'mailto:100extensions@gmail.com?subject=Note%20Pad%20Online%20Feedback';
  };
  
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-1 px-3 flex justify-between items-center z-10" style={{ height: '36px' }}>
        {/* Left side - note management */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExportNotes}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Export notes"
            aria-label="Export notes"
          >
            <Download className="h-4 w-4" />
          </button>
          
          <button
            onClick={onDeleteAllNotes}
            className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            title="Delete all notes"
            aria-label="Delete all notes"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        
        {/* Right side - app settings */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFeedback(true)} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-xs"
            title="Rate us"
          >
            Rate us
          </button>
          
          <button 
            onClick={sendFeedbackEmail}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="100extensions@gmail.com"
            aria-label="Email us at 100extensions@gmail.com"
          >
            <Mail className="h-4 w-4" />
          </button>
          
          <button 
            onClick={onToggleDarkMode}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </>
  );
};

export default AppFooter;