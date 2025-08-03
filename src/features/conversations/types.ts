export interface MessageSender {
  name: string;
  initials: string;
  avatar: string;
}

export interface EmailContent {
  greeting: string;
  title: string;
  body: string;
  actionText: string;
}

export interface WhatsAppContent {
  text: string;
}

export interface BaseMessage {
  id: string;
  sender: MessageSender;
  timestamp: string;
}

export interface EmailMessage extends BaseMessage {
  type: 'email';
  recipient: string;
  subject: string;
  content: EmailContent;
  threadCount: number;
  isStarred: boolean;
}

export interface WhatsAppMessage extends BaseMessage {
  type: 'whatsapp';
  content: WhatsAppContent;
}

export type Message = EmailMessage | WhatsAppMessage;

export interface Conversation {
  id: string;
  participantName: string;
  messages: Message[];
}

export interface ConversationData {
  conversation: Conversation;
}

// API pagination types
export interface MessagesPage {
  messages: Message[];
  nextOffset: number;
  hasMore: boolean;
  total: number;
  conversationId: string;
}

export interface FetchMessagesParams {
  conversationId?: string;
  limit?: number;
  offset?: number;
}
