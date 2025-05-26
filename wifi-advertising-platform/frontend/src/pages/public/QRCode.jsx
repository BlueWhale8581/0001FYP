import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ADMIN_ID = 100000034;

const PublicQRCodeList = () => {
  const [qrCodes, setQRCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/qrcodes/agent/${ADMIN_ID}`)
      .then(res => res.json())
      .then(data => {
        // Ensure qrCodes is always an array
        setQRCodes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setQRCodes([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Public QR Codes (Demo)</h1>
      <Link
        to="/demo/qrcodes/create"
        className="inline-block mb-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        Create QR Code
      </Link>
      {loading ? (
        <p>Loading...</p>
      ) : qrCodes.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No QR codes found.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {qrCodes.map(qr => (
            <li key={qr.id} className="border p-4 rounded flex items-center space-x-4">
              <img src={qr.code_image_url} alt="QR" className="w-20 h-20 object-contain bg-gray-100 rounded" />
              <div>
                <div>ID: {qr.id}</div>
                <div>Status: {qr.activation_status}</div>
                <div>Merchant ID: {qr.merchant_id}</div>
                <div>Created: {new Date(qr.created_at).toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PublicQRCodeList;
