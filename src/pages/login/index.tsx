import React from 'react';
import LoginForm from '../../components/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
