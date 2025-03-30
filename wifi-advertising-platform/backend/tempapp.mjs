import express from 'express';
import sql from 'mssql';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { verifyToken, authorizeRole } from './config/auth.js';
import db from './config/database.js';

// Create express app for temporary dashboard
const tempApp = express();

// Middleware
tempApp.use(cors());
tempApp.use(bodyParser.json());
tempApp.use(bodyParser.urlencoded({ extended: true }));
tempApp.use(cookieParser());

// Set the view engine to EJS for the temp dashboard
const viewsPath = decodeURIComponent(path.resolve(path.dirname(import.meta.url).replace('file:///', ''), 'temp_views'));
tempApp.set('view engine', 'ejs');
tempApp.set('views', viewsPath);

// Static files
const staticPath = decodeURIComponent(path.resolve(path.dirname(import.meta.url).replace('file:///', ''), 'temp_static'));
tempApp.use('/static', express.static(staticPath));

db.testConnection().then(connected => {
  if (connected) {
    console.log('\n');
  } else {
    console.error('Failed to connect to database');
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.env.TEMP_PORT || 3002;
  
  const server = tempApp.listen(port, () => {
    console.log(`Tempapp: Temporary dashboard running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying another port...`);
      setTimeout(() => {
        server.close();
        server.listen(0); // 0 means automatically assign an available port
      }, 1000);
    }
  });

  server.on('listening', () => {
    const actualPort = server.address().port;
    console.log(`Server running on port ${actualPort}`);
  });
}

// Authentication middleware for protected routes
const authenticate = (req, res, next) => {
  // Get token from cookie or header
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.redirect('/login');
  }
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('token');
    return res.redirect('/login');
  }
};

// ======== Routes ========

// Login page (entry point)
tempApp.get('/login', (req, res) => {
  res.render('temp_views/login', { error: null, query: req.query });
});

// Register page
tempApp.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// Login processing
tempApp.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Import auth service here to avoid circular dependencies
    const authService = await import('./services/authService.js');
    const result = await authService.login(email, password);
    
    // Set token as cookie
    res.cookie('token', result.token, { 
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    
    res.redirect('/dashboard');
  } catch (error) {
    res.render('login', { error: error.message });
  }
});

// Registration processing
tempApp.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    // Import auth service 
    const authService = await import('./services/authService.js');
    await authService.register({
      email,
      password,
      first_name: firstName,
      last_name: lastName
    }, role);
    
    res.redirect('/login?registered=true');
  } catch (error) {
    res.render('register', { error: error.message });
  }
});

// Logout
tempApp.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

// Main dashboard router - redirects based on role
tempApp.get('/dashboard', authenticate, (req, res) => {
  const role = req.user.role;
  switch(role) {
    case 'admin':
      res.redirect('/admin/dashboard');
      break;
    case 'agent':
      res.redirect('/agent/dashboard');
      break;
    case 'advertiser':
      res.redirect('/advertiser/dashboard');
      break;
    case 'merchant':
      res.redirect('/merchant/dashboard');
      break;
    default:
      res.render('error', { 
        message: 'Invalid role', 
        error: { status: 403, stack: '' } 
      });
  }
});

