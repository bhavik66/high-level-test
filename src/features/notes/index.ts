// Notes feature barrel export
export { fetchNotesPage, searchNotesPage } from './api/notesApi';
export type { NotesPage } from './api/notesApi';
export { default as NotesView, default } from './components/NotesView';
export { generateNotes } from './data/generateNotes';
export type { NoteData, NoteTagType } from './type';
