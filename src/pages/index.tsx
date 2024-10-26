import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  email: string;
  firstName: string;
  id: number;
  isVerified: boolean;
  lastName: string;
}

const Index: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const user = localStorage.getItem('user');

    if (user) {
      setUser(JSON.parse(user));
    }

    if (!accessToken || !refreshToken) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='bg-white shadow-lg rounded-lg p-8 w-96'>
        <h1 className='text-3xl font-bold text-center text-indigo-600 mb-4'>
          Página Protegida
        </h1>
        <p className='text-center text-gray-600 mb-2'>Bem-vindo!</p>
        <div className='bg-indigo-100 p-4 rounded-lg mb-6'>
          <p className='text-lg font-semibold text-indigo-800'>
            {user
              ? `${user.firstName} ${user.lastName}`
              : 'Usuário Desconhecido'}
          </p>
          <p className='text-sm text-gray-500'>{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className='w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200'
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default Index;
