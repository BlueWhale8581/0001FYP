// components/layout/Footer.jsx
import React from 'react';

const Footer = ({ version = '1.0.0', appName = 'WiFi Service Portal' }) => {
  return (
    <div className="bg-gray-100 border-t text-center py-1 text-xs text-gray-500">
      {appName} v{version}
    </div>
  );
};

export default Footer;