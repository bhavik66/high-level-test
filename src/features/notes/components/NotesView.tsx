import {
  LayoutViewCard,
  LayoutViewCardContent,
  LayoutViewCardHeader,
} from '@/shared/components/layout/LayoutViewCard';
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
