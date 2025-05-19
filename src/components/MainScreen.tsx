// src/components/MainScreen.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Star, Filter, X } from 'lucide-react';
import NoteCard from './Note/NoteCard';
import NoteEditor from './Note/NoteEditor';
import ExportDialog from './Note/ExportDialog';
import AppFooter from './AppFooter';
import { Note } from '../types/note';
import { noteStorage } from '../services/noteStorage';

const MainScreen: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    loadNotes();
    
    noteStorage.onChanged(() => {
      loadNotes();
    });
    
    // Check for saved preferences
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    setDarkMode(savedDarkMode);
    setCurrentLanguage(savedLanguage);
  }, []);

  const loadNotes = async () => {
    const loadedNotes = await noteStorage.getAllNotes();
    setNotes(loadedNotes);
  };

  const createNewNote = async () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      favorite: false
    };
    await noteStorage.saveNote(newNote);
    await loadNotes();
    setCurrentNote(newNote);
    setIsEditing(true);
  };

  const handleDeleteNote = async (id: string) => {
    await noteStorage.deleteNote(id);
    await loadNotes();
    setIsEditing(false);
  };

  const handleSaveNote = async (updatedNote: Note) => {
    await noteStorage.saveNote(updatedNote);
    await loadNotes();
  };

  const handleToggleFavorite = async (id: string) => {
    await noteStorage.toggleFavorite(id);
    await loadNotes();
  };

  const handleExportAllNotes = (format: 'txt' | 'md' | 'json') => {
    try {
      let exportContent = '';
      const timestamp = new Date().toISOString().split('T')[0];

      switch (format) {
        case 'txt':
          exportContent = notes.map(note => 
            `${note.title}\n\n${note.content}\n\n---\n`
          ).join('\n');
          break;
        case 'md':
          exportContent = notes.map(note => 
            `# ${note.title}\n\n${note.content}\n\n---\n`
          ).join('\n');
          break;
        case 'json':
          exportContent = JSON.stringify(notes, null, 2);
          break;
      }

      const blob = new Blob([exportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notes-${timestamp}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setShowExportDialog(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
  };

  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('language', langCode);
  };

  // Get all unique tags from notes
  const getAllTags = () => {
    const tagSet = new Set<string>();
    notes.forEach(note => {
      if (note.tags && Array.isArray(note.tags) && note.tags.length > 0) {
        note.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  };

  const toggleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  if (isEditing) {
    return (
      <NoteEditor 
        note={currentNote}
        onBack={() => setIsEditing(false)}
        onDelete={handleDeleteNote}
        onSave={handleSaveNote}
      />
    );
  }

  const allTags = getAllTags();

  const filteredNotes = notes
    .filter(note => 
      // Text search filter
      (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())) &&
      // Favorites filter
      (!showOnlyFavorites || note.favorite) &&
      // Tags filter - show notes with at least one of the selected tags
      (selectedTags.length === 0 || (note.tags && note.tags.length > 0 && selectedTags.some(tag => note.tags!.includes(tag))))
    )
    .sort((a, b) => 
      (b.updatedAt instanceof Date ? b.updatedAt : new Date(b.updatedAt)).getTime() - 
      (a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt)).getTime()
    );

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Condensed header */}
      <header className="flex-none py-2 px-3 border-b border-[#E5E7EB] bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-2 w-full max-w-3xl mx-auto">
          <div className="flex-1 flex items-center gap-2 bg-[#F9FAFB] dark:bg-gray-700 rounded-md px-2 border border-[#E5E7EB] dark:border-gray-600">
            <input
              type="search"
              placeholder="Search notes..."
              className="py-1.5 flex-1 bg-transparent border-none outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <button
              className={`p-1 rounded-md transition-colors ${showOnlyFavorites ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              title={showOnlyFavorites ? "Show all notes" : "Show only favorites"}
              aria-label={showOnlyFavorites ? "Show all notes" : "Show only favorites"}
            >
              <Star className="h-4 w-4" fill={showOnlyFavorites ? "currentColor" : "none"} />
            </button>
            
            {/* Filter button */}
            <button
              className={`p-1 rounded-md transition-colors ${selectedTags.length > 0 ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              onClick={() => setShowTagFilter(!showTagFilter)}
              title="Filter by tags"
              aria-label="Filter by tags"
            >
              <Filter className="h-4 w-4" />
              {selectedTags.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-xs">
                  {selectedTags.length}
                </span>
              )}
            </button>
          </div>
          
          <button 
            className="flex-none p-2 bg-[#90D8B2] hover:bg-[#7BC09A] text-white rounded-md dark:text-white"
            onClick={createNewNote}
            title="Create new note"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Tag filter panel */}
      {showTagFilter && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-2 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Filter</h3>
              <button 
                onClick={() => setShowTagFilter(false)}
                className="text-gray-500 dark:text-gray-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Selected tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedTags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                  >
                    {tag}
                    <button 
                      onClick={() => toggleTagFilter(tag)}
                      className="text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {selectedTags.length > 0 && (
                  <button 
                    onClick={() => setSelectedTags([])}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}
            
            {/* All available tags */}
            <div className="flex flex-wrap gap-1">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTagFilter(tag)}
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
              
              {allTags.length === 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">No tags found</span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="main-content">
        <div className="max-w-3xl mx-auto">
          {showOnlyFavorites && (
            <div className="py-2 px-4 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-md mb-4 flex items-center">
              <Star className="h-4 w-4 mr-2" fill="currentColor" />
              <span>Showing favorite notes only</span>
              <button 
                className="ml-auto text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100"
                onClick={() => setShowOnlyFavorites(false)}
              >
                Show all
              </button>
            </div>
          )}

          <div className="notes-container">
            {filteredNotes.map(note => (
              <NoteCard 
                key={note.id} 
                note={note}
                onDelete={handleDeleteNote}
                onToggleFavorite={handleToggleFavorite}
                onClick={() => {
                  setCurrentNote({
                    ...note,
                    createdAt: note.createdAt instanceof Date ? note.createdAt : new Date(note.createdAt),
                    updatedAt: note.updatedAt instanceof Date ? note.updatedAt : new Date(note.updatedAt)
                  });
                  setIsEditing(true);
                }}
                onTagClick={(tag) => {
                  if (!selectedTags.includes(tag)) {
                    setSelectedTags([...selectedTags, tag]);
                    setShowTagFilter(true);
                  }
                }}
              />
            ))}

            {filteredNotes.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {showOnlyFavorites 
                  ? "No favorite notes yet. Mark notes as favorite to see them here."
                  : selectedTags.length > 0
                    ? "No notes found with the selected tags."
                    : "No notes found. Create your first note using the '+' button."}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* App Footer */}
      {notes.length > 0 && (
        <AppFooter
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onExportNotes={() => setShowExportDialog(true)}
          onDeleteAllNotes={async () => {
            if (window.confirm('Delete all notes?')) {
              await Promise.all(notes.map(note => noteStorage.deleteNote(note.id)));
              await loadNotes();
            }
          }}
        />
      )}

      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExportAllNotes}
      />
    </div>
  );
};

export default MainScreen;