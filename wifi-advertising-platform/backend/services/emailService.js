// backend/services/emailService.js

const nodemailer = require('nodemailer');
const SystemSettings = require('../models/SystemSettings');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

/**
 * EmailService handles all email operations
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
    this.templatesDir = path.join(__dirname, '../templates/emails');
    this.defaultFromEmail = 'noreply@wifi-platform.com';
  }

  /**
   * Initialize email transporter with system settings
   * @returns {Promise<void>}
   */
  async init() {
    try {
      // Get email settings from the database
      const settings = await SystemSettings.getMultiple([
        'smtp_host',
        'smtp_port',
        'smtp_user',
        'smtp_password',
        'smtp_secure',
        'email_from'
      ]);

      // Create transporter
      this.transporter = nodemailer.createTransport({
        host: settings.smtp_host || 'smtp.example.com',
        port: parseInt(settings.smtp_port) || 587,
        secure: settings.smtp_secure === 'true',
        auth: {
          user: settings.smtp_user || '',
          pass: settings.smtp_password || ''
        }
      });

      this.defaultFromEmail = settings.email_from || this.defaultFromEmail;
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize email service:', error);
      throw error;
    }
  }

  /**
   * Ensure the transporter is initialized before sending emails
   * @returns {Promise<void>}
   */
  async ensureInitialized() {
    if (!this.initialized) {
      await this.init();
    }
  }

  /**
   * Load and compile an email template
   * @param {string} templateName - Name of the template file (without extension)
   * @param {Object} context - Context data for the template
   * @returns {Promise<string>} Compiled HTML template
   */
  async compileTemplate(templateName, context) {
    try {
      const filePath = path.join(this.templatesDir, `${templateName}.html`);
      const templateSource = fs.readFileSync(filePath, 'utf-8');
      const template = handlebars.compile(templateSource);
      return template(context);
    } catch (error) {
      console.error(`Template error (${templateName}):`, error);
      throw error;
    }
  }

  /**
   * Send an email
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.text - Plain text content (optional)
   * @param {string} options.html - HTML content (optional)
   * @param {string} options.from - Sender email (optional)
   * @returns {Promise<Object>} Email send result
   */
  async sendEmail(options) {
    await this.ensureInitialized();

    try {
      const mailOptions = {
        from: options.from || this.defaultFromEmail,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      };

      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  }

  /**
   * Send a template-based email
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.template - Template name
   * @param {Object} options.context - Template context data
   * @param {string} options.from - Sender email (optional)
   * @returns {Promise<Object>} Email send result
   */
  async sendTemplateEmail(options) {
    try {
      const html = await this.compileTemplate(options.template, options.context);
      
      return await this.sendEmail({
        to: options.to,
        subject: options.subject,
        html,
        from: options.from
      });
    } catch (error) {
      console.error('Template email error:', error);
      throw error;
    }
  }

  /**
   * Send welcome email to new user
   * @param {Object} user - User data
   * @returns {Promise<Object>} Email send result
   */
  async sendWelcomeEmail(user) {
    return await this.sendTemplateEmail({
      to: user.email,
      subject: 'Welcome to WiFi Advertising Platform',
      template: 'welcome',
      context: {
        name: user.first_name || user.username,
        role: user.role,
        loginUrl: process.env.FRONTEND_URL + '/login'
      }
    });
  }

  /**
   * Send password reset email
   * @param {Object} userData - User data
   * @param {string} resetToken - Password reset token
   * @returns {Promise<Object>} Email send result
   */
  async sendPasswordResetEmail(userData, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    return await this.sendTemplateEmail({
      to: userData.email,
      subject: 'Password Reset Request',
      template: 'password-reset',
      context: {
        name: userData.first_name || userData.email,
        resetUrl,
        expiryTime: '1 hour'
      }
    });
  }

  /**
   * Send account verification email
   * @param {Object} userData - User data
   * @param {string} verificationToken - Verification token
   * @returns {Promise<Object>} Email send result
   */
  async sendVerificationEmail(userData, verificationToken) {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-account?token=${verificationToken}`;
    
    return await this.sendTemplateEmail({
      to: userData.email,
      subject: 'Verify Your Account',
      template: 'verification',
      context: {
        name: userData.first_name || userData.email,
        verifyUrl
      }
    });
  }

  /**
   * Send merchant approval notification
   * @param {Object} merchantData - Merchant data with user info
   * @param {string} status - Approval status
   * @returns {Promise<Object>} Email send result
   */
  async sendMerchantApprovalEmail(merchantData, status) {
    const template = status === 'approved' ? 'merchant-approved' : 'merchant-rejected';
    const subject = status === 'approved' 
      ? 'Your Merchant Account Has Been Approved' 
      : 'Your Merchant Account Application Status';

    return await this.sendTemplateEmail({
      to: merchantData.business_email || merchantData.user.email,
      subject,
      template,
      context: {
        businessName: merchantData.business_name,
        name: merchantData.user.first_name || merchantData.user.username,
        loginUrl: process.env.FRONTEND_URL + '/login',
        supportEmail: 'support@wifi-platform.com'
      }
    });
  }

  /**
   * Send notification about new ad campaign
   * @param {Object} campaignData - Campaign data
   * @param {Array} merchantEmails - List of merchant emails
   * @returns {Promise<Array>} Array of email send results
   */
  async sendNewCampaignNotification(campaignData, merchantEmails) {
    const results = [];
    
    for (const email of merchantEmails) {
      try {
        const result = await this.sendTemplateEmail({
          to: email,
          subject: 'New Advertisement Campaign Available',
          template: 'new-campaign',
          context: {
            campaignName: campaignData.name,
            campaignStart: new Date(campaignData.start_date).toLocaleDateString(),
            campaignEnd: new Date(campaignData.end_date).toLocaleDateString(),
            dashboardUrl: process.env.FRONTEND_URL + '/merchant/dashboard'
          }
        });
        
        results.push(result);
      } catch (error) {
        console.error(`Failed to send campaign email to ${email}:`, error);
        results.push({ error, email });
      }
    }
    
    return results;
  }

  /**
   * Send revenue report email
   * @param {Object} userData - User data
   * @param {Object} reportData - Report data
   * @param {string} period - Report period
   * @returns {Promise<Object>} Email send result
   */
  async sendRevenueReportEmail(userData, reportData, period) {
    return await this.sendTemplateEmail({
      to: userData.email,
      subject: `Your ${period} Revenue Report`,
      template: 'revenue-report',
      context: {
        name: userData.first_name || userData.username,
        period,
        total: reportData.total,
        reportUrl: `${process.env.FRONTEND_URL}/${userData.role}/reports`,
        reportDate: new Date().toLocaleDateString()
      }
    });
  }
}

module.exports = new EmailService();