import EmailMessage from './EmailMessage';
import WhatsAppMessage from './WhatsAppMessage';

const ConversationContent = () => {
  return (
    <div className="flex flex-col gap-6">
      <EmailMessage />
      <WhatsAppMessage />
      <EmailMessage />
    </div>
  );
};

export default ConversationContent;
