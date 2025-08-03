import express from 'express';
import { generateAlternatingMessages } from '../data/conversationData.js';

const router = express.Router();

// Generate all messages once to simulate a database
// Messages are stored in chronological order (oldest first)
const ALL_MESSAGES = generateAlternatingMessages(200); // Production-ready number of messages

// GET /api/conversations/messages - Fetch paginated conversation messages
router.get('/messages', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const conversationId = req.query.conversationId || 'conv_001';

    // Simulate network delay
    await new Promise(resolve =>
      setTimeout(resolve, 200 + Math.random() * 300)
    );

    // Simulate occasional network errors (3% chance)
    if (Math.random() < 0.03) {
      return res.status(500).json({
        error: 'Network error: Failed to fetch conversation messages',
      });
    }

    // For chat-like pagination, we want to return messages in chronological order
    // Client will reverse them for display (newest at bottom)
    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const messages = ALL_MESSAGES.slice(startIndex, endIndex);
    const hasMore = endIndex < ALL_MESSAGES.length;

    res.json({
      messages,
      nextOffset: offset + 1,
      hasMore,
      total: ALL_MESSAGES.length,
      conversationId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/conversations/:id/messages - Send a new message
router.post('/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messageData = req.body;

    // Simulate network delay
    await new Promise(resolve =>
      setTimeout(resolve, 100 + Math.random() * 200)
    );

    // Simulate occasional network errors (2% chance)
    if (Math.random() < 0.02) {
      return res.status(500).json({
        error: 'Network error: Failed to send message',
      });
    }

    // Create a new message with a generated ID
    const newMessage = {
      id: `msg_${Date.now()}`,
      type: 'email', // Default to email for now
      sender: {
        name: 'You',
        initials: 'YU',
        avatar: 'https://avatar.iran.liara.run/public/user',
      },
      timestamp: 'Just now',
      ...messageData,
    };

    // Add to our in-memory "database"
    ALL_MESSAGES.unshift(newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/conversations/:id - Get conversation metadata
router.get('/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Simulate network delay
    await new Promise(resolve =>
      setTimeout(resolve, 150 + Math.random() * 100)
    );

    res.json({
      id: conversationId,
      participantName: 'Mixed Conversation',
      messageCount: ALL_MESSAGES.length,
      lastActivity: '2 min ago',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
