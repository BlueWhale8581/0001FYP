import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Button from '../../components/common/Button';

const RegisterAgent = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData] = useState({
    commission_rate: '5',
    territory: 'Malaysia'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'agent',
          userId,
          roleData: {
            commission_rate: formData.commission_rate,
            territory: formData.territory
          }
        }),
      });

      if (response.ok) {
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please login to continue.' 
          }
        });
      } else {
        throw new Error('Failed to register agent details');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <DashboardTemplate
      role="user"
      userName="New Agent"
      pageTitle="Complete Agent Registration"
    >
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-4 text-black">Agent Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4 bg-gray-50 p-4 rounded-md">
            <div>
              <label className="block text-sm font-medium text-gray-700">Commission Rate</label>
              <p className="text-gray-600">{formData.commission_rate}%</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Territory</label>
              <p className="text-gray-600">{formData.territory}</p>
            </div>
          </div>

          <Button
            text="Complete Registration"
            type="submit"
            className="w-full"
          />
        </form>
      </div>
    </DashboardTemplate>
  );
};

export default RegisterAgent;
