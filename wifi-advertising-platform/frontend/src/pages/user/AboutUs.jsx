import React, { useState, useEffect } from 'react';
import DashboardTemplate from '../../templates/DashboardTemplate';
import axios from 'axios'; // Import axios for API calls

const AboutUsPage = () => {
  const [userRole, setUserRole] = useState('user'); // Default role is "public"
  const [userName, setUserName] = useState('Visitor'); // Default username is "Visitor"

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

  return (
    <DashboardTemplate
      role={userRole}
      userName={userName}
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