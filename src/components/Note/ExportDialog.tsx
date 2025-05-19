import React from 'react';
import { FileText, FileJson, FileCode } from 'lucide-react';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'txt' | 'md' | 'json') => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose, onExport }) => {
  if (!isOpen) return null;

  const formats = [
    { id: 'txt' as const, label: 'Text File (.txt)', icon: FileText },
    { id: 'md' as const, label: 'Markdown (.md)', icon: FileCode },
    { id: 'json' as const, label: 'JSON (.json)', icon: FileJson },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96">
        <div className="px-4 py-3 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold dark:text-white">Export Note</h2>
        </div>
        
        <div className="p-4">
          {formats.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                onExport(id);
                onClose();
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg dark:text-gray-200"
            >
              <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span>{label}</span>
            </button>
          ))}
        </div>
        
        <div className="px-4 py-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;