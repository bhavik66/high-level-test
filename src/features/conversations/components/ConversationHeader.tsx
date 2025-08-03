import { Button } from '@/shared/components/ui/button';
import { ChevronDown, MessageCircleMore } from 'lucide-react';

const ConversationHeader = () => {
  return (
    <div className="flex items-center">
      <h1 className="flex gap-2 text-gray-700 font-semibold text-lg">
        <div className="flex items-center gap-2">
          <MessageCircleMore className="w-4 h-4" />
        </div>
        Conversations
      </h1>
      <Button variant="ghost" size="sm" className="rounded-full">
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ConversationHeader;
