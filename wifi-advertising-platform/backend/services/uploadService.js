const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);

/**
 * Service for handling file uploads
 */
class UploadService {
  constructor() {
    this.uploadDir = path.join(__dirname, '../../uploads');
    this.subDirs = {
      logos: 'merchant_logos',
      ads: 'ad_media',
      qrcodes: 'qr_codes'
    };
    this.allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    this.allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    
    // Create upload directories if they don't exist
    this._initializeDirectories();
  }

  /**
   * Initialize upload directories
   * @private
   */
  async _initializeDirectories() {
    try {
      // Create main upload directory if it doesn't exist
      if (!fs.existsSync(this.uploadDir)) {
        await mkdir(this.uploadDir, { recursive: true });
      }

      // Create subdirectories if they don't exist
      for (const dir of Object.values(this.subDirs)) {
        const subDirPath = path.join(this.uploadDir, dir);
        if (!fs.existsSync(subDirPath)) {
          await mkdir(subDirPath, { recursive: true });
        }
      }
    } catch (error) {
      console.error('Error initializing upload directories:', error);
    }
  }

  /**
   * Generate a unique filename
   * @param {String} originalName - Original filename
   * @returns {String} Unique filename
   * @private
   */
  _generateUniqueFilename(originalName) {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(originalName);
    return `${timestamp}-${randomString}${extension}`;
  }

  /**
   * Validate file type and size
   * @param {Object} file - File object with mimetype and size
   * @param {String} type - Type of upload (logo, ad, qrcode)
   * @returns {Boolean} Whether the file is valid
   * @private
   */
  _validateFile(file, type) {
    // Check file size
    if (file.size > this.maxFileSize) {
      throw new Error(`File size exceeds limit of ${this.maxFileSize / 1024 / 1024}MB`);
    }

    // Validate file type based on upload type
    switch (type) {
      case 'logo':
        if (!this.allowedImageTypes.includes(file.mimetype)) {
          throw new Error(`Invalid file type for logo. Allowed types: ${this.allowedImageTypes.join(', ')}`);
        }
        break;
      case 'ad':
        if (![...this.allowedImageTypes, ...this.allowedVideoTypes].includes(file.mimetype)) {
          throw new Error(`Invalid file type for ad. Allowed types: ${[...this.allowedImageTypes, ...this.allowedVideoTypes].join(', ')}`);
        }
        break;
      case 'qrcode':
        if (!this.allowedImageTypes.includes(file.mimetype)) {
          throw new Error(`Invalid file type for QR code. Allowed types: ${this.allowedImageTypes.join(', ')}`);
        }
        break;
      default:
        throw new Error('Invalid upload type');
    }

    return true;
  }

  /**
   * Save file to disk
   * @param {Buffer} fileBuffer - File data buffer
   * @param {String} filename - Unique filename
   * @param {String} subDir - Subdirectory to save file in
   * @returns {String} File path
   * @private
   */
  async _saveFile(fileBuffer, filename, subDir) {
    const filePath = path.join(this.uploadDir, subDir, filename);
    await writeFile(filePath, fileBuffer);
    return filePath;
  }

  /**
   * Get public URL for a file
   * @param {String} subDir - Subdirectory where file is stored
   * @param {String} filename - Filename
   * @returns {String} Public URL for the file
   * @private
   */
  _getPublicUrl(subDir, filename) {
    // Format: /uploads/{subDir}/{filename}
    return `/uploads/${subDir}/${filename}`;
  }

  /**
   * Upload merchant logo
   * @param {Object} file - File object with buffer, originalname, mimetype, and size
   * @param {Number} merchantId - Merchant ID
   * @returns {String} Public URL for the logo
   */
  async uploadMerchantLogo(file, merchantId) {
    try {
      // Validate file
      this._validateFile(file, 'logo');

      // Generate unique filename with merchant ID prefix
      const uniqueFilename = `merchant_${merchantId}_${this._generateUniqueFilename(file.originalname)}`;
      
      // Save file
      await this._saveFile(file.buffer, uniqueFilename, this.subDirs.logos);
      
      // Return public URL
      return this._getPublicUrl(this.subDirs.logos, uniqueFilename);
    } catch (error) {
      console.error(`Error uploading merchant logo for merchant ${merchantId}:`, error);
      throw error;
    }
  }

  /**
   * Upload ad media
   * @param {Object} file - File object with buffer, originalname, mimetype, and size
   * @param {Number} adId - Ad ID
   * @param {Number} campaignId - Campaign ID
   * @returns {String} Public URL for the ad media
   */
  async uploadAdMedia(file, adId, campaignId) {
    try {
      // Validate file
      this._validateFile(file, 'ad');

      // Generate unique filename with ad and campaign ID prefix
      const uniqueFilename = `ad_${adId}_campaign_${campaignId}_${this._generateUniqueFilename(file.originalname)}`;
      
      // Save file
      await this._saveFile(file.buffer, uniqueFilename, this.subDirs.ads);
      
      // Return public URL
      return this._getPublicUrl(this.subDirs.ads, uniqueFilename);
    } catch (error) {
      console.error(`Error uploading ad media for ad ${adId}, campaign ${campaignId}:`, error);
      throw error;
    }
  }

  /**
   * Upload QR code image
   * @param {Object} file - File object with buffer, originalname, mimetype, and size
   * @param {Number} merchantId - Merchant ID
   * @returns {String} Public URL for the QR code image
   */
  async uploadQRCode(file, merchantId) {
    try {
      // Validate file
      this._validateFile(file, 'qrcode');

      // Generate unique filename with merchant ID prefix
      const uniqueFilename = `qr_merchant_${merchantId}_${this._generateUniqueFilename(file.originalname)}`;
      
      // Save file
      await this._saveFile(file.buffer, uniqueFilename, this.subDirs.qrcodes);
      
      // Return public URL
      return this._getPublicUrl(this.subDirs.qrcodes, uniqueFilename);
    } catch (error) {
      console.error(`Error uploading QR code for merchant ${merchantId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a file
   * @param {String} fileUrl - Public URL of the file to delete
   * @returns {Boolean} Whether deletion was successful
   */
  async deleteFile(fileUrl) {
    try {
      // Extract filename and subdirectory from URL
      const urlPath = fileUrl.split('/uploads/')[1];
      if (!urlPath) {
        throw new Error('Invalid file URL');
      }
      
      const [subDir, ...filenameParts] = urlPath.split('/');
      const filename = filenameParts.join('/');
      
      // Construct file path
      const filePath = path.join(this.uploadDir, subDir, filename);
      
      // Check if file exists
      if (fs.existsSync(filePath)) {
        // Delete file
        await unlink(filePath);
        return true;
      } else {
        console.warn(`File not found for deletion: ${filePath}`);
        return false;
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  /**
   * Generate data URL from file buffer (for testing/preview)
   * @param {Buffer} buffer - File buffer
   * @param {String} mimetype - File MIME type
   * @returns {String} Data URL
   */
  generateDataUrl(buffer, mimetype) {
    return `data:${mimetype};base64,${buffer.toString('base64')}`;
  }
}

module.exports = new UploadService();