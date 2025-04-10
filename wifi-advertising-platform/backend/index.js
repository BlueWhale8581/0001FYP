// backend/index.js
import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import db from './config/database.js';
import setupSwagger from './swagger.js';

// Import routes
import adminRoutes from './routes/admin.js';
import advertiserRoutes from './routes/advertiser.js';
import agentRoutes from './routes/agent.js';
import authRoutes from './routes/auth.js';
import merchantRoutes from './routes/merchant.js';
import publicRoutes from './routes/public.js';
import userRoutes from './routes/user.js';

// Convert ES module paths to directory names
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Setup Swagger UI
setupSwagger(app);

// Serve React Frontend
const frontendPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendPath));

// Database Connection Test
db.testConnection().then(connected => {
  if (connected) {
    console.log('✅ Database connected successfully');
  } else {
    console.error('❌ Failed to connect to database');
  }
});

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/advertiser', advertiserRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api', authRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/public', publicRoutes);
app.use('/api', userRoutes);

// ======== ⚠️ Error Handling ========
// 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// General Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ======== 🔥 Start Server ========
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
});