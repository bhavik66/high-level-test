import express from 'express';

const router = express.Router();

// Hardcoded main layout configuration
const mainLayout = [
  {
    component: 'ContactView',
    className: 'h-full',
    visible: true,
    responsive: {
      base: 'col-span-12 mb-4 md:col-span-4 md:mb-0 lg:col-span-3',
    },
  },
  {
    component: 'ConversationsView',
    className: 'h-full overflow-y-auto',
    visible: true,
    responsive: {
      base: 'col-span-12 mb-4 md:col-span-8 md:mb-0 lg:col-span-6',
    },
  },
  {
    component: 'NotesView',
    className: 'h-full',
    visible: true,
    responsive: {
      base: 'col-span-12 md:col-span-12 lg:col-span-3',
    },
  },
];

// GET /api/layout - Get main layout configuration
router.get('/', async (req, res) => {
  try {
    // Simulate network delay
    await new Promise(resolve =>
      setTimeout(resolve, 200 + Math.random() * 100)
    );

    // Simulate occasional network errors (3% chance)
    if (Math.random() < 0.03) {
      return res.status(500).json({
        error: 'Network error: Failed to fetch layout configuration',
      });
    }

    res.json({
      layout: mainLayout,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/layout/main - Alternative endpoint for main layout
router.get('/main', async (req, res) => {
  try {
    // Simulate network delay
    await new Promise(resolve =>
      setTimeout(resolve, 150 + Math.random() * 100)
    );

    res.json({
      layout: mainLayout,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
