import React, { useState } from 'react';
import RegisterHeader from '../components/auth/RegisterHeader';
import RegisterForm from '../components/auth/RegisterForm';
import RegisterSuccess from '../components/auth/RegisterSuccess';
import RegisterFooter from '../components/auth/RegisterFooter';

const Register: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSuccess = () => {
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <RegisterSuccess />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <RegisterHeader />

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm onSuccess={handleSuccess} />
          <RegisterFooter />
        </div>
      </div>
    </div>
  );
};

export default Register;