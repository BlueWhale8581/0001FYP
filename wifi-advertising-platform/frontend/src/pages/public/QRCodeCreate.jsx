import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ADMIN_ID = 100000034;

const PublicQRCodeCreate = () => {
  const [merchantId, setMerchantId] = useState('');
  const [merchants, setMerchants] = useState([]);
  const [status, setStatus] = useState('ACTIVE');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [qrCodeName, setQRCodeName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Use hardcoded merchant list from screenshot for demo
    setMerchants([
      { id: 10000001, business_name: "Food Truck" },
      { id: 10000007, business_name: "Merchant One" },
      { id: 10000008, business_name: "Merchant Two" },
      { id: 10000013, business_name: "Kedai Roti" },
      { id: 10000014, business_name: "Kedai Nasi" },
      { id: 10000015, business_name: "Kedai Makanan" },
      { id: 10000019, business_name: "Kedai Pakaian" },
      { id: 10000021, business_name: "Kedai Perabot" },
      { id: 10000030, business_name: "non" }
    ]);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setQrImageUrl('');
    try {
      // For demo: generate QR code content as WiFi config string
      const wifiString = `WIFI:T:WPA;S:${ssid};P:${password};;`;

      // Call backend to generate QR code image and save it in /uploads/qr_codes/
      const res = await fetch('/api/demo/qrcodes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_id: merchantId,
          ssid,
          password,
          qr_content: wifiString,
          activation_status: status,
          created_by: ADMIN_ID,
          name: qrCodeName,
          expiration_date: expirationDate,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessage('QR Code created!');
        setQrImageUrl(data.code_image_url); // e.g. "/uploads/qr_codes/filename.png"
      } else {
        setMessage('Failed to create QR Code');
      }
    } catch {
      setMessage('Error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center mb-4 text-black">Generate QR Code (Demo)</h2>
      <Link to="/demo/qrcodes" className="text-orange-500 underline mb-4 inline-block">Back to QR Codes</Link>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm text-gray-700">QR Code Name</label>
          <input
            type="text"
            name="qrCodeName"
            value={qrCodeName}
            onChange={e => setQRCodeName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Merchant</label>
          <select
            name="merchant"
            value={merchantId}
            onChange={e => setMerchantId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Merchant</option>
            {merchants.map(m => (
              <option key={m.id} value={m.id}>
                {m.business_name || m.name || `Merchant #${m.id}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700">SSID</label>
          <input
            type="text"
            value={ssid}
            onChange={e => setSsid(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Password</label>
          <input
            type="text"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Expiration Date</label>
          <input
            type="date"
            name="expirationDate"
            value={expirationDate}
            onChange={e => setExpirationDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Generate QR Code'}
        </button>
        {message && <div className="mt-2 text-center">{message}</div>}
      </form>
      {qrImageUrl && (
        <div className="mt-6 text-center">
          <p className="mb-2">Generated QR Code:</p>
          <img src={qrImageUrl} alt="Generated QR Code" className="mx-auto w-48 h-48 border rounded" />
        </div>
      )}
    </div>
  );
};

export default PublicQRCodeCreate;
