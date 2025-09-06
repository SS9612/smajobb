import React from 'react';
import { Link } from 'react-router-dom';

const RegisterSuccess: React.FC = () => {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Välkommen till Småjobb!
      </h2>
      
      <p className="text-gray-600 mb-6">
        Ditt konto har skapats framgångsrikt. Du kan nu logga in och börja söka efter jobb.
      </p>
      
      <div className="space-y-4">
        <Link
          to="/login"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium inline-block text-center"
        >
          Logga in
        </Link>
        
        <Link
          to="/"
          className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium inline-block text-center"
        >
          Tillbaka till startsidan
        </Link>
      </div>
    </div>
  );
};

export default RegisterSuccess;
