import ConversationContent from '@/features/conversations/components/ConversationContent';
import ConversationFooter from '@/features/conversations/components/ConversationFooter';
import ConversationHeader from '@/features/conversations/components/ConversationHeader';
import {
  LayoutViewCard,
  LayoutViewCardContent,
  LayoutViewCardFooter,
  LayoutViewCardHeader,
} from '@/shared/components/layout/LayoutViewCard';

const ConversationsView = () => {
  return (
    <LayoutViewCard>
      <LayoutViewCardHeader>
        <ConversationHeader />
      </LayoutViewCardHeader>
      <LayoutViewCardContent>
        <ConversationContent />
      </LayoutViewCardContent>
      <LayoutViewCardFooter>
        <ConversationFooter />
      </LayoutViewCardFooter>
    </LayoutViewCard>
  );
};

export default ConversationsView;
