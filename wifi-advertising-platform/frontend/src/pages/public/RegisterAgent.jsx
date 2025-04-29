import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Button from '../../components/common/Button';
import { useRegister } from '../../hooks/useAuth';

const RegisterPage = () => {
  const { register, loading, error, success } = useRegister();
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Submit registration
    const result = await registerAgent({
      role: 'agent', // Fixed role
      userId, // Include userId from URL
      commission_rate: 0.5,
      territory: 'Malaysia'
    });

    // Redirect on success after a delay
    if (result && result.success) {
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <DashboardTemplate
      role="user"
      userName="Visitor"
      pageTitle="Register"
    >
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-4">Register as Agent</h2>
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Registration successful! Please check your email to verify your account.
            <p className="text-sm">Redirecting to login page...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Button
            text={loading ? 'Submitting...' : 'Register'}
            type="submit"
            disabled={loading}
            className="w-full"
          />
        </form>
      </div>
    </DashboardTemplate>
  );
};

export default RegisterPage;