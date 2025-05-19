// src/components/FeedbackModal.tsx
import React from 'react';
import { X } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="feedback-modal" onClick={onClose}>
      <div className="feedback-content" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your feedback is valuable for us:</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex justify-around mt-4">
          <button className="feedback-option" title="Disappointed" onClick={onClose}>
            <span className="text-3xl">😔</span>
          </button>
          <button className="feedback-option" title="Neutral" onClick={onClose}>
            <span className="text-3xl">😐</span>
          </button>
          <button className="feedback-option" title="Happy" onClick={onClose}>
            <span className="text-3xl">😄</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;