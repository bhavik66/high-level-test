import ConversationContent from '@/features/conversations/components/ConversationContent';
import ConversationFooter from '@/features/conversations/components/ConversationFooter';
import ConversationHeader from '@/features/conversations/components/ConversationHeader';
import {
  FeatureCard,
  FeatureCardContent,
  FeatureCardFooter,
  FeatureCardHeader,
} from '@/shared/components/containers';

const ConversationsView = () => {
  return (
    <FeatureCard>
      <FeatureCardHeader>
        <ConversationHeader />
      </FeatureCardHeader>
      <FeatureCardContent>
        <ConversationContent />
      </FeatureCardContent>
      <FeatureCardFooter>
        <ConversationFooter />
      </FeatureCardFooter>
    </FeatureCard>
  );
};

export default ConversationsView;
