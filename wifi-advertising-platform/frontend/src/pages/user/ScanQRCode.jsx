import React, { useState, useEffect, useRef } from 'react';
import DashboardTemplate from '../../templates/DashboardTemplate';
import EmptyState from '../../components/common/EmptyState';
import { Camera } from 'lucide-react';

const ScanQRCodePage = () => {
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [result, setResult] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startScanning = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
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
      tracks.forEach(track => track.stop());
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
      
      // Here you would implement the QR code detection
      // For actual implementation, you would need to use a library like jsQR
      // This is just a placeholder - in a real app, the library would detect and decode the QR code
      // setResult('wifi:S:NetworkName;T:WPA;P:password123;;');
      
      // For demo purposes, we'll simulate finding a QR code after 5 seconds
      if (!result) {
        setTimeout(() => {
          setResult('wifi:S:ExampleWiFi;T:WPA;P:password123;;');
        }, 5000);
      }
    }
    
    if (!result) {
      requestAnimationFrame(detectQRCode);
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const handleWifiConnect = () => {
    if (result) {
      // Parse the WiFi QR code format
      // Format: WIFI:S:<SSID>;T:<WPA|WEP|>;P:<password>;;
      const ssidMatch = result.match(/S:(.*?);/);
      const passwordMatch = result.match(/P:(.*?);/);
      const typeMatch = result.match(/T:(.*?);/);
      
      if (ssidMatch && passwordMatch) {
        const ssid = ssidMatch[1];
        const password = passwordMatch[1];
        const type = typeMatch ? typeMatch[1] : 'WPA';
        
        console.log('Connecting to WiFi:', { ssid, type, password });
        // In a real app, you would handle the WiFi connection here
        // Note: Direct WiFi connection from the browser is not possible without native integrations
        alert(`WiFi details detected!\nNetwork: ${ssid}\nPassword: ${password}\n\nYour device would now connect to this network.`);
      }
    }
  };

  useEffect(() => {
    if (result) {
      handleWifiConnect();
      stopScanning();
    }
  }, [result]);

  return (
    <DashboardTemplate
      role="user"
      userName="Jane Doe"
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
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full object-cover opacity-0"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-white rounded-lg"></div>
            </div>
          </div>
          
          {hasPermission === false && (
            <div className="text-red-500 mb-4 text-center">
              Camera access denied. Please enable camera access in your browser settings.
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