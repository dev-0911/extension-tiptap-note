// src/components/Note/RichTextEditor.tsx
import React, { useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import Strike from '@tiptap/extension-strike';
import Heading from '@tiptap/extension-heading';
import { EditorToolbar } from './EditorToolbar';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  className?: string;
  autoFocus?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  className = '',
  autoFocus = false,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'rounded-md bg-gray-100 dark:bg-gray-800 p-4 font-mono text-sm text-gray-800 dark:text-gray-200',
          },
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Start writing your note...',
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Typography,
      Link.configure({
        openOnClick: false,
      }),
      CodeBlock,
      Strike,
      Heading, // Make sure Heading extension is included here as well
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    autofocus: autoFocus,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (autoFocus && editor && !editor.isFocused) {
      setTimeout(() => {
        editor.commands.focus();
      }, 100);
    }
  }, [autoFocus, editor]);

  const handleImageUpload = (file: File) => {
    if (!editor) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        editor.chain().focus().setImage({ src: e.target.result }).run();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <EditorToolbar editor={editor as Editor} onImageUpload={handleImageUpload} />
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none tiptap-editor border border-gray-200 dark:border-gray-700 rounded-md p-3 min-h-[150px] bg-white dark:bg-gray-900 focus:outline-none"
      />
    </div>
  );
};

export default RichTextEditor;