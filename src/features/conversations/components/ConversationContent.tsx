import conversationDataRaw from '@/assets/data/conversationData.json';
import type { ConversationData, Message } from '../types';
import EmailMessage from './EmailMessage';
import WhatsAppMessage from './WhatsAppMessage';

const MessageRenderer = ({ message }: { message: Message }) => {
  switch (message.type) {
    case 'email':
      return <EmailMessage message={message} />;
    case 'whatsapp':
      return <WhatsAppMessage message={message} />;
    default:
      return null;
  }
};

const ConversationContent = () => {
  const conversationData = conversationDataRaw as ConversationData;
  const { conversation } = conversationData;

  return (
    <div className="flex flex-col gap-6">
      {conversation.messages.map(message => (
        <MessageRenderer key={message.id} message={message} />
      ))}
    </div>
  );
};

export default ConversationContent;
