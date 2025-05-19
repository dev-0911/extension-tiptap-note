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
import { useExtensions } from './extensions';

interface RichTextEditorProps {
  content: string;
  onCreate?: (editor: Editor) => void;
  onDestroy?: () => void;
  onChange: (html: string) => void;
  className?: string;
  autoFocus?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onCreate,
  onDestroy,
  onChange,
  className = '',
  autoFocus = false,
}) => {
  const extensions = useExtensions()
  const editor = useEditor({
    extensions,
    content,
    onCreate: ({ editor }) => {
      onCreate?.(editor)
      editor?.commands.focus()
    },
    onDestroy: () => {
      onDestroy?.();
    },
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
    <div className={`flex-1 flex flex-col overflow-hidden ${className}`}>
      <EditorToolbar editor={editor as Editor} onImageUpload={handleImageUpload} />
      <div className="editor">
        <EditorContent
          editor={editor}
          className="editor-content prose prose-sm dark:prose-invert"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;