// src/types/note.ts
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date; // Changed from Date | string to just Date
  updatedAt: Date; // Changed from Date | string to just Date
  tags?: string[];
  favorite?: boolean;
  trashed?: boolean;
  archived?: boolean;
  lastSavedAt?: string;
}

// Helper functions for serialization
export function serializeNote(note: Note): any {
  return {
    ...note,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

export function deserializeNote(obj: any): Note {
  return {
    ...obj,
    createdAt: new Date(obj.createdAt),
    updatedAt: new Date(obj.updatedAt),
  };
}

export function sortNotes(notes: Note[], order: "newest" | "oldest" = "newest"): Note[] {
  return notes.sort((a, b) => {
    return order === "newest" 
      ? b.updatedAt.getTime() - a.updatedAt.getTime() 
      : a.updatedAt.getTime() - b.updatedAt.getTime();
  });
}