import React from 'react';
import { Link } from 'react-router-dom';

const RegisterFooter: React.FC = () => {
  return (
    <div className="text-center mt-8">
      <p className="text-gray-600">
        Har du redan ett konto?{' '}
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Logga in här
        </Link>
      </p>
    </div>
  );
};

export default RegisterFooter;
