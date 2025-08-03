// Enhanced conversation data generator for production-like API responses

const PARTICIPANTS = [
  {
    name: 'Olivia Johnson',
    initials: 'OJ',
    avatar: 'https://avatar.iran.liara.run/public/1',
  },
  {
    name: 'Alex Chen',
    initials: 'AC',
    avatar: 'https://avatar.iran.liara.run/public/2',
  },
  {
    name: 'Maria Rodriguez',
    initials: 'MR',
    avatar: 'https://avatar.iran.liara.run/public/3',
  },
  {
    name: 'John Smith',
    initials: 'JS',
    avatar: 'https://avatar.iran.liara.run/public/boy',
  },
  {
    name: 'Sarah Wilson',
    initials: 'SW',
    avatar: 'https://avatar.iran.liara.run/public/4',
  },
  {
    name: 'David Kim',
    initials: 'DK',
    avatar: 'https://avatar.iran.liara.run/public/5',
  },
];

const EMAIL_SUBJECTS = [
  'Re: Order confirmation and tracking details',
  'Follow up on our meeting discussion',
  'Project update and next steps',
  'Invoice #12345 for your recent purchase',
  'Welcome to our platform!',
  'Security alert: New login detected',
  'Your subscription renewal reminder',
  "Meeting notes from today's call",
  'Quarterly business review summary',
  'New feature announcement',
  'Support ticket #67890 resolved',
  'Weekly team sync updates',
];

const EMAIL_GREETINGS = [
  'Hi there,',
  'Hello',
  'Hey',
  'Good morning',
  'Good afternoon',
  "Hope you're doing well,",
];

const EMAIL_TITLES = [
  'Your order has been shipped!',
  'Thanks for your feedback',
  'Meeting rescheduled',
  'Project milestone completed',
  'Account verification required',
  'Payment processed successfully',
  'New message from support',
  'Weekly report available',
];

const EMAIL_BODIES = [
  'We wanted to update you on the status of your recent order. Everything is progressing smoothly and should arrive on schedule.',
  'Thank you for taking the time to provide feedback. Your input helps us improve our services.',
  'Due to a scheduling conflict, we need to reschedule our meeting. Please let me know your availability.',
  "Great news! We've successfully completed the first phase of the project. Here are the details.",
  'For security reasons, we need you to verify your account information. Please click the link below.',
  'Your payment has been processed successfully. You should see the charge on your statement within 2-3 business days.',
  'Our support team has responded to your inquiry. Please review the message and let us know if you need further assistance.',
  'Your weekly report is now available in your dashboard. Feel free to reach out if you have any questions.',
];

const EMAIL_ACTIONS = [
  'Track Your Order',
  'View Details',
  'Confirm Meeting',
  'Download Report',
  'Verify Account',
  'View Invoice',
  'Contact Support',
  'Get Started',
];

const WHATSAPP_MESSAGES = [
  'Thanks for the update! 👍',
  'Got it, will review and get back to you',
  'Perfect timing! Just what I needed',
  'Can we schedule a call to discuss this?',
  'Looks good to me ✅',
  'Please send me more details when you can',
  'Understood. Let me check with the team',
  'Great work on this! 🎉',
  "I'll be there in 10 minutes",
  'Could you clarify the requirements?',
  'This is exactly what we were looking for',
  'Let me know if you need any help',
  'Running a bit late, sorry!',
  'Meeting confirmed for tomorrow at 2 PM',
  'Thanks for the quick response!',
];

// Generate more realistic progressive timestamps (older first)
function generateTimestamp(index, total) {
  const now = new Date();
  const hoursAgo = Math.floor((total - index) / 10) + Math.random() * 5;
  const messageTime = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);

  const diffMs = now - messageTime;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return diffMins <= 1 ? 'Just now' : `${diffMins} min ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  } else {
    const diffWeeks = Math.floor(diffDays / 7);
    return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;
  }
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateMessage(id, type = null, index = 0, total = 100) {
  const messageType = type || (Math.random() > 0.5 ? 'email' : 'whatsapp');
  const sender = getRandomItem(PARTICIPANTS);
  const timestamp = generateTimestamp(index, total);

  const baseMessage = {
    id: `msg_${id}`,
    type: messageType,
    sender,
    timestamp,
  };

  if (messageType === 'email') {
    const subject = getRandomItem(EMAIL_SUBJECTS);
    const greeting = getRandomItem(EMAIL_GREETINGS);
    const title = getRandomItem(EMAIL_TITLES);
    const body = getRandomItem(EMAIL_BODIES);
    const actionText = getRandomItem(EMAIL_ACTIONS);
    const recipient = getRandomItem(['Me', 'Team', 'Support', sender.name]);
    const threadCount = Math.floor(Math.random() * 5) + 1;
    const isStarred = Math.random() > 0.7;

    return {
      ...baseMessage,
      recipient,
      subject,
      content: {
        greeting,
        title,
        body,
        actionText,
      },
      threadCount,
      isStarred,
    };
  } else {
    // WhatsApp message
    const text = getRandomItem(WHATSAPP_MESSAGES);

    return {
      ...baseMessage,
      content: {
        text,
      },
    };
  }
}

/**
 * Generates an array of conversation messages with realistic content
 * @param {number} count - Number of messages to generate (default: 500)
 * @returns Array of Message objects
 */
export function generateMessages(count = 500) {
  const messages = [];

  for (let i = 0; i < count; i++) {
    const message = generateMessage(
      String(i + 1).padStart(3, '0'),
      null,
      i,
      count
    );
    messages.push(message);
  }

  return messages;
}

/**
 * Generates messages with alternating types for better visual distribution
 * @param {number} count - Number of messages to generate
 * @returns Array of Message objects with alternating types
 */
export function generateAlternatingMessages(count = 500) {
  const messages = [];

  for (let i = 0; i < count; i++) {
    const messageType = i % 3 === 0 ? 'whatsapp' : 'email'; // 1/3 WhatsApp, 2/3 Email
    const message = generateMessage(
      String(i + 1).padStart(3, '0'),
      messageType,
      i,
      count
    );
    messages.push(message);
  }

  return messages;
}
