// src/components/Note/NoteContent.tsx
import React from 'react';
import RichTextEditor from './RichTextEditor';

interface NoteContentProps {
  initialContent: string;
  onContentChange: (content: string) => void;
  onWordCountChange: (count: number) => void;
  onCharCountChange: (count: number) => void;
  autoFocus?: boolean; // Add this prop
}

const NoteContent: React.FC<NoteContentProps> = ({
  initialContent,
  onContentChange,
  onWordCountChange,
  onCharCountChange,
  autoFocus = false // Add default value
}) => {
  const handleEditorChange = (html: string) => {
    onContentChange(html);
    
    // Calculate word count (strip HTML tags and count words)
    const text = html.replace(/<[^>]*>/g, ' ').trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    onWordCountChange(wordCount);
    
    // Calculate character count (strip HTML tags)
    const charCount = text.length;
    onCharCountChange(charCount);
  };

  return (
    <RichTextEditor
      content={initialContent}
      onChange={handleEditorChange}
      className="w-full"
      autoFocus={autoFocus} // Pass the autoFocus prop
    />
  );
};

export default NoteContent;