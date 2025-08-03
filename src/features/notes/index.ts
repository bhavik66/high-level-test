// Notes feature barrel export
export { NotesService, notesService } from './api/NotesService';
export type { FetchNotesParams, NotesPage } from './api/NotesService';
export { default as NotesView, default } from './components/NotesView';
export { generateNotes } from './data/generateNotes';
export type { NoteData, NoteTagType } from './type';
