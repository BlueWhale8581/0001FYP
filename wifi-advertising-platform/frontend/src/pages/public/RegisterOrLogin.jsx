import React from 'react';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Button from '../../components/common/Button';

const RegisterOrLoginPage = () => {
  return (
    <DashboardTemplate
      role="user"
      userName="Visitor"
      pageTitle="Register or Login"
    >
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold">Welcome to WiFi Portal</h2>
        <p className="text-sm text-gray-500">Please register or log in to continue.</p>
        <div className="flex justify-center space-x-4">
          <Button text="Register" onClick={() => window.location.href = '/register'} />
          <Button text="Login" onClick={() => window.location.href = '/login'} />
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default RegisterOrLoginPage;