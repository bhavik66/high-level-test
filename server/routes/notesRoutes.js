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

    // Simulate network delay
    await new Promise(resolve =>
      setTimeout(resolve, 300 + Math.random() * 200)
    );

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

// GET /api/notes/search - Search notes with pagination
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Simulate network delay
    await new Promise(resolve =>
      setTimeout(resolve, 400 + Math.random() * 300)
    );

    const filteredNotes = ALL_NOTES.filter(
      note =>
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.timestamp.toLowerCase().includes(query.toLowerCase())
    );

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const notes = filteredNotes.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredNotes.length;

    res.json({
      notes,
      nextOffset: offset + 1,
      hasMore,
      total: filteredNotes.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notes/:id - Get a specific note by ID
router.get('/:id', (req, res) => {
  try {
    const noteId = req.params.id;
    const note = ALL_NOTES.find(n => n.id === noteId);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notes - Create a new note
router.post('/', (req, res) => {
  try {
    const { content, timestamp } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const newNote = {
      id: (ALL_NOTES.length + 1).toString(),
      content,
      timestamp: timestamp || 'just now',
    };

    ALL_NOTES.unshift(newNote); // Add to beginning of array

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/notes/:id - Update a note
router.put('/:id', (req, res) => {
  try {
    const noteId = req.params.id;
    const { content, timestamp } = req.body;
    const noteIndex = ALL_NOTES.findIndex(n => n.id === noteId);

    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    ALL_NOTES[noteIndex] = {
      ...ALL_NOTES[noteIndex],
      content,
      timestamp: timestamp || ALL_NOTES[noteIndex].timestamp,
    };

    res.json(ALL_NOTES[noteIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', (req, res) => {
  try {
    const noteId = req.params.id;
    const noteIndex = ALL_NOTES.findIndex(n => n.id === noteId);

    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const deletedNote = ALL_NOTES.splice(noteIndex, 1)[0];
    res.json({ message: 'Note deleted successfully', note: deletedNote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notes/stats/summary - Get notes statistics
router.get('/stats/summary', (req, res) => {
  try {
    const stats = {
      total: ALL_NOTES.length,
      recentCount: ALL_NOTES.filter(
        note =>
          note.timestamp.includes('hour') || note.timestamp.includes('minute')
      ).length,
      tagCounts: {},
    };

    // Count tags
    ALL_NOTES.forEach(note => {
      const tagMatch = note.content.match(/class="tag-(\w+)"/);
      if (tagMatch) {
        const tagType = tagMatch[1];
        stats.tagCounts[tagType] = (stats.tagCounts[tagType] || 0) + 1;
      }
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
