import React from 'react';
import DashboardTemplate from '../../templates/DashboardTemplate';

const AboutUsPage = () => {
  return (
    <DashboardTemplate
      role="user"
      userName="Jane Doe"
      pageTitle="About Us"
    >
      <div className="space-y-4">
        <h2 className="text-xl font-bold">About Us</h2>
        <p className="text-sm text-gray-500">
          We are a platform dedicated to providing seamless WiFi connectivity and enhancing user experiences.
        </p>
        <h3 className="text-lg font-semibold">Contact Us</h3>
        <p className="text-sm text-gray-500">Email: support@wifiportal.com</p>
        <p className="text-sm text-gray-500">Phone: +1 234 567 890</p>
        <h3 className="text-lg font-semibold">Feedback</h3>
        <p className="text-sm text-gray-500">We value your feedback. Please let us know how we can improve!</p>
      </div>
    </DashboardTemplate>
  );
};

export default AboutUsPage;