// ======== Admin Routes ========
tempApp.get('/admin/dashboard', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const dashboardController = await import('./controllers/dashboardController.js');
    const data = await dashboardController.getAdminDashboard(req, res);
    res.render('admin/dashboard', { user: req.user, data });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

tempApp.get('/admin/users', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const adminController = await import('./controllers/adminController.js');
    const users = await adminController.getAllUsers(req, res);
    res.render('admin/users', { user: req.user, users });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

tempApp.get('/admin/transactions', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const adminController = await import('./controllers/adminController.js');
    const transactions = await adminController.getTransactions(req, res);
    res.render('admin/transactions', { user: req.user, transactions });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

tempApp.get('/admin/reports', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const adminController = await import('./controllers/adminController.js');
    const reports = await adminController.generateSystemReport(req, res);
    res.render('admin/reports', { user: req.user, reports });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

tempApp.get('/admin/settings', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const adminController = await import('./controllers/adminController.js');
    const settings = await adminController.getSystemSettings(req, res);
    res.render('admin/settings', { user: req.user, settings });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

// ======== Agent Routes ========
tempApp.get('/agent/dashboard', authenticate, authorizeRole('agent'), async (req, res) => {
  try {
    const dashboardController = await import('./controllers/dashboardController.js');
    const data = await dashboardController.getAgentDashboard(req, res);
    res.render('agent/dashboard', { user: req.user, data });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

tempApp.get('/agent/merchants', authenticate, authorizeRole('agent'), async (req, res) => {
  try {
    const agentController = await import('./controllers/agentController.js');
    const merchants = await agentController.getAllMerchants(req, res);
    res.render('agent/merchants', { user: req.user, merchants });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

tempApp.get('/agent/qrcodes', authenticate, authorizeRole('agent'), async (req, res) => {
  try {
    const agentController = await import('./controllers/agentController.js');
    const qrCodes = await agentController.getAllQRCodes(req, res);
    res.render('agent/qrcodes', { user: req.user, qrCodes });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

tempApp.get('/agent/commissions', authenticate, authorizeRole('agent'), async (req, res) => {
  try {
    const agentController = await import('./controllers/agentController.js');
    const commissions = await agentController.getCommissionReports(req, res);
    res.render('agent/commissions', { user: req.user, commissions });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

tempApp.get('/agent/profile', authenticate, authorizeRole('agent'), async (req, res) => {
  try {
    const agentController = await import('./controllers/agentController.js');
    const profile = await agentController.getAgentProfile(req, res);
    res.render('agent/profile', { user: req.user, profile });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

// ======== Advertiser Routes ========
tempApp.get('/advertiser/dashboard', authenticate, authorizeRole('advertiser'), async (req, res) => {
  try {
    const dashboardController = await import('./controllers/dashboardController.js');
    const data = await dashboardController.getAdvertiserDashboard(req, res);
    res.render('advertiser/dashboard', { user: req.user, data });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

tempApp.get('/advertiser/campaigns', authenticate, authorizeRole('advertiser'), async (req, res) => {
  try {
    const advertiserController = await import('./controllers/advertiserController.js');
    const campaigns = await advertiserController.getAllCampaigns(req, res);
    res.render('advertiser/campaigns', { user: req.user, campaigns });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

tempApp.get('/advertiser/analytics', authenticate, authorizeRole('advertiser'), async (req, res) => {
  try {
    const advertiserController = await import('./controllers/advertiserController.js');
    const analytics = await advertiserController.getCampaignAnalytics(req, res);
    res.render('advertiser/analytics', { user: req.user, analytics });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

tempApp.get('/advertiser/budget', authenticate, authorizeRole('advertiser'), async (req, res) => {
  try {
    const advertiserController = await import('./controllers/advertiserController.js');
    const budget = await advertiserController.getAdBudget(req, res);
    const history = await advertiserController.getSpendingHistory(req, res);
    res.render('advertiser/budget', { user: req.user, budget, history });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

tempApp.get('/advertiser/profile', authenticate, authorizeRole('advertiser'), async (req, res) => {
  try {
    const advertiserController = await import('./controllers/advertiserController.js');
    const profile = await advertiserController.getAdvertiserProfile(req, res);
    res.render('advertiser/profile', { user: req.user, profile });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

// ======== Merchant Routes ========
tempApp.get('/merchant/dashboard', authenticate, authorizeRole('merchant'), async (req, res) => {
  try {
    const dashboardController = await import('./controllers/dashboardController.js');
    const data = await dashboardController.getMerchantDashboard(req, res);
    res.render('merchant/dashboard', { user: req.user, data });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

tempApp.get('/merchant/wifi', authenticate, authorizeRole('merchant'), async (req, res) => {
  try {
    const merchantController = await import('./controllers/merchantController.js');
    const wifiSettings = await merchantController.getWiFiSettings(req, res);
    const wifiStats = await merchantController.getWiFiUsageStats(req, res);
    res.render('merchant/wifi', { user: req.user, wifiSettings, wifiStats });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

tempApp.get('/merchant/profile', authenticate, authorizeRole('merchant'), async (req, res) => {
  try {
    const merchantController = await import('./controllers/merchantController.js');
    const profile = await merchantController.getMerchantProfile(req, res);
    res.render('merchant/profile', { user: req.user, profile });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

tempApp.get('/merchant/earnings', authenticate, authorizeRole('merchant'), async (req, res) => {
  try {
    const merchantController = await import('./controllers/merchantController.js');
    const earnings = await merchantController.getEarningsReport(req, res);
    res.render('merchant/earnings', { user: req.user, earnings });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

// ======== User (non-logged in) Routes ========
tempApp.get('/wifi/connect/:qrCode', async (req, res) => {
  try {
    const userController = await import('./controllers/userController.js');
    const wifiData = await userController.getWiFiDetails(req, res);
    res.render('user/connect', { wifiData });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

tempApp.get('/ads/view/:sessionId', async (req, res) => {
  try {
    const userController = await import('./controllers/userController.js');
    const ads = await userController.getAdsToView(req, res);
    res.render('user/ads', { ads, sessionId: req.params.sessionId });
  } catch (error) {
    res.render('error', { message: error.message, error });
  }
});

tempApp.get('/join', (req, res) => {
  res.render('user/join');
});

// ======== Error handling ========
// 404 handler
tempApp.use((req, res, next) => {
  res.status(404).render('error', { 
    message: 'Page not found', 
    error: { status: 404, stack: '' } 
  });
});

// Error handler
tempApp.use((err, req, res, next) => {
  // Set locals, only providing error in development
  const error = req.app.get('env') === 'development' ? err : {};
  
  // Render the error page
  res.status(err.status || 500);
  res.render('error.ejs', {
    message: err.message,
    error: error
  });
});

export default tempApp;

// If this file is run directly, start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.env.TEMP_PORT || 3001;
  tempApp.listen(port, () => {
    console.log(`Temporary dashboard running on http://localhost:${port}`);
  });
}