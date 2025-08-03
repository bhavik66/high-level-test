// Conversations feature barrel export
export {
  default as ConversationsView,
  default,
} from './components/ConversationsView';

// Export API service
export { conversationService } from './api/ConversationService';

// Export types
export type {
  Conversation,
  ConversationData,
  EmailContent,
  EmailMessage,
  FetchMessagesParams,
  Message,
  MessageSender,
  MessagesPage,
  WhatsAppContent,
  WhatsAppMessage,
} from './types';
