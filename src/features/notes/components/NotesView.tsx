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
      <FeatureCardContent scrollable={false}>
        <NoteContent />
      </FeatureCardContent>
    </FeatureCard>
  );
};

export default NotesView;
