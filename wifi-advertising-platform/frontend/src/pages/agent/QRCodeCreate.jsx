import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import DashboardTemplate from '../../templates/DashboardTemplate';

const QRCodeCreatePage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="user"
        userName="Visitor"
        pageTitle="Create QR Code"
      >
        <p className="text-center text-gray-500">Please log in to create a QR code.</p>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      role="agent"
      userName={user?.name || "Agent"}
      pageTitle="Create QR Code"
    >
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-4 text-black">Generate QR Code</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">QR Code Name</label>
            <input
              type="text"
              name="qrCodeName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Merchant</label>
            <select
              name="merchant"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Merchant</option>
              {/* Populate with merchant options */}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Expiration Date</label>
            <input
              type="date"
              name="expirationDate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
          >
            Generate QR Code
          </button>
        </form>
      </div>
    </DashboardTemplate>
  );
};

export default QRCodeCreatePage;