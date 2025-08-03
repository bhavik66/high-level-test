import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ChevronDown, Mail, Send, Sparkles } from 'lucide-react';

const MessageInput = () => {
  return (
    <div className="flex items-center gap-2 border-2 border-gray-200 rounded-lg bg-white w-full">
      {/* Message type dropdown */}
      <Button
        variant="ghost"
        size="lg"
        className="flex items-center gap-2 p-6 text-gray-600 hover:bg-gray-50 border-r"
      >
        <Mail className="w-8 h-8 text-blue-600" />
        <ChevronDown className="w-8 h-8" />
      </Button>

      {/* Message input field */}
      <Input
        type="text"
        placeholder="Type your message..."
        className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-2"
      />

      {/* Action buttons */}
      <div className="flex items-center gap-1 border-l px-2">
        <Button
          variant="ghost"
          size="lg"
          className="w-8 h-8 p-6 text-gray-500 hover:bg-gray-50"
        >
          <Sparkles className="w-8 h-8" />
        </Button>
        <Button
          size="lg"
          className="w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Send className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
