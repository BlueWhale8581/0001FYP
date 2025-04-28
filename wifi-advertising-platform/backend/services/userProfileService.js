const UserModel = require('../models/User');
const db = require('../database'); // Assuming you have a database connection module

class UserProfileService {
  async getUserProfile(userId, role) {
    try {
      // Get base user data
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Get role-specific data
      let roleSpecificData = {};

      switch (role) {
        case 'merchant':
          roleSpecificData = await this.getMerchantData(userId);
          break;
        case 'agent':
          roleSpecificData = await this.getAgentData(userId);
          break;
        case 'advertiser':
          roleSpecificData = await this.getAdvertiserData(userId);
          break;
        default:
          // No extra data needed for admin or basic profiles
          break;
      }

      return {
        ...user,
        ...roleSpecificData,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfile(userId, role, profileData) {
    try {
      // Update base user data
      const { firstName, lastName, phone, email, ...roleSpecificData } = profileData;

      const baseUpdate = {};
      if (firstName) baseUpdate.first_name = firstName;
      if (lastName) baseUpdate.last_name = lastName;
      if (phone) baseUpdate.phone = phone;
      if (email) baseUpdate.email = email;

      await UserModel.update(userId, baseUpdate);

      // Update role-specific data
      switch (role) {
        case 'merchant':
          await this.updateMerchantData(userId, roleSpecificData);
          break;
        case 'agent':
          await this.updateAgentData(userId, roleSpecificData);
          break;
        case 'advertiser':
          await this.updateAdvertiserData(userId, roleSpecificData);
          break;
        default:
          // No extra data for admin
          break;
      }

      // Return updated profile
      return this.getUserProfile(userId, role);
    } catch (error) {
      throw error;
    }
  }

  // Helper methods for role-specific data
  async getMerchantData(userId) {
    const query = `
      SELECT business_name, business_address, business_phone, business_email, business_category, tax_id, logo_url, approval_status
      FROM merchants
      WHERE id = @userId
    `;
    const result = await db.query(query, { userId });
    return result.recordset[0] || {};
  }

  async getAgentData(userId) {
    const query = `
      SELECT commission_rate, territory
      FROM agents
      WHERE id = @userId
    `;
    const result = await db.query(query, { userId });
    return result.recordset[0] || {};
  }

  async getAdvertiserData(userId) {
    const query = `
      SELECT company_name, company_address, company_phone, company_email, industry
      FROM advertisers
      WHERE id = @userId
    `;
    const result = await db.query(query, { userId });
    return result.recordset[0] || {};
  }

  async updateMerchantData(userId, data) {
    const query = `
      UPDATE merchants
      SET business_name = @businessName,
          business_address = @businessAddress,
          business_phone = @businessPhone,
          business_email = @businessEmail,
          business_category = @businessCategory,
          tax_id = @taxId,
          logo_url = @logoUrl,
          approval_status = @approvalStatus,
          updated_at = GETDATE()
      WHERE id = @userId
    `;
    await db.query(query, {
      userId,
      businessName: data.businessName,
      businessAddress: data.businessAddress,
      businessPhone: data.businessPhone,
      businessEmail: data.businessEmail,
      businessCategory: data.businessCategory,
      taxId: data.taxId,
      logoUrl: data.logoUrl,
      approvalStatus: data.approvalStatus,
    });
  }

  async updateAgentData(userId, data) {
    const query = `
      UPDATE agents
      SET commission_rate = @commissionRate,
          territory = @territory,
          updated_at = GETDATE()
      WHERE id = @userId
    `;
    await db.query(query, {
      userId,
      commissionRate: data.commissionRate,
      territory: data.territory,
    });
  }

  async updateAdvertiserData(userId, data) {
    const query = `
      UPDATE advertisers
      SET company_name = @companyName,
          company_address = @companyAddress,
          company_phone = @companyPhone,
          company_email = @companyEmail,
          industry = @industry,
          updated_at = GETDATE()
      WHERE id = @userId
    `;
    await db.query(query, {
      userId,
      companyName: data.companyName,
      companyAddress: data.companyAddress,
      companyPhone: data.companyPhone,
      companyEmail: data.companyEmail,
      industry: data.industry,
    });
  }
}

module.exports = new UserProfileService();