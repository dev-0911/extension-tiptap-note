import React, { useRef } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold, Italic, Strikethrough, Underline, Code,
  Heading1, Heading2, Heading3,
  List, ListOrdered, ListChecks,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Image, Link, Unlink,
  RotateCcw, RotateCw
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
  onImageUpload?: (file: File) => void;
}

// Define the Level type explicitly (common practice in TipTap)
type Level = 1 | 2 | 3 | 4 | 5 | 6;

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor, onImageUpload }) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const buttonClass = (active: boolean, disabled = false) =>
    `p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
      active ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  const divider = (
    <div className="h-6 w-px bg-gray-200 dark:bg-gray-600 mx-1" />
  );

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length && onImageUpload) {
      onImageUpload(e.target.files[0]);
      e.target.value = '';
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetMark('link').run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setMark('link', { href: url }).run();
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetMark('link').run();
  };

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 flex flex-wrap items-center gap-1 py-2 px-2 border-b border-gray-200 dark:border-gray-700">
      {/* Text formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive('bold'), !editor.can().chain().focus().toggleBold().run())}
        aria-label="Bold"
        title="Bold"
      >
        <Bold size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive('italic'), !editor.can().chain().focus().toggleItalic().run())}
        aria-label="Italic"
        title="Italic"
      >
        <Italic size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive('strike'), !editor.can().chain().focus().toggleStrike().run())}
        aria-label="Strikethrough"
        title="Strikethrough"
      >
        <Strikethrough size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive('underline'), !editor.can().chain().focus().toggleUnderline().run())}
        aria-label="Underline"
        title="Underline"
      >
        <Underline size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={buttonClass(editor.isActive('code'), !editor.can().chain().focus().toggleCode().run())}
        aria-label="Inline Code"
        title="Inline Code"
      >
        <Code size={18} />
      </button>

      {divider}

      {/* Headings Dropdown */}
      <select
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run();
          } else {
            const level = parseInt(value, 10) as Level;
            editor.chain().focus().setHeading({ level }).run();
          }
        }}
        value={editor.isActive('heading', { level: 1 }) ? '1' : editor.isActive('heading', { level: 2 }) ? '2' : editor.isActive('heading', { level: 3 }) ? '3' : 'paragraph'}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
      >
        <option value="paragraph">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>

      {divider}

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive('bulletList'), !editor.can().chain().focus().toggleBulletList().run())}
        aria-label="Bullet List"
        title="Bullet List"
      >
        <List size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive('orderedList'), !editor.can().chain().focus().toggleOrderedList().run())}
        aria-label="Ordered List"
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={buttonClass(editor.isActive('taskList'))}
        aria-label="Task List"
        title="Task List"
      >
        <ListChecks size={18} />
      </button>

      {divider}

      {/* Text alignment */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={buttonClass(editor.isActive({ textAlign: 'left' }))}
        aria-label="Align Left"
        title="Align Left"
      >
        <AlignLeft size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={buttonClass(editor.isActive({ textAlign: 'center' }))}
        aria-label="Align Center"
        title="Align Center"
      >
        <AlignCenter size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={buttonClass(editor.isActive({ textAlign: 'right' }))}
        aria-label="Align Right"
        title="Align Right"
      >
        <AlignRight size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={buttonClass(editor.isActive({ textAlign: 'justify' }))}
        aria-label="Justify"
        title="Justify"
      >
        <AlignJustify size={18} />
      </button>

      {divider}

      {/* Media and links */}
      <button
        onClick={handleImageClick}
        className={buttonClass(false)}
        aria-label="Insert Image"
        title="Insert Image"
      >
        <Image size={18} />
      </button>
      <input
        type="file"
        ref={imageInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageInputChange}
      />

      <button
        onClick={setLink}
        className={buttonClass(editor.isActive('link'))}
        aria-label="Insert Link"
        title="Insert Link"
      >
        <Link size={18} />
      </button>

      {editor.isActive('link') && (
        <button
          onClick={removeLink}
          className={buttonClass(false)}
          aria-label="Remove Link"
          title="Remove Link"
        >
          <Unlink size={18} />
        </button>
      )}

      {divider}

      {/* Undo/Redo */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={buttonClass(false, !editor.can().chain().focus().undo().run())}
        aria-label="Undo"
        title="Undo"
      >
        <RotateCcw size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={buttonClass(false, !editor.can().chain().focus().redo().run())}
        aria-label="Redo"
        title="Redo"
      >
        <RotateCw size={18} />
      </button>
    </div>
  );
};