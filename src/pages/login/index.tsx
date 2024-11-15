import React from 'react';
import LoginForm from '../../components/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 space-y-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Bem-vindo de volta
        </h2>
        <p className="text-sm text-center text-gray-500">
          Faça login na sua conta para continuar
        </p>
        <LoginForm />
        <p className="text-sm text-center text-gray-600">
          Não possui uma conta?{' '}
          <a
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
