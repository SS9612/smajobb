import React from 'react';
import { Link } from 'react-router-dom';

const RegisterHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <Link to="/" className="inline-block mb-6">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">Småjobb</span>
        </div>
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Skapa ditt konto
      </h1>
      <p className="text-gray-600">
        Börja din resa med Småjobb och hitta perfekta extrajobb för ungdomar
      </p>
    </div>
  );
};

export default RegisterHeader;
