import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend directory or current dir
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import { connectDB, getDbStatus } from './config/db.js';
import store from './services/store.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import alertRoutes from './routes/alertRoutes.js';

const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.originalUrl.startsWith('/assets')) {
      console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

// Health check endpoint (matches both /api/health and /health)
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: getDbStatus(),
    aiEngine: Boolean(process.env.GROQ_API_KEY) ? 'Groq AI (Ultra-fast LLM)' : 'Built-in Culinary Rule Engine',
  });
});

// Routes (supports both /api/* and direct /* prefixes)
app.use(['/api/inventory', '/inventory'], inventoryRoutes);
app.use(['/api/recipes', '/recipes'], recipeRoutes);
app.use(['/api/alerts', '/alerts'], alertRoutes);

// Serve Frontend Static Build if available
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/inventory') || req.originalUrl.startsWith('/recipes') || req.originalUrl.startsWith('/alerts')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server & Connect Database
const startServer = async () => {
  await connectDB();
  await store.ensureSeeded();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
======================================================
  🥗 Food Optimizer Web App is running!
  🌐 Server: http://0.0.0.0:${PORT}
  📊 Health Check: http://0.0.0.0:${PORT}/api/health
  🥦 Inventory: http://0.0.0.0:${PORT}/api/inventory
  🔔 Alerts: http://0.0.0.0:${PORT}/api/alerts
  🍲 Recipes: http://0.0.0.0:${PORT}/api/recipes
======================================================
    `);
  });
};

startServer();

export default app;
