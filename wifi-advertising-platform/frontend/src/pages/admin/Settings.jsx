import React, { useState } from 'react';
import { Save, Server, Lock, Globe, Bell, Shield } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const SettingsPage = () => {
  // Form states
  const [serverSettings, setServerSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    cacheTimeout: 60,
    maxConnections: 1000
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordExpiry: 90,
    sessionTimeout: 30,
    allowedIPs: '0.0.0.0/0'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    alertThreshold: 'medium'
  });

  // Handle form changes
  const handleServerSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServerSettings({
      ...serverSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSecuritySettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNotificationSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Form submission handlers
  const handleServerSettingsSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting server settings:', serverSettings);
    // Implementation would go here
  };

  const handleSecuritySettingsSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting security settings:', securitySettings);
    // Implementation would go here
  };

  const handleNotificationSettingsSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting notification settings:', notificationSettings);
    // Implementation would go here
  };

  return (
    <DashboardTemplate
      role="admin"
      userName="John Admin"
      notifications={[
        { id: 1, type: 'warning', message: 'System update required', time: '5m ago', read: false },
        { id: 2, type: 'error', message: 'Server #3 is offline', time: '30m ago', read: false },
      ]}
      pageTitle="System Settings"
    >
      {/* Server Settings */}
      <Card title="Server Configuration">
        <form onSubmit={handleServerSettingsSubmit}>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Server size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Server Settings</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={serverSettings.maintenanceMode}
                    onChange={handleServerSettingChange}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Maintenance Mode</span>
                </label>
                <p className="text-xs text-gray-500 ml-6 mt-1">
                  When enabled, the system will be accessible only to administrators.
                </p>
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="debugMode"
                    checked={serverSettings.debugMode}
                    onChange={handleServerSettingChange}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Debug Mode</span>
                </label>
                <p className="text-xs text-gray-500 ml-6 mt-1">
                  Enable detailed logging for troubleshooting.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Cache Timeout (minutes)
                </label>
                <input
                  type="number"
                  name="cacheTimeout"
                  value={serverSettings.cacheTimeout}
                  onChange={handleServerSettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Max Connections
                </label>
                <input
                  type="number"
                  name="maxConnections"
                  value={serverSettings.maxConnections}
                  onChange={handleServerSettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                text="Save Server Settings"
                type="submit"
                className="flex items-center"
              />
            </div>
          </div>
        </form>
      </Card>

      {/* Security Settings */}
      <Card title="Security Configuration" className="mt-4">
        <form onSubmit={handleSecuritySettingsSubmit}>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 mr-4">
                <Shield size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Security Settings</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onChange={handleSecuritySettingChange}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Require Two-Factor Authentication</span>
                </label>
                <p className="text-xs text-gray-500 ml-6 mt-1">
                  Enforce 2FA for all administrative accounts.
                </p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Password Expiry (days)
                </label>
                <input
                  type="number"
                  name="passwordExpiry"
                  value={securitySettings.passwordExpiry}
                  onChange={handleSecuritySettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  name="sessionTimeout"
                  value={securitySettings.sessionTimeout}
                  onChange={handleSecuritySettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Allowed IP Addresses
                </label>
                <input
                  type="text"
                  name="allowedIPs"
                  value={securitySettings.allowedIPs}
                  onChange={handleSecuritySettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g. 192.168.1.0/24"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                text="Save Security Settings"
                type="submit"
                className="flex items-center bg-red-600 hover:bg-red-700"
              />
            </div>
          </div>
        </form>
      </Card>

      {/* Notification Settings */}
      <Card title="Notification Settings" className="mt-4">
        <form onSubmit={handleNotificationSettingsSubmit}>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Bell size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Alert Configuration</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="emailAlerts"
                    checked={notificationSettings.emailAlerts}
                    onChange={handleNotificationSettingChange}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Email Alerts</span>
                </label>
                <p className="text-xs text-gray-500 ml-6 mt-1">
                  Send system alerts to administrator email addresses.
                </p>
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="smsAlerts"
                    checked={notificationSettings.smsAlerts}
                    onChange={handleNotificationSettingChange}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">SMS Alerts</span>
                </label>
                <p className="text-xs text-gray-500 ml-6 mt-1">
                  Send critical alerts via SMS to registered phone numbers.
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Alert Threshold
              </label>
              <select
                name="alertThreshold"
                value={notificationSettings.alertThreshold}
                onChange={handleNotificationSettingChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="low">Low (All alerts)</option>
                <option value="medium">Medium (Warnings and Errors)</option>
                <option value="high">High (Critical Errors Only)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Set the minimum severity level for sending notifications.
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button
                text="Save Notification Settings"
                type="submit"
                className="flex items-center bg-purple-600 hover:bg-purple-700"
              />
            </div>
          </div>
        </form>
      </Card>
    </DashboardTemplate>
  );
};

export default SettingsPage;