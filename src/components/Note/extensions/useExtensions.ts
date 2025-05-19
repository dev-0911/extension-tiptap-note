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

export const useExtensions = () => {
    return [
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
            HTMLAttributes: {
                rel: null,
            }
        }),
        CodeBlock,
        Strike,
        Heading, // Make sure Heading extension is included here as well
    ]
}
