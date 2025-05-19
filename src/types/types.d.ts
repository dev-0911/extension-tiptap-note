// src/types/types.d.ts

interface Window {
  webkitAudioContext: typeof AudioContext;
}

// Add Tiptap related types
declare module '@tiptap/extension-image' {
  import { Node } from '@tiptap/core';
  
  export interface ImageOptions {
    inline: boolean;
    allowBase64: boolean;
  }
  
  const Image: Node<ImageOptions>;
  export default Image;
}

declare module '@tiptap/extension-task-list' {
  import { Node } from '@tiptap/core';
  
  const TaskList: Node;
  export default TaskList;
}

declare module '@tiptap/extension-task-item' {
  import { Node } from '@tiptap/core';
  
  export interface TaskItemOptions {
    nested: boolean;
  }
  
  const TaskItem: Node<TaskItemOptions>;
  export default TaskItem;
}

declare module '@tiptap/extension-text-align' {
  import { Extension } from '@tiptap/core';
  
  export interface TextAlignOptions {
    types: string[];
    alignments: string[];
  }
  
  const TextAlign: Extension<TextAlignOptions>;
  export default TextAlign;
}

declare module '@tiptap/extension-typography' {
  import { Extension } from '@tiptap/core';
  
  const Typography: Extension;
  export default Typography;
}