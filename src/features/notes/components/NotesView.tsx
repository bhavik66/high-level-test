import {
  FeatureCard,
  FeatureCardContent,
  FeatureCardHeader,
} from '@/shared/components/containers';
import NoteContent from './NoteContent';
import NoteHeader from './NoteHeader';

const NotesView = () => {
  return (
    <FeatureCard>
      <FeatureCardHeader>
        <NoteHeader />
      </FeatureCardHeader>
      <FeatureCardContent>
        <NoteContent />
      </FeatureCardContent>
    </FeatureCard>
  );
};

export default NotesView;
