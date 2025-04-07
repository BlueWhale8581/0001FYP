import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { verifyToken, authorizeRole } from './config/auth.js';
import db from './config/database.js';

// Convert ES module paths to directory names
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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

// ✅ AUTH Middleware
const authenticate = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('token');
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// ======== 🚀 API Routes (No EJS) ========

// ✅ Authentication Routes
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const authService = await import('./services/authService.js');
    const result = await authService.login(email, password);

    res.cookie('token', result.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({ success: true, user: result.user });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    const authService = await import('./services/authService.js');
    
    await authService.register({ email, password, first_name: firstName, last_name: lastName }, role);
    
    res.json({ success: true, message: 'Registration successful. Please log in.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// ✅ Dashboard Route (Redirects based on role)
app.get('/api/dashboard', authenticate, (req, res) => {
  res.json({ role: req.user.role });
});

// ======== 🌍 Role-Based Routes ========

const routes = {
  admin: '/admin/dashboard',
  agent: '/agent/dashboard',
  advertiser: '/advertiser/dashboard',
  merchant: '/merchant/dashboard',
};

Object.entries(routes).forEach(([role, path]) => {
  app.get(`/api${path}`, authenticate, authorizeRole(role), async (req, res) => {
    try {
      const dashboardController = await import('./controllers/dashboardController.js');
      const data = await dashboardController[`get${role.charAt(0).toUpperCase() + role.slice(1)}Dashboard`](req, res);
      res.json({ user: req.user, data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
});

// ✅ User Routes
app.get('/api/wifi/connect/:qrCode', async (req, res) => {
  try {
    const userController = await import('./controllers/userController.js');
    const wifiData = await userController.getWiFiDetails(req, res);
    res.json(wifiData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/ads/view/:sessionId', async (req, res) => {
  try {
    const userController = await import('./controllers/userController.js');
    const ads = await userController.getAdsToView(req, res);
    res.json({ ads, sessionId: req.params.sessionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
});
