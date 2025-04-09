import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { verifyToken, authorizeRole } from './config/auth.js';
import db from './config/database.js';
// Import swagger packages
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Convert ES module paths to directory names
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Swagger Definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WiFi Connect API Documentation',
      version: '1.0.0',
      description: 'API documentation for WiFi Connect application',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
  },
  // Path to API docs - adjust these paths to where your route documentation will be
  apis: [
    './routes/*.js',                 // If you move routes to separate files
    './controllers/*.js',            // Documentation in controller files
    './index.js',                    // For routes in this file
    './swagger-docs/*.js',           // For dedicated swagger documentation files
  ],
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 */
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

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, agent, advertiser, merchant]
 *     responses:
 *       200:
 *         description: Registration successful
 *       400:
 *         description: Registration failed
 */
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

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: User logout
 *     description: Logs out the current user by clearing the token cookie
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 */
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get user dashboard info
 *     description: Returns user role for dashboard redirection
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Dashboard info retrieved successfully
 *       401:
 *         description: Unauthorized
 */
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
  /**
   * @swagger
   * /api/{role}/dashboard:
   *   get:
   *     summary: Get role-specific dashboard
   *     description: Returns dashboard data based on user role
   *     tags: [Dashboard]
   *     parameters:
   *       - in: path
   *         name: role
   *         schema:
   *           type: string
   *           enum: [admin, agent, advertiser, merchant]
   *         required: true
   *         description: User role
   *     security:
   *       - bearerAuth: []
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: Dashboard data retrieved successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - incorrect role
   */
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

/**
 * @swagger
 * /api/wifi/connect/{qrCode}:
 *   get:
 *     summary: Get WiFi connection details
 *     description: Returns WiFi connection details based on QR code
 *     tags: [WiFi]
 *     parameters:
 *       - in: path
 *         name: qrCode
 *         schema:
 *           type: string
 *         required: true
 *         description: QR code identifier
 *     responses:
 *       200:
 *         description: WiFi details returned successfully
 *       404:
 *         description: QR code not found
 *       500:
 *         description: Server error
 */
app.get('/api/wifi/connect/:qrCode', async (req, res) => {
  try {
    const userController = await import('./controllers/userController.js');
    const wifiData = await userController.getWiFiDetails(req, res);
    res.json(wifiData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/ads/view/{sessionId}:
 *   get:
 *     summary: Get ads to view
 *     description: Returns ads to display based on session ID
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: Session identifier
 *     responses:
 *       200:
 *         description: Ads returned successfully
 *       500:
 *         description: Server error
 */
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
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
});