-- CREATE DATABASE fyp_wifi_advertising

-- USE fyp_wifi_advertising

-- Users table with role-based access
CREATE TABLE users (
  id INT IDENTITY(100000001,1) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'agent', 'advertiser', 'merchant')) NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  phone VARCHAR(20),
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  last_login DATETIME NULL,
  status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'pending', 'suspended')) DEFAULT 'pending'
);

-- Merchants table
CREATE TABLE merchants (
  id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(100) NOT NULL,
  business_address TEXT NOT NULL,
  business_phone VARCHAR(20),
  business_email VARCHAR(100),
  business_category VARCHAR(50),
  tax_id VARCHAR(50),
  logo_url VARCHAR(255),
  agent_id INT,
  approval_status VARCHAR(20) CHECK (approval_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (agent_id) REFERENCES users(id)
);

-- Agents table
CREATE TABLE agents (
  id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  user_id INT NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 0.00,
  territory VARCHAR(100),
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Advertisers table
CREATE TABLE advertisers (
  id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  user_id INT NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  company_address TEXT,
  company_phone VARCHAR(20),
  company_email VARCHAR(100),
  industry VARCHAR(50),
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Campaigns table
CREATE TABLE campaigns (
  id INT IDENTITY(200000001,1) PRIMARY KEY,
  advertiser_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  spent DECIMAL(10,2) DEFAULT 0.00,
  status VARCHAR(10) CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')) DEFAULT 'draft',
  target_audience NVARCHAR(MAX),
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (advertiser_id) REFERENCES advertisers(id)
);


-- Ads table
CREATE TABLE ads (
  id INT IDENTITY(300000001,1) PRIMARY KEY,
  campaign_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  media_url VARCHAR(255),
  type VARCHAR(10) CHECK (type IN ('image', 'video', 'text')) NOT NULL,
  redirect_url VARCHAR(255),
  duration INT DEFAULT 15, 
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

-- QR codes table
CREATE TABLE qr_codes (
  id INT IDENTITY(400000001,1) PRIMARY KEY,
  merchant_id INT NOT NULL,
  code_image_url VARCHAR(255) NOT NULL,
  activation_status VARCHAR(20) CHECK (activation_status IN ('active', 'inactive')) DEFAULT 'active',
  created_by INT NOT NULL, -- User ID of the agent who created it
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- WiFi settings table
CREATE TABLE wifi_settings (
  id INT IDENTITY(500000001,1) PRIMARY KEY,
  merchant_id INT NOT NULL,
  ssid VARCHAR(100) NOT NULL,
  password VARCHAR(100),
  connection_limit INT DEFAULT 50,
  session_duration INT DEFAULT 60, -- In minutes
  ads_before_access BIT DEFAULT 1,
  redirect_url VARCHAR(255),
  terms_and_conditions TEXT,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
);

-- WiFi access logs
CREATE TABLE wifi_access_logs (
  id INT IDENTITY(600000001,1) PRIMARY KEY,
  merchant_id INT NOT NULL,
  user_id INT, -- NULL if not logged in
  device_mac VARCHAR(17) NOT NULL,
  connection_time DATETIME DEFAULT GETDATE(),
  disconnection_time DATETIME NULL,
  ads_viewed INT DEFAULT 0,
  ip_address VARCHAR(45),
  user_agent TEXT,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Ad impressions table
CREATE TABLE ad_impressions (
  id INT IDENTITY(700000001,1) PRIMARY KEY,
  ad_id INT NOT NULL,
  user_id INT, -- NULL if not logged in
  merchant_id INT NOT NULL,
  view_time DATETIME DEFAULT GETDATE(),
  view_duration INT, -- How long the ad was viewed in seconds
  completed BIT DEFAULT 0, -- Whether the ad was fully viewed
  device_info NVARCHAR(MAX),
  FOREIGN KEY (ad_id) REFERENCES ads(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);

-- Transactions table
CREATE TABLE transactions (
  id INT IDENTITY(800000001,1) PRIMARY KEY,
  type VARCHAR(20) CHECK (type IN ('ad_revenue', 'merchant_payment', 'agent_commission', 'advertiser_payment')) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status  VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  reference_id VARCHAR(100), -- External payment reference
  merchant_id INT NULL,
  advertiser_id INT NULL,
  agent_id INT NULL,
  campaign_id INT NULL,
  description TEXT,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id),
  FOREIGN KEY (advertiser_id) REFERENCES advertisers(id),
  FOREIGN KEY (agent_id) REFERENCES agents(id),
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

-- Notifications table
CREATE TABLE notifications (
  id INT IDENTITY(900000001,1) PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
  is_read BIT DEFAULT 0,
  created_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- System settings table
CREATE TABLE system_settings (
  id INT IDENTITY(980000001,1) PRIMARY KEY,
  setting_key VARCHAR(50) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_by INT,
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Audit logs table
CREATE TABLE audit_logs (
  id INT IDENTITY(960000001,1) PRIMARY KEY,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT,
  old_values NVARCHAR(MAX),
  new_values NVARCHAR(MAX),
  ip_address VARCHAR(45),
  created_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

