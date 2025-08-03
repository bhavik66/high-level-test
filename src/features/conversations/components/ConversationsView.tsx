import {
  FeatureCard,
  FeatureCardContent,
  FeatureCardFooter,
  FeatureCardHeader,
} from '@/components/containers';
import ConversationContent from '@/features/conversations/components/ConversationContent';
import ConversationFooter from '@/features/conversations/components/ConversationFooter';
import ConversationHeader from '@/features/conversations/components/ConversationHeader';

const ConversationsView = () => {
  return (
    <FeatureCard>
      <FeatureCardHeader>
        <ConversationHeader />
      </FeatureCardHeader>
      <FeatureCardContent scrollable={false}>
        <ConversationContent />
      </FeatureCardContent>
      <FeatureCardFooter>
        <ConversationFooter />
      </FeatureCardFooter>
    </FeatureCard>
  );
};

export default ConversationsView;
