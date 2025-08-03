import { generateNotes } from '../data/generateNotes';
import type { NoteData } from '../type';

// Generate all notes once to simulate a database
const ALL_NOTES = generateNotes(100); // Production-ready number of notes

export interface NotesPage {
  notes: NoteData[];
  nextOffset: number;
  hasMore: boolean;
  total: number;
}

/**
 * Mock API function to fetch paginated notes
 * @param limit - Number of notes to fetch per page
 * @param offset - Starting index for pagination
 * @returns Promise with paginated notes data
 */
export async function fetchNotesPage(
  limit: number = 20,
  offset: number = 0
): Promise<NotesPage> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

  // Simulate occasional network errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Network error: Failed to fetch notes');
  }

  const startIndex = offset * limit;
  const endIndex = startIndex + limit;
  const notes = ALL_NOTES.slice(startIndex, endIndex);
  const hasMore = endIndex < ALL_NOTES.length;

  return {
    notes,
    nextOffset: offset + 1,
    hasMore,
    total: ALL_NOTES.length,
  };
}

/**
 * Mock API function to search notes with pagination
 * @param query - Search query string
 * @param limit - Number of notes to fetch per page
 * @param offset - Starting index for pagination
 * @returns Promise with filtered paginated notes data
 */
export async function searchNotesPage(
  query: string,
  limit: number = 20,
  offset: number = 0
): Promise<NotesPage> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));

  const filteredNotes = ALL_NOTES.filter(
    note =>
      note.content.toLowerCase().includes(query.toLowerCase()) ||
      note.timestamp.toLowerCase().includes(query.toLowerCase())
  );

  const startIndex = offset * limit;
  const endIndex = startIndex + limit;
  const notes = filteredNotes.slice(startIndex, endIndex);
  const hasMore = endIndex < filteredNotes.length;

  return {
    notes,
    nextOffset: offset + 1,
    hasMore,
    total: filteredNotes.length,
  };
}
