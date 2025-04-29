// backend/app.js
const dotenv = require('dotenv')
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const db = require('./config/database');
const setupSwagger = require('./swagger');

const app = express();
dotenv.config();
// ======= 🧼 Middleware =======
// Allow requests from the frontend
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true // Allow cookies if needed
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// ======= 📘 Swagger UI =======
setupSwagger(app);

// ======= 🧠 DB Test =======
db.testConnection().then(connected => {
  if (connected) {
    console.log('✅ Database connected successfully');
  } else {
    console.error('❌ Failed to connect to database');
  }
});

// ======= 🛣️ API Routes =======
const adminRoutes = require('./routes/admin');
const advertiserRoutes = require('./routes/advertiser');
const agentRoutes = require('./routes/agent');
const authRoutes = require('./routes/auth');
const merchantRoutes = require('./routes/merchant');
const publicRoutes = require('./routes/public');
const userRoutes = require('./routes/user');

app.use('/api/admin', adminRoutes);
app.use('/api/advertiser', advertiserRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/user', userRoutes);

// ======= 🧼 Serve Frontend =======
const frontendPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendPath));

// ======= ❌ 404 + General Error Handler =======
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ======= 🚀 Start Server =======
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
});
