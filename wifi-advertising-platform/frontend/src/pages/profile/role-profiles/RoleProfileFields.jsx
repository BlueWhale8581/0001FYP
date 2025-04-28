import React from 'react';

/**
 * Admin Profile Fields Component
 */
export const AdminProfileFields = ({ roleData, editMode, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-gray-700 mb-1">Admin Level</label>
        {editMode ? (
          <select
            name="adminLevel"
            value={roleData.adminLevel || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="super">Super Admin</option>
            <option value="standard">Standard Admin</option>
            <option value="limited">Limited Admin</option>
          </select>
        ) : (
          <p className="text-gray-900 capitalize">{roleData.adminLevel || 'Standard Admin'}</p>
        )}
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Department</label>
        {editMode ? (
          <input
            type="text"
            name="department"
            value={roleData.department || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        ) : (
          <p className="text-gray-900">{roleData.department || 'General'}</p>
        )}
      </div>
    </div>
  );
};

/**
 * Agent Profile Fields Component
 */
export const AgentProfileFields = ({ roleData, editMode, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-gray-700 mb-1">Commission Rate (%)</label>
        {editMode ? (
          <input
            type="number"
            step="0.01"
            name="commission_rate"
            value={roleData.commission_rate || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        ) : (
          <p className="text-gray-900">{roleData.commission_rate || '0.00'}%</p>
        )}
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Territory</label>
        {editMode ? (
          <input
            type="text"
            name="territory"
            value={roleData.territory || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        ) : (
          <p className="text-gray-900">{roleData.territory || 'Not assigned'}</p>
        )}
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm text-gray-700 mb-1">Active Merchants</label>
        <p className="text-gray-900">{roleData.activeMerchants || 0}</p>
      </div>
    </div>
  );
};

/**
 * Advertiser Profile Fields Component
 */
export const AdvertiserProfileFields = ({ roleData, editMode, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-gray-700 mb-1">Company Name</label>
        {editMode ? (
          <input
            type="text"
            name="company_name"
            value={roleData.company_name || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        ) : (
          <p className="text-gray-900">{roleData.company_name || 'Not provided'}</p>
        )}
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Company Email</label>
        {editMode ? (
          <input
            type="email"
            name="company_email"
            value={roleData.company_email || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        ) : (
          <p className="text-gray-900">{roleData.company_email || 'Not provided'}</p>
        )}
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Company Phone</label>
        {editMode ? (
          <input
            type="tel"
            name="company_phone"
            value={roleData.company_phone || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        ) : (
          <p className="text-gray-900">{roleData.company_phone || 'Not provided'}</p>
        )}
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Industry</label>
        {editMode ? (
          <input
            type="text"
            name="industry"
            value={roleData.industry || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        ) : (
          <p className="text-gray-900">{roleData.industry || 'Not specified'}</p>
        )}
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm text-gray-700 mb-1">Company Address</label>
        {editMode ? (
          <textarea
            name="company_address"
            value={roleData.company_address || ''}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        ) : (
          <p className="text-gray-900">{roleData.company_address || 'Not provided'}</p>
        )}
      </div>
    </div>
  );
};

/**
 * Merchant Profile Fields Component
 */
export const MerchantProfileFields = ({ roleData, editMode, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-gray-700 mb-1">Business Name</label>
        {editMode ? (
          <input
            type="text"
            name="business_name"
            value={roleData.business_name || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        ) : (
          <p className="text-gray-900">{roleData.business_name || 'Not provided'}</p>
        )}
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Business Email</label>
        {editMode ? (
          <input
            type="email"
            name="business_email"
            value={roleData.business_email || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        ) : (
          <p className="text-gray-900">{roleData.business_email || 'Not provided'}</p>
        )}
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Business Phone</label>
        {editMode ? (
          <input
            type="tel"
            name="business_phone"
            value={roleData.business_phone || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        ) : (
          <p className="text-gray-900">{roleData.business_phone || 'Not provided'}</p>
        )}
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Business Category</label>
        {editMode ? (
          <input
            type="text"
            name="business_category"
            value={roleData.business_category || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        ) : (
          <p className="text-gray-900">{roleData.business_category || 'Not specified'}</p>
        )}
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Tax ID</label>
        {editMode ? (
          <input
            type="text"
            name="tax_id"
            value={roleData.tax_id || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        ) : (
          <p className="text-gray-900">{roleData.tax_id || 'Not provided'}</p>
        )}
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Approval Status</label>
        <p className="text-gray-900 capitalize">{roleData.approval_status || 'Pending'}</p>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm text-gray-700 mb-1">Business Address</label>
        {editMode ? (
          <textarea
            name="business_address"
            value={roleData.business_address || ''}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        ) : (
          <p className="text-gray-900">{roleData.business_address || 'Not provided'}</p>
        )}
      </div>
    </div>
  );
};

export { AdminProfileFields, AgentProfileFields, AdvertiserProfileFields, MerchantProfileFields };