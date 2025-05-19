// src/components/Note/NoteEditor.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Smile, Download, Trash2, Copy, Check } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Note } from '../../types/note';
import { noteStorage } from '../../services/noteStorage';
import ExportDialog from './ExportDialog';
import EmojiPicker from './EmojiPicker';
import TagInput from './TagInput';
import RichTextEditor from './RichTextEditor';
import { useRichTextEditor } from './useRichTextEditor';

interface NoteEditorProps {
  note: Note | null;
  onBack: () => void;
  onDelete?: (id: string) => void;
  onSave?: (note: Note) => void;
  allAvailableTags?: string[]; // Available tags for suggestions
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onBack,
  onDelete,
  onSave,
  allAvailableTags = []
}) => {
  const initialTitle = note?.title || 'Untitled note';
  const initialContent = note?.content || '';
  const initialDate = useMemo(() => {
    if (!note?.createdAt) return new Date();
    return note.createdAt instanceof Date ? note.createdAt : new Date(note.createdAt);
  }, [note?.createdAt]);

  const [title, setTitle] = useState<string>(initialTitle);
  const [content, setContent] = useState<string>(initialContent);
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>(note?.lastSavedAt || "");
  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(
    initialContent.trim().split(/\s+/).filter(Boolean).length
  );
  const [charCount, setCharCount] = useState<number>(initialContent.length);
  const [timeAgo, setTimeAgo] = useState<string>(
    formatDistanceToNow(initialDate, { addSuffix: true })
  );
  // Add state for copy feedback
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Add state to check if this is a new note
  const isNewNote = useMemo(() => !note?.id, [note?.id]);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const [editorProps, editorActions] = useRichTextEditor()

  // Function to count words from HTML content
  const countWordsInHtml = (html: string): number => {
    // Create a temporary div to parse the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    // Get the text content and count words
    const text = tempDiv.textContent || '';
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Function to count characters from HTML content
  const countCharsInHtml = (html: string): number => {
    // Create a temporary div to parse the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    // Get the text content and count characters
    const text = tempDiv.textContent || '';
    return text.length;
  };

  // Save function
  const saveNote = async () => {
    if (!note) return;

    try {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const updatedNote: Note = {
        ...note,
        title,
        content,
        tags,
        createdAt: initialDate,
        updatedAt: now,
        lastSavedAt: timeString
      };

      await noteStorage.saveNote(updatedNote);
      onSave?.(updatedNote);
      setLastSavedTime(timeString);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  // Copy function
  const copyNoteContent = async () => {
    try {
      // Create a temporary div to parse the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const textContent = tempDiv.textContent || '';

      const textToCopy = `${title}\n\n${textContent}`;
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  useEffect(() => {
    setCharCount(countCharsInHtml(content));
    setWordCount(countWordsInHtml(content));

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaved(false);
    saveTimeoutRef.current = setTimeout(saveNote, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, content, tags]);

  useEffect(() => {
    const updateTimeAgo = () => {
      setTimeAgo(formatDistanceToNow(initialDate, { addSuffix: true }));
    };

    const interval = setInterval(updateTimeAgo, 60000);
    updateTimeAgo();

    return () => clearInterval(interval);
  }, [initialDate]);

  const handleExport = async (format: 'txt' | 'md' | 'json') => {
    try {
      // Create a temporary div to parse the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const textContent = tempDiv.textContent || '';

      let exportContent = '';
      switch (format) {
        case 'txt':
          exportContent = `${title}\n\n${textContent}`;
          break;
        case 'md':
          // For MD, we keep the HTML as it might contain markdown-compatible formatting
          exportContent = `# ${title}\n\n${content}`;
          if (tags.length > 0) {
            exportContent += `\n\nTags: ${tags.join(', ')}`;
          }
          break;
        case 'json':
          exportContent = JSON.stringify({
            title,
            content,
            tags,
            createdAt: initialDate.toISOString(),
            updatedAt: new Date().toISOString()
          }, null, 2);
          break;
      }

      const blob = new Blob([exportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };


  const handleAddEmoji = (emoji: string) => {
    // For rich text editor, we need to insert at cursor position
    // This is handled by the editor instance itself
    editorActions.insertContentToCursor(emoji)
    // if (window.confirm("Adding emojis directly into rich text might not work at the cursor position. Would you like to add it at the end of the content instead?")) {
    //   setContent(content + emoji);
    // }
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Compact header */}
      <header className="border-b border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center justify-between bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-bold w-full bg-transparent outline-none dark:text-white dark:placeholder-gray-400"
              placeholder="Untitled"
              ref={inputRef}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {timeAgo}
            </p>
          </div>
        </div>
      </header>

      {/* Main content area with z-index to ensure sticky toolbar works */}
      <main className="relative z-0 flex-1 pb-11 overflow-y-hidden bg-white dark:bg-gray-900 flex flex-col">
        <RichTextEditor
          content={content}
          onCreate={editorProps.onCreate}
          onDestroy={editorProps.onDestroy}
          onChange={setContent}
          className="mb-3"
          autoFocus={isNewNote} // Add autoFocus prop based on whether it's a new note
        />

        {/* Compact tags section */}
        <div className='px-3'>
          <TagInput
            tags={tags}
            onChange={setTags}
            allTags={allAvailableTags}
          />
        </div>
      </main>

      {/* Compact footer */}
      <footer className="z-10 fixed bottom-0 left-0 right-0 px-2 py-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          {/* Left side tools */}
          <div className="flex items-center">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Add emoji"
            >
              <Smile className="h-4 w-4" />
            </button>

            <button
              onClick={() => setShowExportDialog(true)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Export note"
            >
              <Download className="h-4 w-4" />
            </button>

            {/* Copy button */}
            <button
              onClick={copyNoteContent}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Copy note content"
              title="Copy note content"
            >
              {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </button>

            <button
              onClick={() => {
                if (note?.id && window.confirm('Delete this note?')) {
                  onDelete?.(note.id);
                  onBack();
                }
              }}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Delete note"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Right side - word count & status */}
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <span className="mx-1">{charCount}c</span>
              <span className="mx-1">{wordCount}w</span>
            </div>

            {isSaved ? (
              <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-300 px-1.5 py-0.5 rounded">
                Saved
              </span>
            ) : lastSavedTime && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Saved at {lastSavedTime}
              </span>
            )}

            {/* Copy feedback */}
            {isCopied && (
              <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-300 px-1.5 py-0.5 rounded">
                Copied!
              </span>
            )}
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      {showExportDialog && (
        <ExportDialog
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          onExport={handleExport}
        />
      )}

      {showEmojiPicker && (
        <EmojiPicker
          isOpen={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onSelect={(emoji) => {
            handleAddEmoji(emoji);
          }}
        />
      )}
    </div>
  );
};

export default NoteEditor;