import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr'; // Import the jsQR library
import DashboardTemplate from '../../templates/DashboardTemplate';
import EmptyState from '../../components/common/EmptyState';
import { Camera } from 'lucide-react';
import axios from 'axios'; // Import axios for API calls

const ScanQRCodePage = () => {
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [result, setResult] = useState(null);
  const [userRole, setUserRole] = useState('user'); // Default role is "public"
  const [userName, setUserName] = useState('Visitor'); // Default username is "Visitor"
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Fetch user data based on token
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      if (token) {
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { role, username } = response.data;
        setUserRole(role);
        setUserName(username);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserRole('user');
      setUserName('Visitor');
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data on component mount
  }, []);

  const startScanning = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
        setHasPermission(true);
        detectQRCode();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
    }

    setScanning(false);
  };

  const detectQRCode = () => {
    if (!scanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      const context = canvas.getContext('2d');
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Use jsQR to detect QR code
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        setResult(code.data); // Set the QR code result
        stopScanning(); // Stop scanning after detecting a QR code
      } else {
        requestAnimationFrame(detectQRCode); // Continue scanning
      }
    } else {
      requestAnimationFrame(detectQRCode); // Retry if video is not ready
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const handleMerchantConnect = () => {
    if (result) {
      const url = new URL(result);
      const merchantId = url.searchParams.get('merchant');
      const token = url.searchParams.get('token');

      if (merchantId && token) {
        console.log('Connecting to merchant:', { merchantId, token });
        alert(`Merchant ID: ${merchantId}\nToken: ${token}`);
      } else {
        alert('Invalid QR code format.');
      }
    }
  };

  useEffect(() => {
    if (result) {
      handleMerchantConnect();
    }
  }, [result]);

  return (
    <DashboardTemplate
      role={userRole}
      userName={userName}
      pageTitle="Scan QR Code"
    >
      {!scanning ? (
        <EmptyState
          title="Scan QR Code"
          description="Point your camera at the QR code to connect to WiFi."
          actionText="Start Scanning"
          onActionClick={startScanning}
        />
      ) : (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto">
          <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover bg-black"
              autoPlay
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover opacity-0"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-4 border-dashed border-blue-500 rounded-lg"></div>
            </div>
          </div>

          {hasPermission === false && (
            <div className="text-red-500 mb-4 text-center">
              Camera access denied. Please enable camera access in your browser
              settings.
            </div>
          )}

          <button
            onClick={stopScanning}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Cancel
          </button>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 rounded-md">
          <h3 className="font-bold text-green-800">QR Code Detected!</h3>
          <p>WiFi network information found. Attempting to connect...</p>
        </div>
      )}
    </DashboardTemplate>
  );
};

export default ScanQRCodePage;