import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import layoutRoutes from './routes/layoutRoutes.js';
import notesRoutes from './routes/notesRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist'))); // Serve built React app

// API Routes
app.use('/api/notes', notesRoutes);
app.use('/api/layout', layoutRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    server: 'Notes API Server',
    version: '1.0.0',
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Notes API',
    version: '1.0.0',
    endpoints: {
      notes: {
        'GET /api/notes': 'Get paginated notes',
      },
      layout: {
        'GET /api/layout': 'Get main layout configuration',
      },
      system: {
        'GET /api/health': 'Health check',
        'GET /api': 'API information',
      },
    },
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal server error',
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl,
    availableEndpoints: '/api',
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Notes API Server Started');
  console.log('================================');
  console.log(`🌐 Server running on: http://localhost:${PORT}`);
  console.log(`📝 Notes API: http://localhost:${PORT}/api/notes`);
  console.log(
    `🔍 Search API: http://localhost:${PORT}/api/notes/search?q=query`
  );
  console.log(`📊 Stats API: http://localhost:${PORT}/api/notes/stats/summary`);
  console.log(`🎨 Layout API: http://localhost:${PORT}/api/layout`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📖 API Info: http://localhost:${PORT}/api`);
  console.log('================================');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
});
