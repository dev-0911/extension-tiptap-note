import { Note } from '../types/note';

export const noteStorage = {
  async saveNote(note: Note): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set(
        { [`note_${note.id}`]: {
          ...note,
          createdAt: note.createdAt.toISOString(),
          updatedAt: note.updatedAt.toISOString(),
          tags: note.tags || [] // Ensure tags are always saved as an array
        }},
        () => resolve()
      );
    });
  },

  async getAllNotes(): Promise<Note[]> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(null, (items) => {
        const notes = Object.entries(items)
          .filter(([key]) => key.startsWith('note_'))
          .map(([_, value]) => ({
            ...value,
            createdAt: new Date(value.createdAt),
            updatedAt: new Date(value.updatedAt),
            tags: value.tags || [] // Ensure tags are always present as an array
          })) as Note[];
        resolve(notes.sort((a, b) => 
          b.updatedAt.getTime() - a.updatedAt.getTime()
        ));
      });
    });
  },

  async deleteNote(id: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.remove(`note_${id}`, () => resolve());
    });
  },

  async archiveNote(id: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(`note_${id}`, (items) => {
        const note = items[`note_${id}`] as Note;
        if (note) {
          note.archived = true;
          note.updatedAt = new Date();
          chrome.storage.sync.set(
            { [`note_${id}`]: note },
            () => resolve()
          );
        } else {
          resolve();
        }
      });
    });
  },

  async toggleFavorite(id: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(`note_${id}`, (items) => {
        const note = items[`note_${id}`] as any; // Use any to bypass TypeScript check temporarily
        if (note) {
          // Check if favorite exists, if not initialize it
          const isFavorite = typeof note.favorite === 'boolean' ? note.favorite : false;
          note.favorite = !isFavorite;
          
          // Don't update the updatedAt timestamp to preserve sort order
          
          chrome.storage.sync.set(
            { [`note_${id}`]: note },
            () => resolve()
          );
        } else {
          resolve();
        }
      });
    });
  },

  // Add a method to get all unique tags across notes
  async getAllTags(): Promise<string[]> {
    return new Promise((resolve) => {
      this.getAllNotes().then(notes => {
        const allTags = notes.reduce((tags, note) => {
          if (note.tags && Array.isArray(note.tags)) {
            return [...tags, ...note.tags];
          }
          return tags;
        }, [] as string[]);
        
        // Get unique tags without using Set spread
        const uniqueTagsMap: {[key: string]: boolean} = {};
        allTags.forEach(tag => {
          uniqueTagsMap[tag] = true;
        });
        
        // Convert to array and sort alphabetically
        const uniqueTags = Object.keys(uniqueTagsMap).sort();
        resolve(uniqueTags);
      });
    });
  },

  onChanged(callback: (changes: { [key: string]: chrome.storage.StorageChange }) => void) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'sync') {
        callback(changes);
      }
    });
  }
};