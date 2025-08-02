import {
  LayoutViewCard,
  LayoutViewCardContent,
  LayoutViewCardHeader,
} from '@/components/LayoutViewCard';
import NoteHeader from '@/features/notes/components/NoteHeader';
import NoteContent from '../NoteContent';

const NotesView = () => {
  return (
    <LayoutViewCard>
      <LayoutViewCardHeader>
        <NoteHeader />
      </LayoutViewCardHeader>
      <LayoutViewCardContent>
        <NoteContent />
      </LayoutViewCardContent>
    </LayoutViewCard>
  );
};

export default NotesView;
