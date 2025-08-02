import { Button } from '@/components/ui/button';
import { ChevronDown, MessageCircleMore } from 'lucide-react';

const ConversationHeader = () => {
  return (
    <div>
      <Button
        variant="ghost"
        className="flex gap-2 px-3 py-2 h-auto text-gray-700 hover:bg-gray-50 font-semibold text-lg self-start"
        size="lg"
      >
        <MessageCircleMore className="w-8 h-8" />
        Conversations
        <ChevronDown className="w-8 h-8" />
      </Button>
    </div>
  );
};

export default ConversationHeader;
