import {
  LayoutViewCard,
  LayoutViewCardContent,
  LayoutViewCardHeader,
} from '@/components/LayoutViewCard';
import NoteContent from './NoteContent';
import NoteHeader from './NoteHeader';

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
