import express from 'express';
import { generateNotes } from '../data/notesData.js';

const router = express.Router();

// Generate all notes once to simulate a database
const ALL_NOTES = generateNotes(100); // Production-ready number of notes

// GET /api/notes - Fetch paginated notes
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    // Simulate occasional network errors (5% chance)
    if (Math.random() < 0.05) {
      return res.status(500).json({
        error: 'Network error: Failed to fetch notes',
      });
    }

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const notes = ALL_NOTES.slice(startIndex, endIndex);
    const hasMore = endIndex < ALL_NOTES.length;

    res.json({
      notes,
      nextOffset: offset + 1,
      hasMore,
      total: ALL_NOTES.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
